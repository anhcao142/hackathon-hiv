var testPatient = $('.js-test-patient');

testPatient.css('cursor', 'pointer');

$(function () {
    $('textarea').autosize({append:''});

    $('.nucle').click(function() {
        var nucle = $(this);
        $(this).addClass('hide');
        $(this).prev().removeClass('hide').trigger('autosize.resize');;
        $(this).prev().focus();
    });

    $('.nu-text').focusout(function () {
        console.log('abc');
        $(this).next().removeClass('hide');
        $(this).addClass('hide');
    });
    //google.load('visualization', '1.0', {'packages':['corechart']});
    //google.setOnLoadCallback(drawChart);
});


function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['Generation', 'Descendants'],
    [0, 1], [1, 33], [2, 269], [3, 2013]
 ]);

  var options = {
    title: 'Descendants by Generation',
    hAxis: {title: 'Generation', minValue: 0, maxValue: 3},
    vAxis: {title: 'Descendants', minValue: 0, maxValue: 2100},
    trendlines: {
      0: {
        type: 'exponential',
        visibleInLegend: true,
      }
    }
  };

  var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}

function populateData(ele) {
    console.log(ele);
    var pr_seq = $(ele).find('.pr_seq').html();
    var rt_seq = $(ele).find('.rt_seq').html();

    $('textarea[name="pr_seq"]').val(pr_seq).trigger('autosize.resize');
    pr_seq = pr_seq.replace(/C/gi, 'PP');
    pr_seq = pr_seq.replace(/PP/gi, '<xxxx xxxxx="nu-c">C</xxxx>');
    pr_seq = pr_seq.replace(/A/gi, 'PP');
    pr_seq = pr_seq.replace(/PP/gi, '<xxxx xxxxx="nu-a">A</xxxx>');
    pr_seq = pr_seq.replace(/T/gi, 'PP');
    pr_seq = pr_seq.replace(/PP/gi, '<xxxx xxxxx="nu-t">T</xxxx>');
    
    pr_seq = pr_seq.replace(/G/gi, 'PP');
    pr_seq = pr_seq.replace(/PP/gi, '<xxxx xxxxx="nu-g">G</xxxx>');
    pr_seq = pr_seq.replace(/xxxxx/gi, 'class');
    pr_seq = pr_seq.replace(/xxxx/gi, 'span');

    $('textarea[name="pr_seq"]').next().html(pr_seq);
    $('textarea[name="rt_seq"]').val(rt_seq).trigger('autosize.resize');
    rt_seq = rt_seq.replace(/C/gi, 'PP');
    rt_seq = rt_seq.replace(/PP/gi, '<xxxx xxxxx="nu-c">C</xxxx>');
    rt_seq = rt_seq.replace(/A/gi, 'PP');
    rt_seq = rt_seq.replace(/PP/gi, '<xxxx xxxxx="nu-a">A</xxxx>');
    rt_seq = rt_seq.replace(/T/gi, 'PP');
    rt_seq = rt_seq.replace(/PP/gi, '<xxxx xxxxx="nu-t">T</xxxx>');
    
    rt_seq = rt_seq.replace(/G/gi, 'PP');
    rt_seq = rt_seq.replace(/PP/gi, '<xxxx xxxxx="nu-g">G</xxxx>');
    rt_seq = rt_seq.replace(/xxxxx/gi, 'class');
    rt_seq = rt_seq.replace(/xxxx/gi, 'span');
    
    $('textarea[name="rt_seq"]').next().html(rt_seq);

    //  $('textarea').autosize.resize();
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
    });


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