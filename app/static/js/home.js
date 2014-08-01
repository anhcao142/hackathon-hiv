var testPatient = $('.js-test-patient');

testPatient.css('cursor', 'pointer');

function populateData(ele) {
    console.log(ele);
    var pr_seq = $(ele).find('.pr_seq').html();
    var rt_seq = $(ele).find('.rt_seq').html();

    $('textarea[name="pr_seq"]').val(pr_seq);
    $('textarea[name="rt_seq"]').val(rt_seq);
}

$('#predict-infection').submit(function (e) {
    e.preventDefault();
    $('.loading').removeClass('hide');

    if (!$('.js-yes').hasClass('hide')) {
        $('.js-yes').addClass('hide');
    };

    if (!$('.js-no').hasClass('hide')) {
        $('.js-no').addClass('hide');
    };

    if (!$('.js-undetermined').hasClass('hide')) {
        $('.js-undetermined').addClass('hide');
    };

    var $form = $(this);

    var body = {
        _csrf: $form.find('input[name="_csrf"]').val(),
        pr_seq: $form.find('textarea[name="pr_seq"]').val(),
        rt_seq: $form.find('textarea[name="rt_seq"]').val()
    }

    var url = $form.attr('action');

    $.post(url, body, function(data) {
        console.log(data);
        if (!data) {
            setTimeout('setUndetermined()', 3000);
            return;
        };

        if (data.resp) {
            setTimeout('setYes()', 3000);
        } else {
            setTimeout('setNo()', 3000);
        }
    })
})

function setYes() {
    $('.loading').addClass('hide');
    $('.js-yes').removeClass('hide');
}

function setNo() {
    $('.loading').addClass('hide');
    $('.js-no').removeClass('hide');
}

function setUndetermined() {
    $('.loading').addClass('hide');
    $('.js-undetermined').removeClass('hide');
}