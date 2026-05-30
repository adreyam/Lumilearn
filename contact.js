document.addEventListener('DOMContentLoaded', function() {
  
  // ============ Elements ============
  const contactForm = document.getElementById('contactForm');
  const submitBtn = contactForm.querySelector('.submit-btn');
  const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
  
  // ============ Form Validation ============
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  function validateForm(formData) {
    const errors = [];
    
    // Validate name
    if (formData.name.trim().length < 2) {
      errors.push('Le prénom doit contenir au moins 2 caractères');
    }
    
    // Validate email
    if (!validateEmail(formData.email)) {
      errors.push('L\'email n\'est pas valide');
    }
    
    // Validate subject
    if (formData.subject.trim().length < 3) {
      errors.push('Le sujet doit contenir au moins 3 caractères');
    }
    
    // Validate message
    if (formData.message.trim().length < 10) {
      errors.push('Le message doit contenir au moins 10 caractères');
    }
    
    return errors;
  }
  
  // ============ Show Error Messages ============
  function showErrors(errors) {
    const errorHtml = `
      <div class="form-errors" style="
        background: linear-gradient(135deg, #FFE5E5 0%, #FFD1D1 100%);
        border-left: 4px solid #FF6B6B;
        padding: 15px 20px;
        border-radius: 12px;
        margin-bottom: 20px;
        animation: slideIn 0.3s ease-out;
      ">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
          <span style="font-size: 24px;">⚠️</span>
          <strong style="color: #C92A2A; font-size: 16px;">Oups ! Il y a quelques erreurs :</strong>
        </div>
        <ul style="margin: 0; padding-left: 35px; color: #C92A2A;">
          ${errors.map(error => `<li style="margin: 5px 0;">${error}</li>`).join('')}
        </ul>
      </div>
    `;
    
    // Remove existing errors
    const existingErrors = contactForm.querySelector('.form-errors');
    if (existingErrors) {
      existingErrors.remove();
    }
    
    // Insert new errors at the top of the form
    contactForm.insertAdjacentHTML('afterbegin', errorHtml);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      const errorDiv = contactForm.querySelector('.form-errors');
      if (errorDiv) {
        errorDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => errorDiv.remove(), 300);
      }
    }, 5000);
  }
  
  // ============ Show Success Message ============
  function showSuccess(name) {
    const successHtml = `
      <div class="form-success" style="
        background: linear-gradient(135deg, #E3F9E5 0%, #C1F2C7 100%);
        border-left: 4px solid #74C365;
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 20px;
        text-align: center;
        animation: bounceIn 0.5s ease-out;
      ">
        <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
        <h3 style="color: #2F9E44; margin: 10px 0;">Message envoyé avec succès !</h3>
        <p style="color: #2B8A3E; margin: 10px 0;">
          Merci ${name} ! 🌟<br>
          Nous avons bien reçu ton message et nous te répondrons très bientôt ! 💌
        </p>
      </div>
    `;
    
    // Remove existing messages
    const existingMessages = contactForm.querySelectorAll('.form-success, .form-errors');
    existingMessages.forEach(msg => msg.remove());
    
    // Insert success message
    contactForm.insertAdjacentHTML('afterbegin', successHtml);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      const successDiv = contactForm.querySelector('.form-success');
      if (successDiv) {
        successDiv.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => successDiv.remove(), 500);
      }
    }, 5000);
  }
  
  // ============ Form Submission ============
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value,
      timestamp: new Date().toISOString()
    };
    
    // Validate form
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
      showErrors(errors);
      return;
    }
    
    // Show loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '⏳ Envoi en cours...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.style.cursor = 'not-allowed';
    
    // Simulate sending (replace with actual API call)
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would normally send the data to your backend
      // Example:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      console.log('Form data submitted:', formData);
      
      // Save to localStorage as backup
      const contacts = JSON.parse(localStorage.getItem('lumilearn_contacts') || '[]');
      contacts.push(formData);
      localStorage.setItem('lumilearn_contacts', JSON.stringify(contacts));
      
      // Success state
      submitBtn.innerHTML = '✅ Envoyé !';
      submitBtn.style.backgroundColor = '#74C365';
      submitBtn.style.opacity = '1';
      
      // Show success message
      showSuccess(formData.name);
      
      // Reset form after delay
      setTimeout(() => {
        contactForm.reset();
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        submitBtn.style.backgroundColor = '';
        submitBtn.style.cursor = '';
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Error state
      submitBtn.innerHTML = '❌ Erreur';
      submitBtn.style.backgroundColor = '#FF6B6B';
      
      showErrors(['Une erreur est survenue. Veuillez réessayer.']);
      
      // Reset button after delay
      setTimeout(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        submitBtn.style.backgroundColor = '';
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = '';
      }, 2000);
    }
  });
  
  // ============ Input Animations ============
  inputs.forEach(input => {
    // Focus animation
    input.addEventListener('focus', function() {
      this.parentElement.style.transform = 'scale(1.02)';
      this.parentElement.style.transition = 'transform 0.2s ease';
    });
    
    // Blur animation
    input.addEventListener('blur', function() {
      this.parentElement.style.transform = 'scale(1)';
    });
    
    // Real-time validation feedback
    input.addEventListener('input', function() {
      // Remove error styling on input
      this.style.borderColor = '';
      
      // Remove error messages when user starts typing
      const errorDiv = contactForm.querySelector('.form-errors');
      if (errorDiv) {
        errorDiv.style.opacity = '0.5';
      }
    });
  });
  
  // ============ Character Counter for Textarea ============
  const messageTextarea = document.getElementById('message');
  const messageGroup = messageTextarea.parentElement;
  
  // Create counter element
  const counter = document.createElement('div');
  counter.className = 'char-counter';
  counter.style.cssText = `
    text-align: right;
    font-size: 12px;
    color: #868E96;
    margin-top: 5px;
  `;
  messageGroup.appendChild(counter);
  
  // Update counter
  function updateCounter() {
    const length = messageTextarea.value.length;
    const minLength = 10;
    
    counter.textContent = `${length} caractères`;
    
    if (length < minLength) {
      counter.style.color = '#FA5252';
      counter.textContent += ` (minimum ${minLength})`;
    } else {
      counter.style.color = '#74C365';
      counter.textContent += ' ✓';
    }
  }
  
  messageTextarea.addEventListener('input', updateCounter);
  updateCounter();
  
  // ============ Auto-save Draft ============
  let autoSaveTimeout;
  
  function saveDraft() {
    const draft = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value,
      savedAt: new Date().toISOString()
    };
    
    // Only save if there's some content
    if (draft.name || draft.email || draft.subject || draft.message) {
      localStorage.setItem('lumilearn_contact_draft', JSON.stringify(draft));
      console.log('Draft saved');
    }
  }
  
  // Auto-save on input with debounce
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      clearTimeout(autoSaveTimeout);
      autoSaveTimeout = setTimeout(saveDraft, 1000);
    });
  });
  
  // Restore draft on page load
  function restoreDraft() {
    const draft = localStorage.getItem('lumilearn_contact_draft');
    if (draft) {
      const data = JSON.parse(draft);
      
      // Ask user if they want to restore
      const restore = confirm('📝 Nous avons trouvé un brouillon sauvegardé. Veux-tu le restaurer ?');
      
      if (restore) {
        document.getElementById('name').value = data.name || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('subject').value = data.subject || '';
        document.getElementById('message').value = data.message || '';
        updateCounter();
      } else {
        localStorage.removeItem('lumilearn_contact_draft');
      }
    }
  }
  
  restoreDraft();
  
  // Clear draft after successful submission
  contactForm.addEventListener('submit', function() {
    localStorage.removeItem('lumilearn_contact_draft');
  });
  
  console.log('✅ Contact form initialized successfully');
});

// ============ CSS Animations (add to stylesheet or inject) ============
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-20px);
    }
  }
  
  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);