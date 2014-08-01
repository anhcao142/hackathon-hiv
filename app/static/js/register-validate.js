$('#form-register').validate({
    rules: {
        username: {
            required: true,
            pattern: "^[a-zA-Z0-9_-]*$",
            remote: "/register/check-username",
            minlength: 3,
            maxlength: 15
        },
        email: {
            required: true,
            email: true,
            remote: "/register/check-email"
        },
        password: {
            required:true,
            minlength: 8
        },
        confirmPassword: {
            required: true,
            equalTo: "#password"
        },
        name: "required"
    }, 
    messages: {
        username: {
            required: "Hãy điền tên tài khoản",
            remote: jQuery.validator.format("{0} đã được sử dụng"),
            pattern: "Tên tài khoản hợp lệ phải chứa các chữ cái hoa, thường, kí tự '_' và '-'",
            minlength: jQuery.validator.format("Tên tài khoản chưa đủ dài"),
            maxlength: jQuery.validator.format("Tên tài khoản quá dài")
        },
        email: {
            required: "Hãy điền email",
            email:"Email chưa hợp lệ",
            remote: jQuery.validator.format("{0} đã được sử dụng"),
        },
        password: {
            required: "Hãy điền mật khẩu",
            minlength: jQuery.validator.format("Password phải chứa ít nhất {0} kí tự")
        },
        confirmPassword: {
            required: "Hãy điền xác nhận mật khẩu",
            equalTo: "Xác nhận mật khẩu phải giống với mật khẩu"
        },
        name: {
            required: "Hãy điền tên hiển thị"
        }
    }, 
    errorClass: "help-block",
    errorElement: "small",
    highlight: function(element) {
        $(element).parent().removeClass('has-success').addClass('has-error');
    },
    success: function(label) {
        $(label).parent().removeClass('has-error').addClass('has-success');
    }
});
