$(document).ready(function() {
    // Form validation
    $('#employeeForm').on('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const form = this;
        
        // Reset validation state
        $(form).find('.is-invalid').removeClass('is-invalid');
        $(form).find('.error-message').text('');
        
        // Validate required fields
        $(form).find('[required]').each(function() {
            if ($(this).is(':radio')) {
                const name = $(this).attr('name');
                if (!$(`input[name="${name}"]:checked`).length) {
                    $(`input[name="${name}"]`).first().addClass('is-invalid');
                    isValid = false;
                }
            } else if ($(this).val() === '') {
                $(this).addClass('is-invalid');
                const id = $(this).attr('id');
                $(`#${id}-error`).text('Trường này là bắt buộc');
                isValid = false;
            }
        });
        
        // Validate firstName: không chứa số
        const firstNameInput = $('#firstName');
        if (firstNameInput.val() && /\d/.test(firstNameInput.val())) {
            firstNameInput.addClass('is-invalid');
            $('#firstName-error').text('Tên không được chứa số');
            isValid = false;
        }

        // Validate lastName: không chứa số
        const lastNameInput = $('#lastName');
        if (lastNameInput.val() && /\d/.test(lastNameInput.val())) {
            lastNameInput.addClass('is-invalid');
            $('#lastName-error').text('Tên không được chứa số');
            isValid = false;
        }
        
        // Validate email format
        const emailInput = $('#email');
        if (emailInput.val() && !isValidEmail(emailInput.val())) {
            emailInput.addClass('is-invalid');
            $('#email-error').text('Email phải đúng định dạng (ví dụ: abc@xyz.com)');
            isValid = false;
        }
        
        // Validate birthDate, hireDate: required
        const birthDateInput = $('#birthDate');
        if (!birthDateInput.val()) {
            birthDateInput.addClass('is-invalid');
            $('#birthDate-error').text('Vui lòng chọn ngày sinh');
            isValid = false;
        }
        
        const hireDateInput = $('#hireDate');
        if (!hireDateInput.val()) {
            hireDateInput.addClass('is-invalid');
            $('#hireDate-error').text('Vui lòng chọn ngày vào làm');
            isValid = false;
        }
        
        // Validate phone format
        const phoneInput = $('#phone');
        if (phoneInput.val() && !isValidPhone(phoneInput.val())) {
            phoneInput.addClass('is-invalid');
            phoneInput.nextAll('.error-message').first().text('Số điện thoại phải đúng định dạng (123)456-7890');
            isValid = false;
        }
        
        // Validate SSN format if provided
        const ssnInput = $('#ssn');
        if (ssnInput.val() && !isValidSSN(ssnInput.val())) {
            ssnInput.addClass('is-invalid');
            ssnInput.nextAll('.error-message').first().text('SSN phải đúng định dạng XXX-XX-XXXX');
            isValid = false;
        }
        
        // Store rich text content
        const notesContent = $('#notes').html();
        $('input[name="notesContent"]').val(notesContent);
        
        if (isValid) {
            // Form is valid, you can submit it
            alert('Form is valid! In a real application, this would be submitted.');
            // Uncomment the line below to actually submit the form
            // form.submit();
        } else {
            // Scroll to the first invalid field
            const firstInvalid = $(form).find('.is-invalid').first();
            if (firstInvalid.length) {
                $('html, body').animate({
                    scrollTop: firstInvalid.offset().top - 100
                }, 200);
            }
        }
    });
    
    // Input validation on blur
    $('input, select, textarea').on('blur', function() {
        validateField($(this));
    });
    
    // Input validation on change for select, radio, and checkbox
    $('select, input[type="radio"], input[type="checkbox"]').on('change', function() {
        validateField($(this));
    });
    
    // Format phone number as user types
    $('#phone').on('input', function() {
        let value = $(this).val().replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) {
                value = '(' + value;
            } else if (value.length <= 6) {
                value = '(' + value.substring(0, 3) + ')' + value.substring(3);
            } else {
                value = '(' + value.substring(0, 3) + ')' + value.substring(3, 6) + '-' + value.substring(6, 10);
            }
        }
        $(this).val(value);
    });
    
    // Format SSN as user types
    $('#ssn').on('input', function() {
        let value = $(this).val().replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) {
                // Do nothing, just the first part
            } else if (value.length <= 5) {
                value = value.substring(0, 3) + '-' + value.substring(3);
            } else {
                value = value.substring(0, 3) + '-' + value.substring(3, 5) + '-' + value.substring(5, 9);
            }
        }
        $(this).val(value);
    });
    
    // Rich text editor functionality
    $('.rich-text-toolbar button').on('click', function() {
        const command = $(this).attr('title').toLowerCase();
        if (command === 'link') {
            const url = prompt('Enter URL:');
            if (url) {
                document.execCommand('createLink', false, url);
            }
        } else if (command === 'image') {
            const url = prompt('Enter image URL:');
            if (url) {
                document.execCommand('insertImage', false, url);
            }
        } else {
            document.execCommand(command, false, null);
        }
        $('#notes').focus();
    });
    
    // Captcha refresh button
    $('.captcha-container button').on('click', function() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let captcha = '';
        for (let i = 0; i < 6; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        $('.captcha-text').text(captcha);
    });
    
    // Helper functions
    function validateField($field) {
        const id = $field.attr('id');
        if ($field.is(':radio')) {
            const name = $field.attr('name');
            if ($field.prop('required') && !$(`input[name="${name}"]:checked`).length) {
                $(`input[name="${name}"]`).first().addClass('is-invalid');
            } else {
                $(`input[name="${name}"]`).removeClass('is-invalid');
            }
        } else if ($field.prop('required') && $field.val() === '') {
            $field.addClass('is-invalid');
            if (id) $(`#${id}-error`).text('Trường này là bắt buộc');
        } else if (id === 'firstName' && /\d/.test($field.val())) {
            $field.addClass('is-invalid');
            $('#firstName-error').text('Tên không được chứa số');
        } else if ($field.attr('type') === 'email' && $field.val() && !isValidEmail($field.val())) {
            $field.addClass('is-invalid');
            $('#email-error').text('Email phải đúng định dạng (ví dụ: abc@xyz.com)');
        } else if (id === 'phone' && $field.val() && !isValidPhone($field.val())) {
            $field.addClass('is-invalid');
            $field.nextAll('.error-message').first().text('Số điện thoại phải đúng định dạng (123)456-7890');
        } else if (id === 'ssn' && $field.val() && !isValidSSN($field.val())) {
            $field.addClass('is-invalid');
            $field.nextAll('.error-message').first().text('SSN phải đúng định dạng XXX-XX-XXXX');
        } else {
            $field.removeClass('is-invalid');
            if (id) $(`#${id}-error`).text('');
        }
    }
    
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    function isValidPhone(phone) {
        const regex = /^\(\d{3}\)\d{3}-\d{4}$/;
        return regex.test(phone);
    }
    
    function isValidSSN(ssn) {
        const regex = /^\d{3}-\d{2}-\d{4}$/;
        return regex.test(ssn);
    }
});