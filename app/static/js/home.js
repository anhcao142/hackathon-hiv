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
    $('.active').removeClass('active');
    $(ele).addClass('active');
    $('.result-hiv').addClass('hide');

    var pr_seq = $(ele).find('.pr_seq').html();
    var rt_seq = $(ele).find('.rt_seq').html();
    var vl_t0 = $(ele).find('.vl_t0').html();
    var cd4_t0 = $(ele).find('.cd4_t0').html();

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

    $('textarea[name="vl_t0"]').val(vl_t0);
    $('textarea[name="cd4_t0"]').val(cd4_t0);

    //  $('textarea').autosize.resize();
}

function drawChart() {
    var data = google.visualization.arrayToDataTable(drawData);

    var options = {
        
        height: 500,
        width: 800,
        title: 'Viral load by months',
        hAxis: {title: 'Viral load', minValue: 0, maxValue: 1},
        vAxis: {title: 'Months', minValue: 0, maxValue: 1},
        trendlines: {
            0: {
                type: 'exponential',
                visibleInLegend: true,
                color: 'purple',
                lineWidth: 10,
                opacity: 0.2
            }
        }
    };

    var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

    chart.draw(data, options);
}

$('#predict-infection').submit(function (e) {
    $('.result-hiv').removeClass('hide');
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
        if (data && data.resp) {
            $('#res-stt').html('YES');
            //$('#res-stt').addclass('YES');
        } else if (!data) {
            $('#res-stt').html('wrong data');
        } else {
            $('#res-stt').html('NO');
        }
        console.log(data.vl_t0);
        if (data) {
            if (data.resp) {
                drawData = [['Month', 'Viral load'], 
                    [0, data.vl_t0],
                    [1, data.vl_t0*0.68],
                    [2, data.vl_t0*Math.pow(0.68,2)],
                    [3, data.vl_t0*Math.pow(0.68,3)],
                    [4, data.vl_t0*Math.pow(0.68,4)],
                    [5, data.vl_t0*Math.pow(0.68,5)],
                    [6, data.vl_t0*Math.pow(0.68, 6)],
                    [7, data.vl_t0*Math.pow(0.68, 7)],
                    [8, data.vl_t0*Math.pow(0.68, 8)],
                    [9, data.vl_t0*Math.pow(0.68, 9)],
                    [10, data.vl_t0*Math.pow(0.68, 10)],
                    [11, data.vl_t0*Math.pow(0.68, 11)],
                    [12, data.vl_t0/100]];
                drawChart();
            } else {
                drawData = [['Month', 'Viral load'], 
                    [0, data.vl_t0],
                    [1, data.vl_t0/0.68],
                    [2, data.vl_t0/Math.pow(0.68,2)],
                    [3, data.vl_t0/Math.pow(0.68,3)],
                    [4, data.vl_t0/Math.pow(0.68,4)],
                    [5, data.vl_t0/Math.pow(0.68,5)],
                    [6, data.vl_t0/Math.pow(0.68, 6)],
                    [7, data.vl_t0/Math.pow(0.68, 7)],
                    [8, data.vl_t0/Math.pow(0.68, 8)],
                    [9, data.vl_t0/Math.pow(0.68, 9)],
                    [10, data.vl_t0/Math.pow(0.68, 10)],
                    [11, data.vl_t0/Math.pow(0.68, 11)],
                    [12, data.vl_t0*90]];
                drawChart();
            }
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
