/**
 * Value Calculator - ROI Calculation Logic
 * Berechnet Zeitersparnis, monetären Wert und Kapazitäts-Boost
 */

class ValueCalculator {
    constructor() {
        this.init();
    }

    init() {
        // Input-Elemente
        this.employeeCount = document.getElementById('employeeCount');
        this.hourlyRate = document.getElementById('hourlyRate');
        this.processType = document.getElementById('processType');
        this.minutesPerDay = document.getElementById('minutesPerDay');
        this.affectedEmployees = document.getElementById('affectedEmployees');
        
        // Value Display-Elemente (für Slider-Werte)
        this.affectedEmployeesValue = document.getElementById('affectedEmployeesValue');
        this.minutesPerDayValue = document.getElementById('minutesPerDayValue');
        this.hourlyRateValue = document.getElementById('hourlyRateValue');
        
        // Ergebnis-Elemente
        this.timeSaved = document.getElementById('timeSaved');
        this.timeSavedWeeks = document.getElementById('timeSavedWeeks');
        this.moneySaved = document.getElementById('moneySaved');
        
        this.setupEventListeners();
        this.updateSliderDisplay(); // Slider-Werte anzeigen + Initiale Berechnung
    }

    setupEventListeners() {
        if (this.employeeCount) this.employeeCount.addEventListener('input', () => this.calculate());
        this.hourlyRate.addEventListener('input', () => this.updateSliderDisplay());
        this.processType.addEventListener('change', () => this.calculate());
        this.minutesPerDay.addEventListener('input', () => this.updateSliderDisplay());
        this.affectedEmployees.addEventListener('input', () => this.updateSliderDisplay());
        
        // Eingabefelder: Nutzer kann Wert tippen, Slider wird synchronisiert
        if (this.minutesPerDayValue && this.minutesPerDayValue.nodeName === 'INPUT') {
            this.minutesPerDayValue.addEventListener('change', () => this.syncFromInput('minutesPerDay', 15, 1440));
        }
        if (this.affectedEmployeesValue && this.affectedEmployeesValue.nodeName === 'INPUT') {
            this.affectedEmployeesValue.addEventListener('change', () => this.syncFromInput('affectedEmployees', 1, 3000));
        }
        if (this.hourlyRateValue && this.hourlyRateValue.nodeName === 'INPUT') {
            this.hourlyRateValue.addEventListener('change', () => this.syncFromInput('hourlyRate', 20, 400));
        }
    }

    syncFromInput(sliderId, min, max) {
        const slider = document.getElementById(sliderId);
        const input = sliderId === 'affectedEmployees' ? this.affectedEmployeesValue
            : sliderId === 'minutesPerDay' ? this.minutesPerDayValue : this.hourlyRateValue;
        if (!slider || !input || input.nodeName !== 'INPUT') return;
        let val = parseFloat(input.value) || min;
        val = Math.max(min, Math.min(max, val));
        input.value = Math.round(val);
        // Slider nur aktualisieren wenn innerhalb seines Bereichs (affectedEmployees-Slider max=200)
        const sliderMax = parseFloat(slider.max) || max;
        slider.value = Math.min(val, sliderMax);
        this.calculate();
    }

    updateSliderDisplay() {
        if (this.affectedEmployeesValue) {
            this.affectedEmployeesValue[this.affectedEmployeesValue.nodeName === 'INPUT' ? 'value' : 'textContent'] = this.affectedEmployees.value;
        }
        if (this.minutesPerDayValue) {
            this.minutesPerDayValue[this.minutesPerDayValue.nodeName === 'INPUT' ? 'value' : 'textContent'] = this.minutesPerDay.value;
        }
        if (this.hourlyRateValue) {
            this.hourlyRateValue[this.hourlyRateValue.nodeName === 'INPUT' ? 'value' : 'textContent'] = this.hourlyRate.value;
        }
        this.calculate();
    }

    calculate() {
        // Hole Werte (bei Eingabefeldern: Wert aus Input lesen, falls > Slider-max möglich)
        const totalEmployees = parseFloat(this.employeeCount.value) || 10;
        const hourlyRate = parseFloat(this.hourlyRate.value) || 50;
        const minutesPerDay = this.minutesPerDayValue?.nodeName === 'INPUT'
            ? (parseFloat(this.minutesPerDayValue.value) || parseFloat(this.minutesPerDay.value) || 30)
            : (parseFloat(this.minutesPerDay.value) || 30);
        const affectedEmployees = this.affectedEmployeesValue?.nodeName === 'INPUT'
            ? (parseFloat(this.affectedEmployeesValue.value) || parseFloat(this.affectedEmployees.value) || 3)
            : (parseFloat(this.affectedEmployees.value) || 3);

        // Berechnungen - Basierend auf Minuten pro Tag!
        // 1. Zeitersparnis pro Jahr (in Stunden)
        const hoursPerDay = minutesPerDay / 60; // Konvertiere Minuten zu Stunden
        const hoursPerWeek = affectedEmployees * hoursPerDay * 5; // 5 Arbeitstage
        const hoursPerYear = hoursPerWeek * 52; // 52 Wochen
        
        // 2. Monetärer Wert (Ersparnis)
        const moneySavedValue = hoursPerYear * hourlyRate;
        
        // 3. Arbeitswochen (40 Stunden pro Woche)
        const workWeeks = (hoursPerYear / 40).toFixed(1);
        
        // Update UI mit Animation
        this.updateResults({
            hours: Math.round(hoursPerYear),
            weeks: workWeeks,
            money: Math.round(moneySavedValue),
            employees: totalEmployees,
            affectedEmployees: affectedEmployees
        });
    }

    updateResults(data) {
        // Animierte Updates mit Zähl-Effekt
        const timeElement = this.timeSaved.querySelector('span:first-child');
        const moneyElement = this.moneySaved.querySelector('span:first-child');
        
        // Erzwinge weiße Farbe für alle Zahlen
        if (timeElement) {
            timeElement.style.color = '#ffffff';
            this.animateNumber(timeElement, data.hours, '');
        }
        
        if (moneyElement) {
            moneyElement.style.color = '#ffffff';
            this.animateNumber(moneyElement, data.money, '');
        }
        
        // Update Arbeitswochen-Text (Zahl fett wie bei Ersparnis pro Monat)
        const timeSavedWeeksNum = document.getElementById('timeSavedWeeksNum');
        if (timeSavedWeeksNum) {
            timeSavedWeeksNum.textContent = `≈ ${data.weeks}`;
            timeSavedWeeksNum.style.color = '#ffffff';
        } else if (this.timeSavedWeeks) {
            this.timeSavedWeeks.textContent = `≈ ${data.weeks} Arbeitswochen gespart`;
            this.timeSavedWeeks.style.color = '#ffffff';
        }
        
        // Update Visualisierungen
        this.updateCharts(data);
    }
    
    updateCharts(data) {
        // 1. Donut Chart für Zeitgewinn
        const timeCircle = document.getElementById('timeCircle');
        const timePercent = document.getElementById('timePercent');
        
        // Berechne Prozent (basierend auf Arbeitszeit der betroffenen Mitarbeiter)
        const totalYearlyHours = 2080 * data.affectedEmployees;
        const savedPercent = Math.min(Math.round((data.hours / totalYearlyHours) * 100), 100);
        
        if (timeCircle && timePercent) {
            // SVG Circle: Umfang = 2πr = 2 * 3.14159 * 55 = 345.58
            const circumference = 345;
            const offset = circumference - (circumference * savedPercent / 100);
            timeCircle.style.strokeDashoffset = offset;
            timePercent.textContent = `${savedPercent}%`;
        }
        
        // 2. Monatliche Akkumulations-Balken (12 Monate)
        const monthlyAmount = Math.round(data.money / 12);
        
        // Update monatlichen Betrag
        const monthlyAmountEl = document.getElementById('monthlyAmount');
        if (monthlyAmountEl) {
            monthlyAmountEl.textContent = this.formatNumber(monthlyAmount) + '€';
        }
        
        // Update alle 12 Monatsbalken
        for (let i = 1; i <= 12; i++) {
            const monthBar = document.getElementById(`month${i}`);
            if (monthBar) {
                const heightPercent = (i / 12) * 100; // Linear ansteigend
                monthBar.style.height = `${heightPercent}%`;
            }
        }
    }

    animateNumber(element, targetValue, prefix = '') {
        const currentValue = parseInt(element.textContent.replace(/[^0-9]/g, '')) || 0;
        const duration = 800; // ms
        const steps = 30;
        const stepValue = (targetValue - currentValue) / steps;
        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep++;
            const newValue = Math.round(currentValue + (stepValue * currentStep));
            
            element.textContent = this.formatNumber(newValue);
            element.style.color = '#ffffff'; // Erzwinge weiße Farbe bei jedem Update
            
            if (currentStep >= steps) {
                element.textContent = this.formatNumber(targetValue);
                element.style.color = '#ffffff'; // Erzwinge weiße Farbe am Ende
                clearInterval(interval);
            }
        }, duration / steps);
    }

    formatNumber(num) {
        // Formatiere Zahlen mit Tausender-Trenner
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
}

// Initialisiere Calculator nach DOM-Load
document.addEventListener('DOMContentLoaded', () => {
    new ValueCalculator();
});
