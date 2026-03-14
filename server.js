'use strict';

require('dotenv').config();

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Resend } = require('resend');

const app = express();

// ==================== KONFIGURATION ====================

const CONFIG = {
    PORT: parseInt(process.env.PORT, 10) || 3000,
    NODE_ENV: process.env.NODE_ENV || 'production',
    RESEND_API_KEY: process.env.RESEND_API_KEY || '',
    RESEND_FROM: process.env.RESEND_FROM || 'KI-Prozessnavigator <kontakt@ki-prozessnavigator.de>',
    RECIPIENT_EMAIL: process.env.RECIPIENT_EMAIL || 'kontakt@ki-prozessnavigator.de',
    CSRF_SECRET: process.env.CSRF_SECRET || '',
    HONEYPOT_FIELD: process.env.HONEYPOT_FIELD || 'website',
    ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || 'https://ki-prozessnavigator.de,https://www.ki-prozessnavigator.de').split(',').map(s => s.trim()),
    CALENDLY_URL: process.env.CALENDLY_URL || 'https://calendly.com/d-buchele-ki-prozessnavigator/30min',
};

const resend = new Resend(CONFIG.RESEND_API_KEY);

// ==================== MIDDLEWARE ====================

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// CORS für API-Routen
app.use('/api', (req, res, next) => {
    const origin = req.headers.origin || '';
    if (CONFIG.ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

// CSRF-Schutz via Origin/Referer
function enforceCsrfOrigin(req) {
    const origin = req.headers.origin || '';
    const referer = req.headers.referer || '';
    if (origin) return CONFIG.ALLOWED_ORIGINS.includes(origin);
    if (referer) {
        try {
            const url = new URL(referer);
            return CONFIG.ALLOWED_ORIGINS.includes(`${url.protocol}//${url.host}`);
        } catch { return false; }
    }
    return true; // same-origin ohne Header → erlauben
}

// Rate Limiter
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, max: 10,
    message: { success: false, message: 'Zu viele Anfragen. Bitte versuch es in einer Stunde erneut.' },
    standardHeaders: true, legacyHeaders: false, keyGenerator: (req) => req.ip,
});

const checklistLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, max: 20,
    message: { success: false, message: 'Zu viele Anfragen. Bitte versuch es in einer Stunde erneut.' },
    standardHeaders: true, legacyHeaders: false, keyGenerator: (req) => req.ip,
});

// ==================== HILFSFUNKTIONEN ====================

function sanitize(str) {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function checkHoneypot(data) {
    return !data[CONFIG.HONEYPOT_FIELD];
}

function getClientIp(req) {
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || '0.0.0.0';
}

function nowFormatted() {
    return new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });
}

// ==================== E-MAIL TEMPLATES ====================

function contactOwnerSubject(data) {
    const name = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Unbekannt';
    const company = data.company ? ` – ${data.company}` : '';
    return `🚀 Neue Anfrage von ${name}${company}`;
}

function contactOwnerHtml(data, ip) {
    const fields = [];
    fields.push({ icon: '👤', label: 'Name', value: `${data.firstName} ${data.lastName}`, bold: true });
    if (data.email) fields.push({ icon: '📧', label: 'E-Mail', value: `<a href="mailto:${data.email}" style="color:#0077FF;text-decoration:none;">${data.email}</a>` });
    if (data.phone) fields.push({ icon: '📞', label: 'Telefon', value: data.phone });
    if (data.company) fields.push({ icon: '🏢', label: 'Firma', value: data.company });
    if (data.companySize) fields.push({ icon: '👥', label: 'Größe', value: data.companySize });
    if (data.interest) fields.push({ icon: '🎯', label: 'Interesse', value: data.interest });
    if (data.message) fields.push({ icon: '💬', label: 'Nachricht', value: data.message.replace(/\n/g, '<br>'), isMessage: true });

    let rowsHtml = '';
    fields.forEach(f => {
        rowsHtml += `<tr>
            <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);width:130px;vertical-align:top;">
                <p style="margin:0;font-size:12px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;">${f.icon} ${f.label}</p>
            </td>
            <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);vertical-align:top;">
                <p style="margin:0;font-size:${f.isMessage ? '14' : '15'}px;${f.bold ? 'font-weight:600;' : ''}color:${f.isMessage ? '#d1d5db' : '#f3f4f6'};${f.isMessage ? 'line-height:1.55;' : ''}">${f.value}</p>
            </td>
        </tr>`;
    });

    const emailLink = data.email ? `mailto:${data.email}` : '#';
    const phoneLink = data.phone ? `tel:${data.phone.replace(/[^+0-9]/g, '')}` : '';

    let actionsHtml = `<td style="padding-right:8px;" width="50%">
        <a href="${emailLink}" style="display:block;background-color:#0077FF;color:#ffffff;text-decoration:none;padding:12px 16px;border-radius:8px;font-weight:700;font-size:14px;text-align:center;">📧 E-Mail schreiben</a>
    </td>`;
    if (phoneLink) {
        actionsHtml += `<td style="padding-left:8px;" width="50%">
            <a href="${phoneLink}" style="display:block;background-color:rgba(0,217,143,0.15);color:#00D98F;text-decoration:none;padding:12px 16px;border-radius:8px;font-weight:700;font-size:14px;text-align:center;border:1px solid rgba(0,217,143,0.3);">📞 Direkt anrufen</a>
        </td>`;
    }

    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0e1a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#0a0e1a;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;">
    <tr><td style="background:linear-gradient(135deg,#0077FF 0%,#00D4FF 100%);border-radius:12px 12px 0 0;padding:20px 24px;text-align:center;">
        <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;">🚀 Neue Anfrage eingegangen</p>
        <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.85);">${nowFormatted()} · ki-prozessnavigator.de</p>
    </td></tr>
    <tr><td style="background-color:#141b2d;border-radius:0 0 12px 12px;border:1px solid rgba(255,255,255,0.06);border-top:none;padding:28px 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${rowsHtml}</table>
        <div style="height:20px;"></div>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>${actionsHtml}</tr></table>
        <div style="height:16px;"></div>
        <p style="margin:0;font-size:11px;color:#9ca3af;">IP: ${ip} · Automatisch generiert von ki-prozessnavigator.de</p>
    </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function contactConfirmationSubject() {
    return 'Deine Anfrage – wir melden uns innerhalb von 24h bei dir';
}

function contactConfirmationHtml(data) {
    const greeting = data.firstName ? `Hallo ${data.firstName},` : 'Hallo,';
    const hl = 'color:#00FFFF;font-weight:700;text-shadow:0 0 8px rgba(0,180,255,0.7),0 0 20px rgba(0,140,255,0.4);';
    const circleGlow = 'box-shadow:0 0 15px rgba(0,119,255,0.5),0 0 30px rgba(0,119,255,0.25);';
    const circle = `width:24px;height:24px;border-radius:50%;background-color:#0077FF;color:#fff;font-size:12px;font-weight:700;line-height:24px;text-align:center;${circleGlow}`;

    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0e1a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#0a0e1a;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;">

    <tr><td align="center" style="padding:0 0 20px;">
        <img src="https://ki-prozessnavigator.de/assets/images/logo.png" alt="KI-Prozessnavigator" height="38" style="height:38px;width:auto;display:block;" onerror="this.src='https://ki-prozessnavigator.de/assets/images/logo.svg';" />
    </td></tr>
    <tr><td style="padding:0 0 24px;"><div style="height:1px;background:rgba(255,255,255,0.06);"></div></td></tr>

    <tr><td style="background-color:#141b2d;border-radius:12px;border:1px solid rgba(255,255,255,0.06);padding:36px 32px;">

        <p style="margin:0 0 6px;font-size:17px;font-weight:700;color:#f3f4f6;">${greeting}</p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:#d1d5db;">danke für deine Nachricht. Du hast den ersten Schritt gemacht – hin zu weniger Verwaltung und mehr Fokus auf das, was in deinem Unternehmen wirklich zählt.</p>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:rgba(0,119,255,0.05);border:1px solid rgba(0,119,255,0.12);border-radius:10px;">
        <tr><td style="padding:24px;">
            <p style="margin:0 0 16px;font-size:15px;font-weight:700;color:#f3f4f6;">So geht es weiter</p>

            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr><td width="36" valign="top" style="padding:0 12px 14px 0;"><div style="${circle}">1</div></td>
            <td valign="top" style="padding:0 0 14px;"><p style="margin:0;font-size:14px;line-height:1.55;color:#d1d5db;">Wir prüfen deine Anfrage und melden uns <strong style="${hl}">innerhalb von 24 Stunden</strong> persönlich bei dir – per E-Mail oder Telefon.</p></td></tr>
            </table>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr><td width="36" valign="top" style="padding:0 12px 14px 0;"><div style="${circle}">2</div></td>
            <td valign="top" style="padding:0 0 14px;"><p style="margin:0;font-size:14px;line-height:1.55;color:#d1d5db;">Du bekommst eine <strong style="${hl}">ehrliche Einschätzung</strong>, wo Automatisierung bei dir den größten Hebel hat – mit konkreten Zahlen.</p></td></tr>
            </table>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr><td width="36" valign="top" style="padding:0 12px 0 0;"><div style="${circle}">3</div></td>
            <td valign="top"><p style="margin:0;font-size:14px;line-height:1.55;color:#d1d5db;"><strong style="${hl}">Kein Verkaufsdruck.</strong> Du entscheidest in Ruhe, ob und wie es weitergeht.</p></td></tr>
            </table>
        </td></tr></table>

        <div style="height:24px;"></div>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:rgba(0,217,143,0.04);border:1px solid rgba(0,217,143,0.10);border-radius:10px;">
        <tr><td style="padding:20px 24px;">
            <p style="margin:0;font-size:14px;line-height:1.6;color:#d1d5db;"><strong style="color:#00D98F;">Kleiner Tipp für unser Gespräch:</strong> Überleg dir schon mal, welcher Prozess in deinem Alltag am meisten Zeit frisst – dann können wir direkt an der Stelle ansetzen, die den größten Unterschied macht.</p>
        </td></tr></table>

        <div style="height:28px;"></div>
        <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;">
            <p style="margin:0;font-size:15px;color:#d1d5db;">Bis bald,</p>
            <p style="margin:4px 0 0;font-size:15px;font-weight:700;color:#f3f4f6;">Dominik Buchele</p>
            <p style="margin:2px 0 0;font-size:13px;color:#9ca3af;">KI-Prozessnavigator · Intelligente Automatisierung für den Mittelstand</p>
        </div>
    </td></tr>

    <tr><td style="height:24px;"></td></tr>
    <tr><td align="center" style="padding:0 0 8px;">
        <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;">KI-Prozessnavigator · Breslauer Str. 11 · 86690 Mertingen</p>
        <p style="margin:0;font-size:12px;color:#9ca3af;"><a href="https://ki-prozessnavigator.de/datenschutz.html" style="color:#0077FF;text-decoration:none;">Datenschutz</a> &nbsp;·&nbsp; <a href="https://ki-prozessnavigator.de/impressum.html" style="color:#0077FF;text-decoration:none;">Impressum</a></p>
    </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function checklistCustomerSubject() {
    return 'Deine Checkliste: 10 Prozesse, die dir sofort Stunden zurückgeben';
}

function checklistCustomerHtml(calendlyUrl) {
    const hl = 'color:#00FFFF;font-weight:700;text-shadow:0 0 8px rgba(0,180,255,0.7),0 0 20px rgba(0,140,255,0.4);';
    const circleGlow = 'box-shadow:0 0 15px rgba(0,119,255,0.5),0 0 30px rgba(0,119,255,0.25);';

    const items = [
        { title: 'Kundenanfragen automatisch beantworten', desc: `Wiederkehrende Fragen beantworten sich von selbst – dein Team kümmert sich nur noch um die Fälle, die wirklich Aufmerksamkeit brauchen. Typisch: <strong style="${hl}">bis zu 60 % weniger Rückfragen</strong>.` },
        { title: 'Anfragen bewerten &amp; priorisieren', desc: `Ob Neukunde oder Bestandskunde – KI erkennt, welche Anfrage dringend ist, und sortiert sie automatisch vor. <strong style="${hl}">Nichts Wichtiges bleibt liegen</strong>.` },
        { title: 'Rechnungen &amp; Belege verarbeiten', desc: `Eingangsrechnungen prüfen, mit Aufträgen abgleichen und zur Freigabe weiterleiten – Fehlerquote <strong style="${hl}">nahe Null</strong>.` },
        { title: 'Angebote &amp; Bestätigungen erstellen', desc: `Vom Kundenwunsch zum fertigen Dokument in <strong style="${hl}">unter einer Minute</strong> – inklusive individueller Kalkulation.` },
        { title: 'E-Mails sortieren &amp; weiterleiten', desc: `Eingehende Nachrichten werden automatisch kategorisiert und an die richtige Person im Team weitergeleitet – <strong style="${hl}">kein manuelles Sortieren</strong> mehr.` },
        { title: 'Termine &amp; Erinnerungen koordinieren', desc: `Kalender abgleichen, verfügbare Slots vorschlagen, buchen und erinnern – <strong style="${hl}">alles automatisch</strong>, ohne Hin-und-Her.` },
        { title: 'Neue Teammitglieder einarbeiten', desc: `Checklisten, Zugänge und Unterlagen werden automatisch zusammengestellt – das Onboarding läuft <strong style="${hl}">strukturiert und ohne Aufwand</strong>.` },
        { title: 'Berichte &amp; Auswertungen generieren', desc: `Wöchentliche oder monatliche Reports entstehen <strong style="${hl}">auf Knopfdruck</strong> – statt stundenlang in Excel.` },
        { title: 'Daten zwischen Systemen synchronisieren', desc: `Ob CRM, Buchhaltung oder Projekttools – alle Systeme sprechen endlich <strong style="${hl}">dieselbe Sprache</strong>.` },
        { title: 'Wiederkehrende Routineaufgaben', desc: `Zahlungserinnerungen, Statusupdates, Benachrichtigungen – <strong style="${hl}">alles läuft von allein</strong>, ohne dass jemand daran denken muss.` },
    ];

    let listHtml = '';
    items.forEach((item, i) => {
        const num = i + 1;
        const isLast = num === 10;
        listHtml += `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="${!isLast ? 'border-bottom:1px solid rgba(255,255,255,0.05);' : ''}">
        <tr>
            <td width="44" valign="top" style="padding:16px 0;">
                <div style="width:30px;height:30px;border-radius:50%;background-color:#0077FF;color:#fff;font-size:${num >= 10 ? '11' : '13'}px;font-weight:700;line-height:30px;text-align:center;${circleGlow}">${num}</div>
            </td>
            <td valign="top" style="padding:16px 0 16px 8px;">
                <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#f3f4f6;">${item.title}</p>
                <p style="margin:0;font-size:13px;line-height:1.55;color:#9ca3af;">${item.desc}</p>
            </td>
        </tr>
        </table>`;
    });

    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0e1a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#0a0e1a;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;">

    <tr><td align="center" style="padding:0 0 20px;">
        <img src="https://ki-prozessnavigator.de/assets/images/logo.png" alt="KI-Prozessnavigator" height="38" style="height:38px;width:auto;display:block;" onerror="this.src='https://ki-prozessnavigator.de/assets/images/logo.svg';" />
    </td></tr>
    <tr><td style="padding:0 0 24px;"><div style="height:1px;background:rgba(255,255,255,0.06);"></div></td></tr>

    <tr><td style="background-color:#141b2d;border-radius:12px;border:1px solid rgba(255,255,255,0.06);padding:36px 32px;">

        <p style="margin:0 0 6px;font-size:17px;font-weight:700;color:#f3f4f6;">Hallo,</p>
        <p style="margin:0 0 8px;font-size:15px;line-height:1.65;color:#d1d5db;">hier ist deine Checkliste – <strong style="${hl}">10 Prozesse</strong>, die sich in den meisten Unternehmen schnell und spürbar automatisieren lassen.</p>
        <p style="margin:0 0 28px;font-size:14px;line-height:1.55;color:#9ca3af;">Jeder einzelne Punkt kann dir und deinem Team wöchentlich Stunden zurückgeben. Geh die Liste durch und frag dich: Wo brennt es bei uns am meisten?</p>

        <div style="border-bottom:2px solid #0077FF;padding-bottom:8px;margin-bottom:20px;">
            <p style="margin:0;font-size:16px;font-weight:700;color:#f3f4f6;">Deine 10 Quick Wins</p>
        </div>

        ${listHtml}

        <div style="height:28px;"></div>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:rgba(0,217,143,0.04);border:1px solid rgba(0,217,143,0.12);border-radius:10px;">
        <tr><td style="padding:24px;">
            <p style="margin:0 0 8px;font-size:16px;font-weight:700;color:#f3f4f6;">Erkennst du dich wieder?</p>
            <p style="margin:0;font-size:14px;line-height:1.6;color:#d1d5db;">Antworte einfach auf diese E-Mail und schreib uns, welcher Punkt bei dir am meisten Zeit frisst. Du bekommst innerhalb von <strong style="${hl}">24 Stunden</strong> eine kostenlose Einschätzung, wo dein größter Automatisierungs-Hebel liegt – inklusive konkretem Vorschlag für den nächsten Schritt.</p>
        </td></tr></table>

        <div style="height:24px;"></div>
        <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;">
            <p style="margin:0;font-size:15px;color:#d1d5db;">Viel Erfolg beim Automatisieren,</p>
            <p style="margin:4px 0 0;font-size:15px;font-weight:700;color:#f3f4f6;">Dominik Buchele</p>
            <p style="margin:2px 0 0;font-size:13px;color:#9ca3af;">KI-Prozessnavigator · Intelligente Automatisierung für den Mittelstand</p>
        </div>
    </td></tr>

    <tr><td style="height:24px;"></td></tr>
    <tr><td align="center" style="padding:0 0 8px;">
        <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;">KI-Prozessnavigator · Breslauer Str. 11 · 86690 Mertingen</p>
        <p style="margin:0;font-size:12px;color:#9ca3af;"><a href="https://ki-prozessnavigator.de/datenschutz.html" style="color:#0077FF;text-decoration:none;">Datenschutz</a> &nbsp;·&nbsp; <a href="https://ki-prozessnavigator.de/impressum.html" style="color:#0077FF;text-decoration:none;">Impressum</a></p>
    </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function checklistOwnerSubject(email) {
    return `📥 Neuer Lead: Checkliste angefordert von ${email}`;
}

function checklistOwnerHtml(email, ip) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0e1a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#0a0e1a;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;">
    <tr><td style="background:linear-gradient(135deg,#0077FF 0%,#00D4FF 100%);border-radius:12px 12px 0 0;padding:20px 24px;text-align:center;">
        <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;">📥 Neuer Checklisten-Lead</p>
        <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.85);">${nowFormatted()} · ki-prozessnavigator.de</p>
    </td></tr>
    <tr><td style="background-color:#141b2d;border-radius:0 0 12px 12px;border:1px solid rgba(255,255,255,0.06);border-top:none;padding:28px 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);width:130px;vertical-align:top;">
                    <p style="margin:0;font-size:12px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;">📧 E-Mail</p>
                </td>
                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);vertical-align:top;">
                    <p style="margin:0;font-size:15px;color:#f3f4f6;"><a href="mailto:${sanitize(email)}" style="color:#0077FF;text-decoration:none;">${sanitize(email)}</a></p>
                </td>
            </tr>
        </table>
        <div style="height:20px;"></div>
        <a href="mailto:${sanitize(email)}" style="display:block;background-color:#0077FF;color:#ffffff;text-decoration:none;padding:12px 16px;border-radius:8px;font-weight:700;font-size:14px;text-align:center;box-shadow:0 0 20px rgba(0,119,255,0.4),0 0 40px rgba(0,119,255,0.2);">📧 Lead kontaktieren</a>
        <div style="height:16px;"></div>
        <p style="margin:0;font-size:12px;color:#9ca3af;">✅ Checkliste wurde automatisch versendet · IP: ${sanitize(ip)}</p>
    </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

// ==================== API ROUTES ====================

// POST /api/send-email – Kontaktformular
app.post('/api/send-email', contactLimiter, async (req, res) => {
    try {
        if (!enforceCsrfOrigin(req)) return res.status(403).json({ success: false, message: 'Ungültiger Ursprung der Anfrage.' });
        const data = req.body;
        if (!checkHoneypot(data)) return res.status(400).json({ success: false, message: 'Spam erkannt' });

        const errors = [];
        if (!data.firstName?.trim()) errors.push('Vorname ist erforderlich');
        if (!data.lastName?.trim()) errors.push('Nachname ist erforderlich');
        if (!data.email?.trim()) errors.push('E-Mail ist erforderlich');
        else if (!isValidEmail(data.email)) errors.push('Ungültige E-Mail-Adresse');
        if (errors.length > 0) return res.status(400).json({ success: false, message: 'Validierungsfehler', errors });

        const sanitized = {
            firstName: sanitize(data.firstName),
            lastName: sanitize(data.lastName),
            email: data.email.trim(),
            phone: sanitize(data.phone || ''),
            company: sanitize(data.company || ''),
            companySize: sanitize(data.companySize || data['company-size'] || ''),
            interest: sanitize(data.interest || data['pain-points'] || ''),
            message: sanitize(data.message || ''),
        };
        const ip = getClientIp(req);

        const ownerResult = await resend.emails.send({
            from: CONFIG.RESEND_FROM, to: [CONFIG.RECIPIENT_EMAIL],
            subject: contactOwnerSubject(sanitized), html: contactOwnerHtml(sanitized, ip), replyTo: sanitized.email,
        });
        if (ownerResult.error) {
            console.error('[KP] Owner email failed:', ownerResult.error);
            return res.status(500).json({ success: false, message: 'Ein Fehler ist aufgetreten. Bitte versuch es später erneut.' });
        }

        try {
            await resend.emails.send({
                from: CONFIG.RESEND_FROM, to: [sanitized.email],
                subject: contactConfirmationSubject(), html: contactConfirmationHtml(sanitized), replyTo: CONFIG.RECIPIENT_EMAIL,
            });
        } catch (e) { console.error('[KP] Confirmation email failed (non-critical):', e.message); }

        return res.json({ success: true, message: 'Vielen Dank! Wir haben deine Anfrage erhalten und melden uns innerhalb von 24 Stunden bei dir.' });
    } catch (err) {
        console.error('[KP] Contact form error:', err);
        return res.status(500).json({ success: false, message: 'Ein Fehler ist aufgetreten. Bitte versuch es später erneut.' });
    }
});

// POST /api/send-checklist – Checkliste (Lead Magnet)
app.post('/api/send-checklist', checklistLimiter, async (req, res) => {
    try {
        if (!enforceCsrfOrigin(req)) return res.status(403).json({ success: false, message: 'Ungültiger Ursprung der Anfrage.' });
        const data = req.body;
        if (!checkHoneypot(data)) return res.status(400).json({ success: false, message: 'Spam erkannt' });
        const email = (data.email || '').trim();
        if (!email || !isValidEmail(email)) return res.status(400).json({ success: false, message: 'Bitte gib eine gültige E-Mail-Adresse ein.' });

        const ip = getClientIp(req);
        const customerResult = await resend.emails.send({
            from: CONFIG.RESEND_FROM, to: [email],
            subject: checklistCustomerSubject(), html: checklistCustomerHtml(CONFIG.CALENDLY_URL), replyTo: CONFIG.RECIPIENT_EMAIL,
        });
        if (customerResult.error) {
            console.error('[KP] Checklist customer email failed:', customerResult.error);
            return res.status(500).json({ success: false, message: 'Ein Fehler ist aufgetreten. Bitte versuch es später erneut.' });
        }

        try {
            await resend.emails.send({
                from: CONFIG.RESEND_FROM, to: [CONFIG.RECIPIENT_EMAIL],
                subject: checklistOwnerSubject(email), html: checklistOwnerHtml(email, ip), replyTo: email,
            });
        } catch (e) { console.error('[KP] Checklist owner notification failed (non-critical):', e.message); }

        return res.json({ success: true, message: 'Vielen Dank! Die Checkliste ist unterwegs an dein Postfach – inklusive Einladung zum kostenlosen Erstgespräch.' });
    } catch (err) {
        console.error('[KP] Checklist error:', err);
        return res.status(500).json({ success: false, message: 'Ein Fehler ist aufgetreten. Bitte versuch es später erneut.' });
    }
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ success: true, status: 'ok', env: CONFIG.NODE_ENV, resend_configured: !!CONFIG.RESEND_API_KEY, timestamp: new Date().toISOString() });
});

// ==================== STATISCHE DATEIEN ====================
app.use(express.static(path.join(__dirname, '.'), { extensions: ['html'], index: 'index.html' }));

// SPA-Fallback
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) return res.status(404).json({ success: false, message: 'Endpoint nicht gefunden' });
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ==================== START ====================
app.listen(CONFIG.PORT, '127.0.0.1', () => {
    console.log(`[KP] Server läuft auf http://127.0.0.1:${CONFIG.PORT}`);
    console.log(`[KP] Resend konfiguriert: ${!!CONFIG.RESEND_API_KEY}`);
});
