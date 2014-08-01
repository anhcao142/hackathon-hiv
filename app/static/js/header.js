$(document).ready(function () {
    //Process search-action
    $(".fa-search").click(function () {
        $(".search-input").focus();
    });

    $("#search-icon").click(function () {
        $("#search-control-fluid").removeClass('hide');
        $("#search-control-fluid .search-input").focus();

    });


    $("#search-cancel").click(function () {
        $("#search-control-fluid").addClass('hide');

    });
});