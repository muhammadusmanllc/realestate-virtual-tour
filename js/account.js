// Account Page JavaScript
// Login/Signup Forms with Validation and Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    initializeAccountPage();
});

function initializeAccountPage() {
    setupTabSwitching();
    setupFormValidation();
    setupPasswordStrength();
    setupPasswordToggles();
    setupSocialLogin();
    setupFormSubmissions();
    
    console.log('Account page initialized successfully!');
}

// Tab Switching Functionality
function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            switchToTab(tabName);
        });
    });
}

function switchToTab(tabName) {
    // Remove active class from all tabs and forms
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.account-form').forEach(form => form.classList.remove('active'));
    
    // Add active class to selected tab and form
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-form`).classList.add('active');
    
    // Clear any existing error messages
    clearAllErrors();
}

// Form switching functions (called from HTML)
function switchToSignin() {
    switchToTab('signin');
}

function switchToSignup() {
    switchToTab('signup');
}

function showForgotPassword() {
    // Hide all forms
    document.querySelectorAll('.account-form').forEach(form => form.classList.remove('active'));
    // Show forgot password form
    document.getElementById('forgot-password-form').classList.add('active');
    // Remove active state from tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
}

// Form Validation
function setupFormValidation() {
    const forms = ['login-form', 'register-form', 'forgot-form'];
    
    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            const inputs = form.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => validateField(input));
                input.addEventListener('input', () => clearFieldError(input));
            });
        }
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Clear previous error
    clearFieldError(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = `${getFieldLabel(field)} is required`;
        isValid = false;
    }
    // Email validation
    else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address';
            isValid = false;
        }
    }
    // Password validation
    else if (field.type === 'password' && fieldName === 'password' && value) {
        const passwordValidation = validatePassword(value);
        if (!passwordValidation.isValid) {
            errorMessage = passwordValidation.message;
            isValid = false;
        }
    }
    // Confirm password validation
    else if (fieldName === 'confirmPassword' && value) {
        const passwordField = document.getElementById('signup-password');
        if (passwordField && value !== passwordField.value) {
            errorMessage = 'Passwords do not match';
            isValid = false;
        }
    }
    // Phone validation
    else if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            errorMessage = 'Please enter a valid phone number';
            isValid = false;
        }
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!hasUpperCase || !hasLowerCase) {
        return { isValid: false, message: 'Password must contain both uppercase and lowercase letters' };
    }
    if (!hasNumbers) {
        return { isValid: false, message: 'Password must contain at least one number' };
    }
    if (!hasSpecialChar) {
        return { isValid: false, message: 'Password must contain at least one special character' };
    }

    return { isValid: true };
}

function getFieldLabel(field) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    return label ? label.textContent.replace('*', '').trim() : field.name;
}

function showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    field.style.borderColor = '#ef4444';
}

function clearFieldError(field) {
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
        errorElement.classList.remove('show');
    }
    field.style.borderColor = '#e5e7eb';
}

function clearAllErrors() {
    document.querySelectorAll('.input-error').forEach(error => {
        error.classList.remove('show');
    });
    document.querySelectorAll('input').forEach(input => {
        input.style.borderColor = '#e5e7eb';
    });
}

// Password Strength Indicator
function setupPasswordStrength() {
    const passwordField = document.getElementById('signup-password');
    if (passwordField) {
        passwordField.addEventListener('input', updatePasswordStrength);
    }
}

function updatePasswordStrength() {
    const password = document.getElementById('signup-password').value;
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthBar || !strengthText) return;

    let strength = 0;
    let strengthLabel = 'Weak';
    let strengthClass = 'weak';

    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

    // Remove previous classes
    strengthBar.classList.remove('weak', 'medium', 'good', 'strong');
    
    if (strength >= 4) {
        strengthLabel = 'Strong';
        strengthClass = 'strong';
    } else if (strength >= 3) {
        strengthLabel = 'Good';
        strengthClass = 'good';
    } else if (strength >= 2) {
        strengthLabel = 'Medium';
        strengthClass = 'medium';
    }

    strengthBar.classList.add(strengthClass);
    strengthText.textContent = `Password strength: ${strengthLabel}`;
}

// Password Toggle Functions
function setupPasswordToggles() {
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// Global function for password toggle (called from HTML)
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const toggle = field.nextElementSibling;
    const icon = toggle.querySelector('i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        field.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Form Submissions
function setupFormSubmissions() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Forgot password form
    const forgotForm = document.getElementById('forgot-form');
    if (forgotForm) {
        forgotForm.addEventListener('submit', handleForgotPassword);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const rememberMe = formData.get('remember');

    // Validate form
    let isValid = true;
    const emailField = document.getElementById('signin-email');
    const passwordField = document.getElementById('signin-password');

    if (!validateField(emailField)) isValid = false;
    if (!validateField(passwordField)) isValid = false;

    if (!isValid) return;

    // Show loading state
    showButtonLoading('login-form');

    try {
        // Simulate API call
        await simulateApiCall(1500);
        
        // In a real application, you would make an actual API call here
        console.log('Login attempt:', { email, password, rememberMe });
        
        // Store user data (in a real app, this would come from the API)
        const userData = {
            id: '12345',
            email: email,
            firstName: 'John',
            lastName: 'Doe',
            userType: 'buyer'
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Show success
        showSuccessModal('Welcome Back!', `Successfully signed in as ${email}. Redirecting to your dashboard...`);
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        
    } catch (error) {
        showFieldError(emailField, 'Invalid email or password');
        console.error('Login error:', error);
    } finally {
        hideButtonLoading('login-form');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = {
        firstName: formData.get('firstname'),
        lastName: formData.get('lastname'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        userType: formData.get('userType'),
        newsletter: formData.get('newsletter'),
        terms: formData.get('terms')
    };

    // Validate form
    let isValid = true;
    const requiredFields = ['signup-firstname', 'signup-lastname', 'signup-email', 'signup-password', 'confirm-password', 'user-type'];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!validateField(field)) isValid = false;
    });

    // Check terms agreement
    if (!userData.terms) {
        showNotification('Please agree to the Terms of Service and Privacy Policy', 'error');
        isValid = false;
    }

    if (!isValid) return;

    // Show loading state
    showButtonLoading('register-form');

    try {
        // Simulate API call
        await simulateApiCall(2000);
        
        console.log('Registration attempt:', userData);
        
        // Store user data (in a real app, this would come from the API)
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('user', JSON.stringify(newUser));
        
        // Show success
        showSuccessModal('Welcome to RealEstate Pro!', 'Your account has been created successfully. You can now access all premium features.');
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        
    } catch (error) {
        showNotification('Registration failed. Please try again.', 'error');
        console.error('Registration error:', error);
    } finally {
        hideButtonLoading('register-form');
    }
}

async function handleForgotPassword(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');

    // Validate email
    const emailField = document.getElementById('forgot-email');
    if (!validateField(emailField)) return;

    // Show loading state
    showButtonLoading('forgot-form');

    try {
        // Simulate API call
        await simulateApiCall(1500);
        
        console.log('Password reset for:', email);
        
        // Show success message
        showNotification('Password reset link sent to your email', 'success');
        
        // Switch back to login after delay
        setTimeout(() => {
            switchToSignin();
        }, 2000);
        
    } catch (error) {
        showFieldError(emailField, 'Failed to send reset email. Please try again.');
        console.error('Password reset error:', error);
    } finally {
        hideButtonLoading('forgot-form');
    }
}

// Social Login Functions (called from HTML)
function signInWithGoogle() {
    showNotification('Google Sign In will be implemented here', 'info');
    // In a real application, integrate with Google OAuth
}

function signUpWithGoogle() {
    showNotification('Google Sign Up will be implemented here', 'info');
}

function signInWithFacebook() {
    showNotification('Facebook Sign In will be implemented here', 'info');
    // In a real application, integrate with Facebook Login
}

function signUpWithFacebook() {
    showNotification('Facebook Sign Up will be implemented here', 'info');
}

// UI Helper Functions
function showButtonLoading(formId) {
    const form = document.getElementById(formId);
    const button = form.querySelector('.submit-btn');
    const btnText = button.querySelector('.btn-text');
    const btnLoader = button.querySelector('.btn-loader');
    
    button.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
}

function hideButtonLoading(formId) {
    const form = document.getElementById(formId);
    const button = form.querySelector('.submit-btn');
    const btnText = button.querySelector('.btn-text');
    const btnLoader = button.querySelector('.btn-loader');
    
    button.disabled = false;
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
}

function showSuccessModal(title, message) {
    const modal = document.getElementById('success-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('success-modal');
    modal.classList.remove('show');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#14b8a6'};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-size: 14px;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Utility Functions
async function simulateApiCall(delay = 1000) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

// Setup Social Login (placeholder for real implementations)
function setupSocialLogin() {
    // This would integrate with actual social login SDKs
    console.log('Social login setup (placeholder)');
}

// Check if user is already logged in
function checkAuthState() {
    const user = localStorage.getItem('user');
    if (user) {
        // User is logged in, could redirect to dashboard
        console.log('User is already logged in:', JSON.parse(user));
    }
}

// Initialize auth state check
checkAuthState();

// Global functions for HTML onclick events
window.switchToSignin = switchToSignin;
window.switchToSignup = switchToSignup;
window.showForgotPassword = showForgotPassword;
window.togglePassword = togglePassword;
window.signInWithGoogle = signInWithGoogle;
window.signUpWithGoogle = signUpWithGoogle;
window.signInWithFacebook = signInWithFacebook;
window.signUpWithFacebook = signUpWithFacebook;
window.closeModal = closeModal;