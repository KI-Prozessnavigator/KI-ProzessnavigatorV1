/* ==========================================
   Contact Modal - Dynamic Form Logic
   KI-Prozessnavigator
   Optimized & Performance-focused
   ========================================== */

(function() {
    'use strict';

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        const modal = document.getElementById('contact-modal');
        if (!modal) return;

        // Cache DOM elements once
        const elements = {
            modal: modal,
            backdrop: modal.querySelector('.contact-modal__backdrop'),
            closeBtn: modal.querySelector('.contact-modal__close'),
            pathSelection: modal.querySelector('.contact-modal__paths'),
            inquiryPath: document.getElementById('path-inquiry'),
            analysisPath: document.getElementById('path-analysis'),
            inquiryContent: document.getElementById('inquiry-content'),
            analysisContent: document.getElementById('analysis-content'),
            allContents: modal.querySelectorAll('.contact-modal__content'),
            successState: modal.querySelector('.form-success'),
            successCloseBtn: modal.querySelector('.success-cta')
        };

        // State
        const state = {
            currentPath: null,
            currentStep: 1,
            formData: createInitialFormData()
        };

        function createInitialFormData() {
            return {
                path: null,
                companySize: null,
                automationAreas: [],
                contact: {},
                analysis: {
                    employees: 10,
                    weeklyHours: 20,
                    processes: [],
                    challenges: [],
                    industry: null
                }
            };
        }

        // ===== MODAL CONTROLS =====
        function openModal() {
            elements.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            resetModal();
        }

        function closeModal() {
            elements.modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        function resetModal() {
            state.currentPath = null;
            state.currentStep = 1;
            state.formData = createInitialFormData();

            // Show path selection
            elements.pathSelection.style.display = 'block';
            elements.allContents.forEach(c => c.classList.remove('active'));
            elements.successState.classList.remove('active');

            // Reset all form inputs
            modal.querySelectorAll('input, select, textarea').forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = false;
                } else if (input.type === 'range') {
                    // Reset sliders to default
                    if (input.id === 'employee-count') input.value = 10;
                    else if (input.id === 'weekly-hours') input.value = 20;
                } else {
                    input.value = '';
                }
            });

            // Reset option cards visual state
            modal.querySelectorAll('.option-card').forEach(card => {
                card.classList.remove('selected');
            });

            // Reset steps
            modal.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
            modal.querySelectorAll('.form-step[data-step="1"]').forEach(step => step.classList.add('active'));

            // Reset progress
            updateProgress('inquiry', 1);
            updateProgress('analysis', 1);

            // Reset slider displays
            updateSliderDisplay('employee-count', 10);
            updateSliderDisplay('weekly-hours', 20);
        }

        // ===== INIT TRIGGERS =====
        function initTriggers() {
            // Use event delegation for better performance
            document.addEventListener('click', function(e) {
                const trigger = e.target.closest('.btn--neon, .btn--primary, a[href="#contact"], .pricing-card .btn, .nav__link--cta');
                
                if (trigger) {
                    // Don't intercept form submit buttons or lead form
                    if (trigger.closest('#lead-form') || trigger.type === 'submit') return;
                    
                    e.preventDefault();
                    openModal();
                }
            });
        }

        // ===== PATH SELECTION =====
        elements.inquiryPath.addEventListener('click', function() {
            state.currentPath = 'inquiry';
            state.formData.path = 'inquiry';
            elements.pathSelection.style.display = 'none';
            elements.inquiryContent.classList.add('active');
            state.currentStep = 1;
            showStep('inquiry', 1);
        });

        elements.analysisPath.addEventListener('click', function() {
            state.currentPath = 'analysis';
            state.formData.path = 'analysis';
            elements.pathSelection.style.display = 'none';
            elements.analysisContent.classList.add('active');
            state.currentStep = 1;
            showStep('analysis', 1);
        });

        // ===== BACK BUTTONS =====
        modal.querySelectorAll('.form-back-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const content = this.closest('.contact-modal__content');
                content.classList.remove('active');
                elements.pathSelection.style.display = 'block';
                state.currentPath = null;
                state.currentStep = 1;
            });
        });

        // ===== CLOSE HANDLERS =====
        elements.closeBtn.addEventListener('click', closeModal);
        elements.backdrop.addEventListener('click', closeModal);
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && elements.modal.classList.contains('active')) {
                closeModal();
            }
        });

        if (elements.successCloseBtn) {
            elements.successCloseBtn.addEventListener('click', closeModal);
        }

        // ===== OPTION CARDS - FIXED VERSION =====
        // Use event delegation and handle the input change event instead
        modal.addEventListener('change', function(e) {
            const input = e.target;
            if (!input.matches('.option-card input')) return;

            const card = input.closest('.option-card');
            const optionGrid = input.closest('.option-grid');

            if (input.type === 'radio') {
                // Radio: deselect all in group, select current
                optionGrid.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
                if (input.checked) {
                    card.classList.add('selected');
                }
            } else if (input.type === 'checkbox') {
                // Checkbox: toggle selection
                card.classList.toggle('selected', input.checked);
            }
        });

        // Also handle click on card for visual feedback
        modal.addEventListener('click', function(e) {
            const card = e.target.closest('.option-card');
            if (!card) return;

            const input = card.querySelector('input');
            if (!input) return;

            // For checkboxes, we need to manually toggle since label might not be direct parent
            if (input.type === 'checkbox') {
                // Only toggle if click wasn't directly on the input
                if (e.target !== input) {
                    input.checked = !input.checked;
                    card.classList.toggle('selected', input.checked);
                    
                    // Trigger change event for consistency
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            } else if (input.type === 'radio') {
                // For radio, only set if not already checked
                if (!input.checked && e.target !== input) {
                    input.checked = true;
                    
                    // Deselect all in group
                    const optionGrid = card.closest('.option-grid');
                    optionGrid.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    
                    // Trigger change event
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        });

        // ===== SLIDERS =====
        const employeeSlider = document.getElementById('employee-count');
        const hoursSlider = document.getElementById('weekly-hours');

        if (employeeSlider) {
            employeeSlider.addEventListener('input', function() {
                updateSliderDisplay('employee-count', this.value);
                state.formData.analysis.employees = parseInt(this.value);
            });
        }

        if (hoursSlider) {
            hoursSlider.addEventListener('input', function() {
                updateSliderDisplay('weekly-hours', this.value);
                state.formData.analysis.weeklyHours = parseInt(this.value);
            });
        }

        function updateSliderDisplay(sliderId, value) {
            const display = document.getElementById(sliderId + '-value');
            if (!display) return;

            if (sliderId === 'employee-count') {
                display.textContent = value + (parseInt(value) >= 100 ? '+' : '') + ' Mitarbeiter';
            } else if (sliderId === 'weekly-hours') {
                display.textContent = value + ' Stunden/Woche';
            }
        }

        // ===== NAVIGATION =====
        modal.addEventListener('click', function(e) {
            const nextBtn = e.target.closest('.btn--modal-primary[data-next]');
            const prevBtn = e.target.closest('.btn--modal-secondary[data-prev]');

            if (nextBtn) {
                e.preventDefault();
                const nextStep = parseInt(nextBtn.getAttribute('data-next'));

                // Validate current step
                if (!validateCurrentStep()) return;

                // Collect data from current step
                collectStepData();

                // Calculate potential before showing results
                if (state.currentPath === 'analysis' && nextStep === 4) {
                    updatePotentialResults();
                }

                state.currentStep = nextStep;
                showStep(state.currentPath, nextStep);
            }

            if (prevBtn) {
                e.preventDefault();
                const prevStep = parseInt(prevBtn.getAttribute('data-prev'));
                state.currentStep = prevStep;
                showStep(state.currentPath, prevStep);
            }
        });

        function showStep(path, step) {
            const content = path === 'inquiry' ? elements.inquiryContent : elements.analysisContent;

            content.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
            const targetStep = content.querySelector(`.form-step[data-step="${step}"]`);
            if (targetStep) {
                targetStep.classList.add('active');
            }

            updateProgress(path, step);
        }

        function updateProgress(path, step) {
            const content = path === 'inquiry' ? elements.inquiryContent : elements.analysisContent;
            if (!content) return;

            const steps = content.querySelectorAll('.progress-step');

            steps.forEach((s, index) => {
                s.classList.remove('active', 'completed');
                if (index + 1 < step) {
                    s.classList.add('completed');
                } else if (index + 1 === step) {
                    s.classList.add('active');
                }
            });
        }

        function validateCurrentStep() {
            const content = state.currentPath === 'inquiry' ? elements.inquiryContent : elements.analysisContent;
            const currentStepEl = content.querySelector(`.form-step[data-step="${state.currentStep}"]`);
            if (!currentStepEl) return true;

            // Check for required option groups
            const optionGroups = currentStepEl.querySelectorAll('.option-grid[data-required="true"]');
            for (const group of optionGroups) {
                const hasSelection = group.querySelector('input:checked');
                if (!hasSelection) {
                    // Visual feedback
                    group.style.animation = 'shake 0.5s ease';
                    setTimeout(() => group.style.animation = '', 500);
                    return false;
                }
            }

            // Check required inputs
            const requiredInputs = currentStepEl.querySelectorAll('input[required], select[required], textarea[required]');
            for (const input of requiredInputs) {
                if (!input.value.trim()) {
                    input.focus();
                    input.style.borderColor = 'var(--color-accent)';
                    setTimeout(() => input.style.borderColor = '', 2000);
                    return false;
                }
            }

            return true;
        }

        function collectStepData() {
            const content = state.currentPath === 'inquiry' ? elements.inquiryContent : elements.analysisContent;
            const currentStepEl = content.querySelector(`.form-step[data-step="${state.currentStep}"]`);
            if (!currentStepEl) return;

            if (state.currentPath === 'inquiry') {
                if (state.currentStep === 1) {
                    const selected = currentStepEl.querySelector('input[name="company-size"]:checked');
                    if (selected) {
                        state.formData.companySize = selected.value;
                    }
                } else if (state.currentStep === 2) {
                    state.formData.automationAreas = [];
                    currentStepEl.querySelectorAll('input[name="automation-area"]:checked').forEach(input => {
                        state.formData.automationAreas.push(input.value);
                    });
                }
            } else if (state.currentPath === 'analysis') {
                if (state.currentStep === 1) {
                    const industrySelect = currentStepEl.querySelector('#industry');
                    if (industrySelect) {
                        state.formData.analysis.industry = industrySelect.value;
                    }
                } else if (state.currentStep === 2) {
                    state.formData.analysis.processes = [];
                    currentStepEl.querySelectorAll('input[name="process"]:checked').forEach(input => {
                        state.formData.analysis.processes.push(input.value);
                    });
                } else if (state.currentStep === 3) {
                    state.formData.analysis.challenges = [];
                    currentStepEl.querySelectorAll('input[name="challenge"]:checked').forEach(input => {
                        state.formData.analysis.challenges.push(input.value);
                    });
                }
            }
        }

        // ===== POTENTIAL CALCULATION =====
        function updatePotentialResults() {
            const { employees, weeklyHours, processes } = state.formData.analysis;

            // Calculate potential savings (70% automation rate)
            const automationRate = 0.70;
            const hoursSaved = Math.round(weeklyHours * automationRate);
            const monthlySavings = hoursSaved * 4;

            // Cost calculation (50€/hour average)
            const hourlyCost = 50;
            const monthlyEuroSaved = monthlySavings * hourlyCost;

            // ROI (based on Pro package at 799€/month)
            const monthlyCost = 799;
            const roi = Math.round((monthlyEuroSaved - monthlyCost) / monthlyCost * 100);

            // Update displays
            const hoursSavedEl = document.getElementById('result-hours');
            const euroSavedEl = document.getElementById('result-savings');
            const roiEl = document.getElementById('result-roi');

            if (hoursSavedEl) hoursSavedEl.textContent = hoursSaved + 'h/Woche';
            if (euroSavedEl) euroSavedEl.textContent = formatCurrency(monthlyEuroSaved) + '€/Monat';
            if (roiEl) roiEl.textContent = roi > 0 ? '+' + roi + '%' : roi + '%';

            updateRecommendations();
        }

        function updateRecommendations() {
            const recommendationsEl = document.getElementById('potential-recommendations');
            if (!recommendationsEl) return;

            const processRecommendations = {
                'vertrieb': '🎯 Lead-Qualifizierung und automatische Terminbuchung können Ihre Abschlussquote um 40% steigern',
                'hr': '👥 KI-gestütztes Bewerber-Matching spart durchschnittlich 8 Stunden pro Woche',
                'finanzen': '💰 Automatische Rechnungsprüfung reduziert Fehler auf nahezu 0%',
                'kundenservice': '💬 24/7 Chatbot-Support erhöht die Kundenzufriedenheit um 35%',
                'projektmanagement': '📋 Automatisierte Projekt-Setups verhindern vergessene Deadlines',
                'buchhaltung': '📄 OCR-basierte Rechnungserfassung beschleunigt die Buchhaltung um 60%',
                'onboarding': '🎓 Digitales Onboarding reduziert die Einarbeitungszeit um 70%',
                'terminbuchung': '📅 Online-Buchung mit SMS-Erinnerung eliminiert No-Shows'
            };

            const selectedProcesses = state.formData.analysis.processes.slice(0, 3);

            let html = '';
            if (selectedProcesses.length === 0) {
                html = `
                    <div class="recommendation-item">
                        <span class="recommendation-item__icon">✅</span>
                        <span>Basierend auf Ihrer Unternehmensgröße empfehlen wir einen schrittweisen Start</span>
                    </div>
                    <div class="recommendation-item">
                        <span class="recommendation-item__icon">✅</span>
                        <span>Die größten Einsparungen sind oft in der Kundenkommunikation zu finden</span>
                    </div>
                `;
            } else {
                selectedProcesses.forEach(process => {
                    if (processRecommendations[process]) {
                        html += `
                            <div class="recommendation-item">
                                <span class="recommendation-item__icon">✅</span>
                                <span>${processRecommendations[process]}</span>
                            </div>
                        `;
                    }
                });
            }

            recommendationsEl.innerHTML = html;
        }

        function formatCurrency(value) {
            return new Intl.NumberFormat('de-DE').format(Math.round(value));
        }

        // ===== FORM SUBMISSION =====
        modal.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();

                // Collect contact data
                const formElements = this.elements;
                const contactData = {
                    firstName: formElements['firstName']?.value || '',
                    lastName: formElements['lastName']?.value || '',
                    email: formElements['email']?.value || '',
                    phone: formElements['phone']?.value || '',
                    company: formElements['company']?.value || '',
                    message: formElements['message']?.value || '',
                    companySize: state.formData.companySize || '',
                    interest: state.formData.interest || '',
                    website: '' // Honeypot field (empty for humans)
                };

                // Check privacy consent
                const privacyConsent = this.querySelector('input[name="privacy"]');
                if (privacyConsent && !privacyConsent.checked) {
                    const checkbox = privacyConsent.closest('.privacy-checkbox');
                    if (checkbox) {
                        checkbox.style.border = '2px solid var(--color-accent)';
                        setTimeout(() => checkbox.style.border = '', 2000);
                    }
                    return;
                }

                // Disable submit button
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Wird gesendet...</span>';

                try {
                    // Send to PHP backend
                    const response = await fetch('php/send-email.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(contactData)
                    });

                    const result = await response.json();

                    if (result.success) {
                        // Show success
                        state.formData.contact = contactData;
                        showSuccess();
                    } else {
                        // Show error
                        alert(result.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt per E-Mail.');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            });
        });

        function showSuccess() {
            elements.allContents.forEach(c => c.classList.remove('active'));
            elements.successState.classList.add('active');
        }

        // ===== INJECT SHAKE ANIMATION =====
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-6px); }
                40% { transform: translateX(6px); }
                60% { transform: translateX(-4px); }
                80% { transform: translateX(4px); }
            }
        `;
        document.head.appendChild(style);

        // ===== INITIALIZE =====
        initTriggers();

        // Expose globally
        window.openContactModal = openModal;
    }
})();
