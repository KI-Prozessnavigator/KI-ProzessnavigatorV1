# IONOS: DNS-Checkliste für ki-prozessnavigator.de

Damit **ki-prozessnavigator.de** auf Ihren vCPU Server zeigt, muss bei IONOS der **DNS** richtig stehen. Diese Checkliste führt Sie Schritt für Schritt durch.

---

## 1. Wo Sie den DNS bei IONOS bearbeiten

1. Im Browser **[my.ionos.com](https://my.ionos.com)** öffnen und anmelden.
2. Auf die Kachel **„Domain & SSL“** (bzw. **Domains**) klicken.
3. Die Domain **ki-prozessnavigator.de** auswählen (anklicken).
4. Den Bereich **„DNS“** öffnen:
   - Entweder Reiter **„DNS“** oben, oder  
   - **„DNS-Einstellungen anpassen“** / **„Verwaltung“** → **„DNS-Einstellungen“**.

Sie sehen jetzt die **DNS-Zone** mit Einträgen (A, AAAA, CNAME, MX, TXT, …).

---

## 2. Was bei IONOS mit dem DNS eingestellt sein muss

### A-Record für die Hauptdomain (@)

| Feld (Bezeichnung kann bei IONOS leicht abweichen) | Wert |
|---------------------------------------------------|------|
| **Name / Host / Typ**                             | `@` (oder „Hauptdomain“ / „apex“) |
| **Typ**                                           | **A** |
| **Wert / Ziel / Zielhost / Points to**            | **213.165.76.107** (die **Primäre IPv4** Ihres vCPU Servers aus dem DCD) |
| **TTL** (optional)                               | z. B. 3600 oder Standard |

**Wichtig:** Tragen Sie **Ihre** vCPU-Server-IP ein. Wenn Ihre IP eine andere ist (z. B. aus dem DCD unter vCPU → rechts → Netzwerk → Primäre IPv4), verwenden Sie diese.

### A-Record für www

| Feld   | Wert |
|--------|------|
| **Name / Host** | `www` |
| **Typ**        | **A** |
| **Wert / Ziel**| **213.165.76.107** (dieselbe IP wie oben) |
| **TTL** (optional) | z. B. 3600 oder Standard |

### Alte Einträge prüfen

- Gibt es **A-Records** für `@` oder `www`, die auf eine **andere IP** zeigen (z. B. alte WordPress-Hosting-IP)? → Diese **ändern** auf Ihre vCPU-IP **oder** löschen und durch die neuen A-Records ersetzen.
- Manche Tarife zeigen „Verwendungsart: Website“ oder „Weiterleitung“ – dann kann die Domain trotz A-Record noch auf das alte Hosting geleitet werden. In dem Fall: **„Verwendungsart ändern“** / **„Domain zurücksetzen“** nutzen (siehe Abschnitt 3).

---

## 3. Falls die Domain vorher am WordPress-Hosting hing: „Domain zurücksetzen“

Wenn **ki-prozessnavigator.de** früher mit dem **WP Hosting Start** verbunden war, kann IONOS die Domain noch mit der alten „Verwendungsart“ oder alten DNS-Weiterleitung verknüpfen. Dann reicht es nicht, nur A-Records zu setzen – Sie müssen die Domain erst „neutral“ machen.

**Wo (bei IONOS):**

1. **Domain & SSL** → **ki-prozessnavigator.de** auswählen.
2. Nach **„Domain zurücksetzen“** / **„Verwendungsart oder DNS zurücksetzen“** suchen (oft unter „Verwaltung“ oder „Einstellungen“).
3. **„Verwendungsart oder DNS zurücksetzen“** ausführen (ggf. beide Optionen, wenn angeboten).
4. **Danach** die **DNS-Einstellungen** öffnen und die **A-Records** wie in Abschnitt 2 eintragen (für `@` und `www` auf Ihre vCPU-IP).

**Hinweis:** Wenn Sie die Domain für E-Mail (z. B. Google Workspace) nutzen, werden dabei u. U. MX-/TXT-Einträge entfernt. Diese müssen Sie danach bei IONOS wieder eintragen (Werte aus dem Google Admin).

---

## 4. Speichern und warten

- Nach dem Ändern der A-Records (und ggf. Zurücksetzen) **unbedingt speichern** (Button **„Speichern“** / **„Änderungen übernehmen“**).
- **DNS-Weitergabe:** IONOS übernimmt die Änderung oft innerhalb weniger Minuten. Weltweit kann es **5–30 Minuten**, in Einzelfällen bis zu ein paar Stunden dauern.

---

## 5. Prüfen, ob der DNS stimmt

**Auf Ihrem PC (PowerShell):**

```powershell
nslookup ki-prozessnavigator.de
```

- Unter **„Address“** (bzw. der ausgegebenen IP) sollte **213.165.76.107** stehen (oder Ihre vCPU-Server-IP).
- Wenn dort eine **andere IP** erscheint: DNS bei IONOS nochmal prüfen (richtige IP eingetragen? Gespeichert?) und ggf. kurz warten und `nslookup` erneut ausführen.

**Im Browser:**

- **http://ki-prozessnavigator.de** (zuerst ohne „s“) aufrufen.
- Wenn die Seite lädt: DNS ist angekommen. Für **https://** danach SSL (Certbot) einrichten.

---

## Kurz-Checkliste IONOS DNS

- [ ] Bei IONOS angemeldet → **Domain & SSL** → **ki-prozessnavigator.de**.
- [ ] **DNS** / **DNS-Einstellungen** geöffnet.
- [ ] **A-Record für @** auf die **vCPU-Server-IP** (z. B. 213.165.76.107) gesetzt.
- [ ] **A-Record für www** auf dieselbe IP gesetzt.
- [ ] Alte A-Records mit falscher IP angepasst oder entfernt.
- [ ] Falls Domain vorher am WP-Hosting hing: **„Domain zurücksetzen“** / **„Verwendungsart oder DNS zurücksetzen“** ausgeführt, **danach** A-Records gesetzt.
- [ ] **Speichern** geklickt.
- [ ] Nach ein paar Minuten: **nslookup ki-prozessnavigator.de** → zeigt die richtige IP?
- [ ] **http://ki-prozessnavigator.de** im Browser testen.

Wenn das alles erledigt ist und die IP bei `nslookup` stimmt, „braucht IONOS mit dem DNS“ nichts mehr – die Domain zeigt dann auf Ihren Server. Bleibt die Website trotzdem unerreichbar, liegt die Ursache eher am Server (Apache, Firewall) oder an **https** ohne SSL – siehe [TROUBLESHOOTING-VERBINDUNG-ABGELEHNT.md](TROUBLESHOOTING-VERBINDUNG-ABGELEHNT.md).
