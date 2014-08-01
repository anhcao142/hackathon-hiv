$('#form-mail-subscriber').submit(function () {
    var $form = $(this);
    var $button = $form.find('button');
    $button.text('Xin chờ...')
    var values = {};
    $.each($form.serializeArray(), function (i, field) {
        values[field.name] = field.value;
    });
    if (values['email']) {
        $.post($form.attr('action'), {
            _csrf: values['_csrf'],
            email: values['email'],
            name: values['name']
        }, function(data){
            if (data === 'success') {
                $button.text('Đăng ký nhận thư');
                $form.find('#subscribe-alert').removeClass('text-danger').addClass('text-success').text('Đăng ký nhận thư thành công');
            } else {
                $button.text('Đăng ký nhận thư');
                $form.find('#subscribe-alert').removeClass('text-success').addClass('text-danger').text('Bạn đã đăng ký nhận thư của TOXBadge rồi');
            }
        });
     } else {
        $button.text('Đăng ký nhận thư');
        $form.find('#subscribe-alert').removeClass('text-success').addClass('text-danger').text('Bạn quên điền email');
     }
    return false;
});
