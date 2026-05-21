(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;

  var submitBtn = form.querySelector('.contact-form__submit');
  var submitText = form.querySelector('.contact-form__submit-text');
  var submitLoading = form.querySelector('.contact-form__submit-loading');
  var statusEl = form.querySelector('.contact-form__status');
  var privacyCheckbox = form.querySelector('.privacy-checkbox');

  function setLoading(loading) {
    submitBtn.disabled = loading;
    submitText.style.display = loading ? 'none' : '';
    submitLoading.style.display = loading ? 'inline-flex' : 'none';
    submitLoading.setAttribute('aria-hidden', String(!loading));
  }

  function showStatus(message, isError) {
    statusEl.textContent = message;
    statusEl.className = 'contact-form__status ' + (isError ? 'contact-form__status--error' : 'contact-form__status--success');
  }

  function clearStatus() {
    statusEl.textContent = '';
    statusEl.className = 'contact-form__status';
  }

  function validateField(field) {
    if (field.required && !field.value.trim()) {
      field.classList.add('is-invalid');
      return false;
    }
    if (field.type === 'email' && field.value.trim()) {
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
      if (!valid) {
        field.classList.add('is-invalid');
        return false;
      }
    }
    field.classList.remove('is-invalid');
    return true;
  }

  form.querySelectorAll('input, select, textarea').forEach(function (field) {
    field.addEventListener('input', function () {
      field.classList.remove('is-invalid');
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearStatus();

    var fields = form.querySelectorAll('[required]');
    var allValid = true;

    fields.forEach(function (field) {
      if (field.type === 'checkbox') {
        if (!field.checked) {
          allValid = false;
          privacyCheckbox.classList.add('is-invalid');
        } else {
          privacyCheckbox.classList.remove('is-invalid');
        }
      } else {
        if (!validateField(field)) allValid = false;
      }
    });

    if (!allValid) {
      showStatus('Bitte fülle alle Pflichtfelder aus.', true);
      var firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
      }
      return;
    }

    setLoading(true);

    var data = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      company: form.company.value.trim(),
      interest: form.interest.value,
      message: form.message.value.trim(),
      website: form.website.value
    };

    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) { return res.json(); })
      .then(function (result) {
        setLoading(false);
        if (result.success) {
          form.reset();
          showStatus(result.message, false);
          if (window.dataLayer) {
            window.dataLayer.push({ event: 'form_submit', form_name: 'contact' });
          }
        } else {
          showStatus(result.message || 'Ein Fehler ist aufgetreten.', true);
        }
      })
      .catch(function () {
        setLoading(false);
        showStatus('Verbindungsfehler. Bitte versuche es erneut oder kontaktiere uns direkt per E-Mail.', true);
      });
  });

  var privacyInput = document.getElementById('privacy');
  if (privacyInput) {
    privacyInput.addEventListener('change', function () {
      privacyCheckbox.classList.remove('is-invalid');
    });
  }
})();
