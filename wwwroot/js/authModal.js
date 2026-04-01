/**
 * Authentication Modal Handler
 * Manages login/register modal for unauthenticated users trying to save reports
 */
window.AuthModal = (function () {
    'use strict';

    let modalInstance = null;
    let pendingSaveCallback = null;

    /**
     * Initialize the authentication modal
     */
    function init() {
        const modalElement = document.getElementById('authModal');
        if (!modalElement) {
            console.error('AuthModal: Modal element not found');
            return;
        }

        modalInstance = new bootstrap.Modal(modalElement);

        // Bind form submissions
        bindLoginForm();
        bindRegisterForm();
        bindPasswordToggles();

        // Reset forms when modal is hidden
        modalElement.addEventListener('hidden.bs.modal', function () {
            resetForms();
        });

        console.log('AuthModal: Initialized');
    }

    /**
     * Show the authentication modal for saving a report
     * @param {Function} saveCallback - Function to call after successful authentication
     */
    function showForSave(saveCallback) {
        if (!modalInstance) {
            init();
        }

        pendingSaveCallback = saveCallback;
        modalInstance.show();
    }

    /**
     * Hide the modal
     */
    function hide() {
        if (modalInstance) {
            modalInstance.hide();
        }
    }

    /**
     * Bind login form submission
     */
    function bindLoginForm() {
        const form = document.getElementById('ajaxLoginForm');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            handleLogin();
        });
    }

    /**
     * Bind register form submission
     */
    function bindRegisterForm() {
        const form = document.getElementById('ajaxRegisterForm');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            handleRegister();
        });
    }

    /**
     * Bind password visibility toggles
     */
    function bindPasswordToggles() {
        // Login password toggle
        const toggleLogin = document.getElementById('toggleLoginPassword');
        const loginPassword = document.getElementById('loginPassword');
        if (toggleLogin && loginPassword) {
            toggleLogin.addEventListener('click', function () {
                togglePasswordVisibility(loginPassword, toggleLogin);
            });
        }

        // Register password toggle
        const toggleRegister = document.getElementById('toggleRegisterPassword');
        const registerPassword = document.getElementById('registerPassword');
        if (toggleRegister && registerPassword) {
            toggleRegister.addEventListener('click', function () {
                togglePasswordVisibility(registerPassword, toggleRegister);
            });
        }
    }

    /**
     * Toggle password field visibility
     */
    function togglePasswordVisibility(input, button) {
        const icon = button.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
        }
    }

    /**
     * Handle login form submission
     */
    function handleLogin() {
        const form = document.getElementById('ajaxLoginForm');
        const submitBtn = document.getElementById('loginSubmitBtn');
        const errorDiv = document.getElementById('loginError');

        // Clear previous errors
        clearErrors('login');

        // Get form data
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('loginRememberMe').checked;

        // Validate
        let isValid = true;
        if (!email) {
            showFieldError('loginEmail', 'loginEmailError', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showFieldError('loginEmail', 'loginEmailError', 'Please enter a valid email address');
            isValid = false;
        }

        if (!password) {
            showFieldError('loginPassword', 'loginPasswordError', 'Password is required');
            isValid = false;
        }

        if (!isValid) return;

        // Show loading state
        setButtonLoading(submitBtn, true);

        // Get anti-forgery token
        const token = getAntiForgeryToken();

        // Submit AJAX request
        fetch('/Account/AjaxLogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': token
            },
            body: JSON.stringify({
                email: email,
                password: password,
                rememberMe: rememberMe
            })
        })
            .then(response => response.json())
            .then(data => {
                setButtonLoading(submitBtn, false);

                if (data.success) {
                    // Close modal and execute save callback
                    hide();
                    if (pendingSaveCallback) {
                        // Small delay to ensure session is established
                        setTimeout(function () {
                            pendingSaveCallback();
                            pendingSaveCallback = null;
                        }, 100);
                    }
                } else {
                    showError(errorDiv, data.message || 'Login failed. Please try again.');
                }
            })
            .catch(error => {
                setButtonLoading(submitBtn, false);
                showError(errorDiv, 'An error occurred. Please try again.');
                console.error('AuthModal: Login error', error);
            });
    }

    /**
     * Handle register form submission
     */
    function handleRegister() {
        const form = document.getElementById('ajaxRegisterForm');
        const submitBtn = document.getElementById('registerSubmitBtn');
        const errorDiv = document.getElementById('registerError');

        // Clear previous errors
        clearErrors('register');

        // Get form data
        const firstName = document.getElementById('registerFirstName').value.trim();
        const lastName = document.getElementById('registerLastName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const organization = document.getElementById('registerOrganization').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        // Validate
        let isValid = true;

        if (!firstName) {
            showFieldError('registerFirstName', 'registerFirstNameError', 'First name is required');
            isValid = false;
        }

        if (!lastName) {
            showFieldError('registerLastName', 'registerLastNameError', 'Last name is required');
            isValid = false;
        }

        if (!email) {
            showFieldError('registerEmail', 'registerEmailError', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showFieldError('registerEmail', 'registerEmailError', 'Please enter a valid email address');
            isValid = false;
        }

        if (!password) {
            showFieldError('registerPassword', 'registerPasswordError', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showFieldError('registerPassword', 'registerPasswordError', 'Password must be at least 6 characters');
            isValid = false;
        }

        if (!confirmPassword) {
            showFieldError('registerConfirmPassword', 'registerConfirmPasswordError', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showFieldError('registerConfirmPassword', 'registerConfirmPasswordError', 'Passwords do not match');
            isValid = false;
        }

        if (!isValid) return;

        // Show loading state
        setButtonLoading(submitBtn, true);

        // Get anti-forgery token
        const token = getAntiForgeryToken();

        // Submit AJAX request
        fetch('/Account/AjaxRegister', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': token
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                organization: organization,
                password: password,
                confirmPassword: confirmPassword
            })
        })
            .then(response => response.json())
            .then(data => {
                setButtonLoading(submitBtn, false);

                if (data.success) {
                    // Close modal and execute save callback
                    hide();
                    if (pendingSaveCallback) {
                        // Small delay to ensure session is established
                        setTimeout(function () {
                            pendingSaveCallback();
                            pendingSaveCallback = null;
                        }, 100);
                    }
                } else {
                    showError(errorDiv, data.message || 'Registration failed. Please try again.');
                }
            })
            .catch(error => {
                setButtonLoading(submitBtn, false);
                showError(errorDiv, 'An error occurred. Please try again.');
                console.error('AuthModal: Register error', error);
            });
    }

    /**
     * Get anti-forgery token from the page
     */
    function getAntiForgeryToken() {
        const tokenInput = document.querySelector('input[name="__RequestVerificationToken"]');
        return tokenInput ? tokenInput.value : '';
    }

    /**
     * Validate email format
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Show field validation error
     */
    function showFieldError(inputId, errorId, message) {
        const input = document.getElementById(inputId);
        const errorDiv = document.getElementById(errorId);

        if (input) {
            input.classList.add('is-invalid');
        }
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    /**
     * Show general error message
     */
    function showError(errorDiv, message) {
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.remove('d-none');
        }
    }

    /**
     * Clear all errors for a form
     */
    function clearErrors(formType) {
        const prefix = formType === 'login' ? 'login' : 'register';

        // Clear general error
        const errorDiv = document.getElementById(prefix + 'Error');
        if (errorDiv) {
            errorDiv.classList.add('d-none');
            errorDiv.textContent = '';
        }

        // Clear field errors
        const form = document.getElementById('ajax' + (formType === 'login' ? 'Login' : 'Register') + 'Form');
        if (form) {
            form.querySelectorAll('.is-invalid').forEach(function (el) {
                el.classList.remove('is-invalid');
            });
            form.querySelectorAll('.invalid-feedback').forEach(function (el) {
                el.textContent = '';
                el.style.display = '';
            });
        }
    }

    /**
     * Set button loading state
     */
    function setButtonLoading(button, isLoading) {
        if (!button) return;

        const btnText = button.querySelector('.btn-text');
        const spinner = button.querySelector('.spinner-border');

        if (isLoading) {
            button.disabled = true;
            if (btnText) btnText.classList.add('d-none');
            if (spinner) spinner.classList.remove('d-none');
        } else {
            button.disabled = false;
            if (btnText) btnText.classList.remove('d-none');
            if (spinner) spinner.classList.add('d-none');
        }
    }

    /**
     * Reset all forms to initial state
     */
    function resetForms() {
        // Reset login form
        const loginForm = document.getElementById('ajaxLoginForm');
        if (loginForm) {
            loginForm.reset();
            clearErrors('login');
        }

        // Reset register form
        const registerForm = document.getElementById('ajaxRegisterForm');
        if (registerForm) {
            registerForm.reset();
            clearErrors('register');
        }

        // Reset to login tab
        const loginTab = document.getElementById('login-tab');
        if (loginTab) {
            const tab = new bootstrap.Tab(loginTab);
            tab.show();
        }

        // Reset password visibility
        const passwordInputs = document.querySelectorAll('#authModal input[type="text"][id*="Password"]');
        passwordInputs.forEach(function (input) {
            input.type = 'password';
        });

        const eyeIcons = document.querySelectorAll('#authModal .bi-eye-slash');
        eyeIcons.forEach(function (icon) {
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
        });
    }

    // Public API
    return {
        init: init,
        showForSave: showForSave,
        hide: hide
    };
})();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('authModal')) {
        AuthModal.init();
    }
});
