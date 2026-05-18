class ValueCalculatorV3 {
    constructor() {
        this.init();
    }

    init() {
        this.minutesPerDay = document.getElementById('slider-zeit');
        this.affectedEmployees = document.getElementById('slider-team');
        this.hourlyRate = document.getElementById('slider-lohn');
        this.minutesPerDayValue = document.getElementById('slider-zeit-val');
        this.affectedEmployeesValue = document.getElementById('slider-team-val');
        this.hourlyRateValue = document.getElementById('slider-lohn-val');

        this.savingsYearValue = document.getElementById('savings-year');
        this.savingsMonthValue = document.getElementById('savings-month');
        this.savingsFteValue = document.getElementById('savings-fte');
        this.timeSavedHoursValue = document.getElementById('time-saved-hours');
        this.timeSavedWeeksValue = document.getElementById('time-saved-weeks');

        this.teamButtons = Array.from(document.querySelectorAll('.calculator__team-btn'));

        if (!this.minutesPerDay || !this.affectedEmployees || !this.hourlyRate) return;

        this.setupEventListeners();
        this.applyActivePreset();
        this.updateRangeFills();
        this.calculate();
    }

    setupEventListeners() {
        this.teamButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                this.setActiveTeamButton(btn);
                this.applyPreset(btn);
            });
        });

        this.minutesPerDay.addEventListener('input', () => this.handleManualChange(this.minutesPerDay, this.minutesPerDayValue));
        this.affectedEmployees.addEventListener('input', () => this.handleManualChange(this.affectedEmployees, this.affectedEmployeesValue));
        this.hourlyRate.addEventListener('input', () => this.handleManualChange(this.hourlyRate, this.hourlyRateValue));

        if (this.minutesPerDayValue) {
            this.minutesPerDayValue.addEventListener('input', () => this.syncFromInput(this.minutesPerDay, this.minutesPerDayValue));
        }
        if (this.affectedEmployeesValue) {
            this.affectedEmployeesValue.addEventListener('input', () => this.syncFromInput(this.affectedEmployees, this.affectedEmployeesValue));
        }
        if (this.hourlyRateValue) {
            this.hourlyRateValue.addEventListener('input', () => this.syncFromInput(this.hourlyRate, this.hourlyRateValue));
        }
    }

    applyActivePreset() {
        const activeBtn = this.teamButtons.find((btn) => btn.classList.contains('is-active'));
        if (activeBtn) {
            this.applyPreset(activeBtn);
        }
    }

    setActiveTeamButton(activeBtn) {
        this.teamButtons.forEach((btn) => {
            const isActive = btn === activeBtn;
            btn.classList.toggle('is-active', isActive);
            btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
        });
    }

    clearTeamButtons() {
        this.teamButtons.forEach((btn) => {
            btn.classList.remove('is-active');
            btn.setAttribute('aria-checked', 'false');
        });
    }

    applyPreset(btn) {
        const minutes = parseFloat(btn.dataset.minutes) || 40;
        const employees = parseFloat(btn.dataset.employees) || 15;
        const rate = parseFloat(btn.dataset.rate) || 40;

        this.setRangeValue(this.minutesPerDay, this.minutesPerDayValue, minutes);
        this.setRangeValue(this.affectedEmployees, this.affectedEmployeesValue, employees);
        this.setRangeValue(this.hourlyRate, this.hourlyRateValue, rate);
        this.updateRangeFills();
        this.calculate();
    }

    handleManualChange(slider, input) {
        this.clearTeamButtons();
        this.syncFromSlider(slider, input);
        this.updateSliderFill(slider);
        this.calculate();
    }

    syncFromInput(slider, input) {
        if (!slider || !input) return;
        const min = parseFloat(slider.min) || 0;
        const max = parseFloat(slider.max) || 100;
        const step = parseFloat(slider.step) || 1;
        let value = parseFloat(input.value);
        if (Number.isNaN(value)) value = min;
        value = Math.max(min, Math.min(max, value));
        value = Math.round(value / step) * step;
        input.value = value;
        slider.value = value;
        slider.setAttribute('aria-valuenow', value);
        this.clearTeamButtons();
        this.updateSliderFill(slider);
        this.calculate();
    }

    syncFromSlider(slider, input) {
        if (!slider || !input) return;
        const value = parseFloat(slider.value) || 0;
        input.value = value;
        slider.setAttribute('aria-valuenow', value);
    }

    setRangeValue(slider, input, value) {
        if (!slider || !input) return;
        const min = parseFloat(slider.min) || 0;
        const max = parseFloat(slider.max) || 100;
        const step = parseFloat(slider.step) || 1;
        const boundedValue = Math.max(min, Math.min(max, value));
        const steppedValue = Math.round(boundedValue / step) * step;
        slider.value = steppedValue;
        input.value = steppedValue;
        slider.setAttribute('aria-valuenow', steppedValue);
    }

    updateRangeFills() {
        [this.minutesPerDay, this.affectedEmployees, this.hourlyRate].forEach((slider) => {
            if (!slider) return;
            this.updateSliderFill(slider);
        });
    }

    updateSliderFill(slider) {
        if (!slider) return;
        const min = parseFloat(slider.min) || 0;
        const max = parseFloat(slider.max) || 100;
        const value = parseFloat(slider.value) || 0;
        const percent = ((value - min) / (max - min)) * 100;
        slider.style.setProperty('--range-fill', percent + '%');
    }

    calculate() {
        const minutesPerDay = parseFloat(this.minutesPerDay.value) || 0;
        const affectedEmployees = parseFloat(this.affectedEmployees.value) || 0;
        const hourlyRate = parseFloat(this.hourlyRate.value) || 0;

        const hoursPerYear = (minutesPerDay * affectedEmployees * 220 * 0.7) / 60;
        const moneyPerYear = hoursPerYear * hourlyRate;
        const moneyPerMonth = moneyPerYear / 12;
        const weeksSaved = hoursPerYear / 40;
        const fteEquivalent = hoursPerYear / 1720;

        this.updateResults({
            hoursPerYear,
            moneyPerYear,
            moneyPerMonth,
            weeksSaved,
            fteEquivalent
        });
    }

    updateResults(data) {
        const hoursRounded = Math.round(data.hoursPerYear);
        const monthRounded = Math.round(data.moneyPerMonth);
        const yearRounded = Math.round(data.moneyPerYear);
        const weeksRounded = data.weeksSaved.toFixed(1);

        this.animateValue(this.savingsYearValue, this.getCurrentValue(this.savingsYearValue), yearRounded, 300);
        if (this.savingsMonthValue) this.savingsMonthValue.textContent = this.formatNumber(monthRounded);
        if (this.timeSavedHoursValue) this.timeSavedHoursValue.textContent = this.formatNumber(hoursRounded);
        if (this.timeSavedWeeksValue) this.timeSavedWeeksValue.textContent = weeksRounded.replace('.', ',');
        if (this.savingsFteValue) this.savingsFteValue.textContent = data.fteEquivalent.toFixed(1).replace('.', ',');

        this.updateDonut(data.fteEquivalent);
    }

    updateDonut(fte) {
        var fill = document.getElementById('donut-fill');
        var text = document.getElementById('donut-text');
        if (!fill) return;
        var pct = Math.min(Math.round(fte / 3 * 100), 100);
        var circumference = 2 * Math.PI * 15.9;
        var dash = (pct / 100) * circumference;
        fill.setAttribute('stroke-dasharray', dash + ' ' + (circumference - dash));
        if (text) text.textContent = pct + '%';
    }

    formatNumber(value) {
        return Math.round(value).toLocaleString('de-DE');
    }

    getCurrentValue(element) {
        if (!element) return 0;
        const raw = element.textContent || '';
        const numeric = parseFloat(raw.replace(/\./g, '').replace(',', '.'));
        return Number.isNaN(numeric) ? 0 : numeric;
    }

    animateValue(element, start, end, duration) {
        if (!element) return;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * eased);
            element.textContent = current.toLocaleString('de-DE');
            if (progress < 1) requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ValueCalculatorV3();
});
