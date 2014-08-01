$('#sendFeedback').validate({
    rules: {
        email: {
            required: true,
            email: true,
        },
        issue: {
            required:true,
            maxlength: 100
        },
        description: {
            required: true,
            maxlength: 16384
        }
    },
    messages: {
        email: {
            required: "Hãy điền email",
            email:"Email chưa hợp lệ",
        },
        issue: {
            required: "Hãy điền vấn đề mà bạn muốn phản hồi",
            maxlength: jQuery.validator.format("Bạn chỉ có thể điền {0} kí tự")
        },
        description: {
            required: "Hãy điền miêu tả chi tiết của vấn đề/ý tưởng bạn muốn phản hồi",
            maxlength: jQuery.validator.format("Bạn chỉ có thể điền {0} kí tự")
        }
    },
    errorClass: "error-block",
    errorElement: "span",
    highlight: function(element) {
        $(element).parent().removeClass('has-success').addClass('has-error');
    },
    success: function(label) {
        $(label).remove(".error-block");
    }
});
