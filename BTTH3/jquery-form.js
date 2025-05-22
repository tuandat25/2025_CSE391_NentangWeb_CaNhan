/* filepath: c:\Users\dat20\Desktop\FE\NT_WEB\BTTH3\jquery-form.js */

$().ready(function () {
    console.log("jQuery is ready!");

    // Add a "Show more information" section with animation
    $("<div>")
        .addClass("mt-3")
        .html(`
            <p class="mb-2"><a href="#" id="toggleMoreInfo">Xem thêm thông tin <i class="fas fa-chevron-down"></i></a></p>
            <div id="moreInfo" class="card p-3 d-none">
                <p>Form đăng ký này sử dụng jQuery và AJAX để xử lý dữ liệu mà không cần tải lại trang.</p>
                <p>Dữ liệu sẽ được gửi đến một API giả lập và hiển thị kết quả cho người dùng.</p>
                <p>Các tính năng:</p>
                <ul>
                    <li>Kiểm tra dữ liệu nhập vào (validation)</li>
                    <li>Gửi dữ liệu bằng AJAX</li>
                    <li>Hiệu ứng animation khi xử lý form</li>
                </ul>
            </div>
        `)
        .insertAfter("#registrationForm");

    // Toggle more information section with slide animation
    $("#toggleMoreInfo").on("click", function (e) {
        e.preventDefault();
        $("#moreInfo").slideToggle(400, function () {
            const isVisible = $(this).is(":visible");
            $(this).toggleClass("d-none", !isVisible);

            // Change icon direction
            if (isVisible) {
                $("#toggleMoreInfo i").removeClass("fa-chevron-down").addClass("fa-chevron-up");
            } else {
                $("#toggleMoreInfo i").removeClass("fa-chevron-up").addClass("fa-chevron-down");
            }
        });
    });    // Add custom validation method for fullName (no numbers allowed)
    $.validator.addMethod("noDigits", function (value, element) {
        return this.optional(element) || !/\d/.test(value);
    }, "Họ tên không được chứa chữ số");

    // Add custom validation method for strong password
    $.validator.addMethod("strongPassword", function (value, element) {
        return this.optional(element) || 
            /[A-Z]/.test(value) && // có ít nhất 1 chữ hoa
            /[a-z]/.test(value) && // có ít nhất 1 chữ thường
            /[0-9]/.test(value) && // có ít nhất 1 số
            /[^A-Za-z0-9]/.test(value); // có ít nhất 1 ký tự đặc biệt
    }, "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt");

    // Handle toggle password visibility
    // $(".toggle-password").on("click", function() {
    //     const targetId = $(this).data("target");
    //     const passwordInput = $("#" + targetId);
    //     const icon = $(this).find("i");
        
    //     // Toggle password visibility
    //     if (passwordInput.attr("type") === "password") {
    //         passwordInput.attr("type", "text");
    //         icon.removeClass("fa-eye").addClass("fa-eye-slash");
    //     } else {
    //         passwordInput.attr("type", "password");
    //         icon.removeClass("fa-eye-slash").addClass("fa-eye");
    //     }
    // });

    // Form validation using jQuery Validate plugin
    $("#registrationForm").validate({
        rules: {
            "fullName": {
                required: true,
                maxlength: 50,
                noDigits: true
            },            "email": {
                required: true,
                email: true,
                maxlength: 50
            },
            "password": {
                required: true,
                minlength: 8,
                strongPassword: true
            },
            "confirmPassword": {
                required: true,
                equalTo: "#password"
            },
            "phone": {
                digits: true,
                minlength: 10,
                maxlength: 11
            }
        },
        messages: {
            "fullName": {
                required: "Vui lòng nhập họ và tên",
                maxlength: "Họ tên không được quá 50 ký tự"
            },
            "email": {
                required: "Vui lòng nhập email",
                email: "Email không hợp lệ",
                maxlength: "Email không được quá 50 ký tự"
            },            "password": {
                required: "Vui lòng nhập mật khẩu",
                minlength: "Mật khẩu phải có ít nhất 8 ký tự",
                strongPassword: "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
            },
            "confirmPassword": {
                required: "Vui lòng xác nhận mật khẩu",
                equalTo: "Mật khẩu xác nhận không khớp"
            },
            "phone": {
                digits: "Số điện thoại chỉ được chứa số",
                minlength: "Số điện thoại phải có ít nhất 10 số",
                maxlength: "Số điện thoại không được quá 11 số"
            }
        },
        errorElement: "span",
        errorClass: "text-danger",
        highlight: function (element) {
            $(element).addClass("is-invalid");
        },
        unhighlight: function (element) {
            $(element).removeClass("is-invalid");
        },
        submitHandler: function (form) {
            // Prepare form data
            const formData = {
                fullName: $("#fullName").val().trim(),
                email: $("#email").val().trim(),
                password: $("#password").val(),
                phone: $("#phone").val().trim()
            };

            // Send data using AJAX
            $.ajax({
                url: "https://jsonplaceholder.typicode.com/posts", // Mock API endpoint
                type: "POST",
                data: JSON.stringify(formData),
                contentType: "application/json",
                dataType: "json",
                beforeSend: function () {
                    // Disable submit button and show loading state
                    $("#registrationForm button[type='submit']")
                        .prop("disabled", true)
                        .html('<i class="fas fa-spinner fa-spin"></i> Đang xử lý...');
                },
                success: function (response) {
                    console.log("Registration successful:", response);

                    // Display user info in success message
                    $("#userInfo").html(`
                        <p><strong>Họ và tên:</strong> ${formData.fullName}</p>
                        <p><strong>Email:</strong> ${formData.email}</p>
                        <p><strong>Số điện thoại:</strong> ${formData.phone || "Không cung cấp"}</p>
                        <p><strong>ID đăng ký:</strong> ${response.id}</p>
                    `);

                    // Hide form with animation and show success message
                    $("#registrationForm").closest(".card").slideUp(800, function () {
                        $("#successMessage").fadeIn(500).removeClass("d-none");
                    });
                },
                error: function (xhr, status, error) {
                    console.error("Error:", error);

                    // Show error alert
                    $("<div>")
                        .addClass("alert alert-danger mt-3")
                        .text("Lỗi server: Không thể xử lý yêu cầu. Vui lòng thử lại sau.")
                        .insertAfter("#registrationForm");

                    // Re-enable submit button
                    $("#registrationForm button[type='submit']")
                        .prop("disabled", false)
                        .text("Đăng ký");
                }
            });

            // return false; // Prevent normal form submission
        }
    });
});