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

        // ===== MOBILE VIEWPORT HEIGHT FIX (Fallback für problematisches 100vh) =====
        // Setzt --vh (1% der innerHeight), genutzt in Mobile-CSS als Fallback.
        function updateMobileVhVar() {
            const isMobile =
                (window.matchMedia && window.matchMedia('(max-width: 480px)').matches) ||
                (!window.matchMedia && window.innerWidth <= 480);

            if (!isMobile) {
                document.documentElement.style.removeProperty('--vh');
                return;
            }

            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }

        updateMobileVhVar();
        window.addEventListener('resize', updateMobileVhVar, { passive: true });
        window.addEventListener('orientationchange', updateMobileVhVar, { passive: true });

        // Cache DOM elements once
        const elements = {
            modal: modal,
            backdrop: modal.querySelector('.contact-modal__backdrop'),
            closeBtn: modal.querySelector('.contact-modal__close'),
            inquiryContent: document.getElementById('inquiry-content'),
            allContents: modal.querySelectorAll('.contact-modal__content'),
            successState: modal.querySelector('.form-success'),
            successCloseBtn: modal.querySelector('.success-cta')
        };

        // State
        const state = {
            currentPath: 'inquiry',
            currentStep: 1,
            formData: createInitialFormData(),
            tracking: {
                startedPaths: {
                    inquiry: false
                },
                lastSubmittedMeta: null
            }
        };

        function pushDataLayer(eventName, params = {}) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: eventName,
                ...params
            });
        }

        function getModalFormMeta(form, path, step) {
            const fallbackId = path ? `${path}-flow` : 'contact-modal-flow';
            const formId = form?.id || fallbackId;
            const formName = form?.getAttribute('aria-label') || formId;

            return {
                form_id: formId,
                form_name: formName,
                form_type: path || 'unknown',
                form_step: step
            };
        }

        function trackModalStart(path, step) {
            if (!path || state.tracking.startedPaths[path]) return;
            state.tracking.startedPaths[path] = true;
            pushDataLayer('form_start', getModalFormMeta(null, path, step));
        }

        function createInitialFormData() {
            return {
                path: 'inquiry',
                companySize: null,
                painPoints: [],
                contact: {}
            };
        }

        // ===== MODAL CONTROLS =====
        function openModal() {
            elements.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            resetModal();
            showStep('inquiry', 1);
        }

        function closeModal() {
            elements.modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        function resetModal() {
            state.currentPath = 'inquiry';
            state.currentStep = 1;
            state.formData = createInitialFormData();
            state.tracking.startedPaths.inquiry = false;
            state.tracking.lastSubmittedMeta = null;

            // Show inquiry content directly
            elements.allContents.forEach(c => c.classList.remove('active'));
            if (elements.inquiryContent) {
                elements.inquiryContent.classList.add('active');
            }
            elements.successState.classList.remove('active');
            const successHeader = document.querySelector('.contact-modal__header');
            if (successHeader) {
                successHeader.style.display = '';
            }

            // Reset all form inputs
            modal.querySelectorAll('input, select, textarea').forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = false;
                } else if (input.type === 'range') {
                    // Reset sliders to default
                    if (input.id === 'employee-count') input.value = 10;
                    else if (input.id === 'weekly-hours') input.value = 20;
                    else if (input.id === 'hourly-cost') input.value = 50;
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
            if (elements.inquiryContent) {
                const firstStep = elements.inquiryContent.querySelector('.form-step[data-step="1"]');
                if (firstStep) firstStep.classList.add('active');
            }

            // Reset progress
            updateProgress('inquiry', 1);
        }

        // ===== INIT TRIGGERS =====
        function initTriggers() {
            // Use event delegation for better performance
            document.addEventListener('click', function(e) {
                const trigger = e.target.closest('.btn--neon, .btn--primary, a[href="#contact"], a[href="/kontakt"], .pricing-card .btn, .nav__link--cta');
                
                if (trigger) {
                    // Don't intercept form submit buttons or lead form
                    if (trigger.closest('#lead-form') || trigger.type === 'submit') return;
                    
                    e.preventDefault();
                    openModal();
                }
            });
        }

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

        // FAQ-Link im Success-State: Modal schließen + zur FAQ scrollen
        const faqLink = modal.querySelector('.success-card__link');
        if (faqLink) {
            faqLink.addEventListener('click', function(e) {
                e.preventDefault();
                closeModal();
                // Kurz warten bis Modal-Animation fertig, dann scrollen
                setTimeout(function() {
                    const target = document.querySelector('#faq');
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 400);
            });
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
            const content = elements.inquiryContent;

            content.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
            const targetStep = content.querySelector(`.form-step[data-step="${step}"]`);
            if (targetStep) {
                targetStep.classList.add('active');
            }

            updateProgress(path, step);
            trackModalStart(path, step);
        }

        function updateProgress(path, step) {
            const content = elements.inquiryContent;
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
            const content = elements.inquiryContent;
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
            const content = elements.inquiryContent;
            const currentStepEl = content.querySelector(`.form-step[data-step="${state.currentStep}"]`);
            if (!currentStepEl) return;

            if (state.currentStep === 1) {
                const selected = currentStepEl.querySelector('input[name="company-size"]:checked');
                if (selected) {
                    state.formData.companySize = selected.value;
                }
            } else if (state.currentStep === 2) {
                state.formData.painPoints = [];
                currentStepEl.querySelectorAll('input[name="pain-points"]:checked').forEach(input => {
                    state.formData.painPoints.push(input.value);
                });
            }
        }

        // ===== FORM SUBMISSION =====
        modal.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                const formMeta = getModalFormMeta(this, state.currentPath, state.currentStep);
                state.tracking.lastSubmittedMeta = formMeta;

                pushDataLayer('form_submit', formMeta);

                // Collect contact data
                const formElements = this.elements;
                const contactData = {
                    firstName: formElements['firstName']?.value || '',
                    lastName: formElements['lastName']?.value || '',
                    email: formElements['email']?.value || '',
                    phone: formElements['phone']?.value || '',
                    company: formElements['company']?.value || '',
                    'company-size': state.formData.companySize || '',
                    'pain-points': (state.formData.painPoints || []).join(', '),
                    website: formElements['website']?.value || '' // Honeypot field
                };

                // Check privacy consent
                const privacyConsent = this.querySelector('input[name="privacy"]');
                if (privacyConsent && !privacyConsent.checked) {
                    const checkbox = privacyConsent.closest('.privacy-checkbox');
                    if (checkbox) {
                        checkbox.style.border = '2px solid var(--color-accent)';
                        setTimeout(() => checkbox.style.border = '', 2000);
                    }
                    pushDataLayer('form_error', {
                        ...formMeta,
                        error_type: 'validation'
                    });
                    return;
                }

                // Disable submit button
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Wird gesendet...</span>';

                try {
                    // Send to Node.js API (JSON)
                    const response = await fetch('/api/send-email', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(contactData)
                    });

                    // Robust gegen Nicht-JSON Antworten (z.B. PHP-Fatal / HTML)
                    const rawText = await response.text();
                    let result = null;
                    try {
                        result = rawText ? JSON.parse(rawText) : null;
                    } catch (e) {
                        result = null;
                    }

                    if (response.ok && result && result.success) {
                        // Show success
                        state.formData.contact = contactData;
                        showSuccess();
                    } else {
                        // Show error
                        const serverMsg = result && result.message ? result.message : null;
                        const fallbackMsg = response.ok
                            ? 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
                            : 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
                        alert(serverMsg || fallbackMsg);
                        pushDataLayer('form_error', {
                            ...formMeta,
                            error_type: response.ok ? 'server' : 'network'
                        });
                        if (!result && rawText) {
                            console.warn('Non-JSON response from /api/send-email:', rawText);
                        }
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt per E-Mail.');
                    pushDataLayer('form_error', {
                        ...formMeta,
                        error_type: 'network'
                    });
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            });
        });

        function showSuccess() {
            elements.allContents.forEach(c => c.classList.remove('active'));
            const successHeader = document.querySelector('.contact-modal__header');
            if (successHeader) {
                successHeader.style.display = 'none';
            }
            elements.successState.classList.add('active');
            if (state.tracking.lastSubmittedMeta) {
                pushDataLayer('form_success', state.tracking.lastSubmittedMeta);
            }
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
