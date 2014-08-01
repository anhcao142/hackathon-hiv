//Load badge ajax
var lastBadge = '';

$('.js-badge').click(function(event) {
    var badgeSlug = $(this).attr('data-badge-slug');

    //Optimise, prevent load a same badge multiple time
    if (lastBadge != badgeSlug) {
        lastBadge = badgeSlug;

        $.get('/badge/' + badgeSlug, function (badge) {
            var $modal = $('.js-badge-modal');
            $modal.find('.js-badge-thumbnail').attr('src', badge.imageUrl);
            $modal.find('.js-badge-viewcount').html(badge.viewCount);
            $modal.find('.js-badge-applycount').html(badge.applyCount);
            $modal.find('.js-badge-earnercount').html(badge.earnerCount);
            $modal.find('.js-badge-detail').attr('href', '/badge/' + badge.slug);
            $modal.find('.js-badge-description').html(badge.description);
            var issuer = badge.issuer;
            if (!issuer) {
                issuer = {
                    name: "TOXBadge",
                    url: "app.toxbadge.com"
                }
            };
            $modal.find('.js-badge-issuer').attr('href', issuer.url).html(issuer.name);
            $modal.find('.js-badge-created').html(badge.createdView);
            $modal.find('.js-earner-description').html(badge.earnerDescription);

            //Reset criteria
            $modal.find('.js-badge-criteria').html('');
            for (var i = 0; i < badge.criteria.length; i++) {
                var template = '<li><p>' + criteria[i].description + '<small>' + criteria[i].note + '</small></p></li>'
                $modal.find('.js-badge-criteria').append(template);
            };

            if (badge.timeValue == 0) {
                $modal.find('.js-badge-completeTime').html('Không xác định');
            } else {
                $modal.find('.js-badge-completeTime').html('Khoảng ' + badge.timeValue + ' ' + badge.timeUnit + ' để hoàn thành');
            }
        });
    };
});

//Filter issuer
var issuers;
var newSearchTerm;
var prevSearchTerm;
$('.js-filter-issuer').click(function () {
    if (!issuers) {
        $.get('/explorer/issuers', function (data) {
            issuers = data;
            populateData(issuers);
        });
    };
});

$('.js-filter-search-issuer').on('input paste', function() {
    newSearchTerm = $(this).val();
    setTimeout("searchIssuer('" + newSearchTerm + "')", 1300);
});

function searchIssuer(searchTerm) {
    if (searchTerm == newSearchTerm) {
        if (searchTerm != prevSearchTerm) {

            $.get('/explorer/issuers?search=' + searchTerm, function (data) {
                populateData(data);
            });

            prevSearchTerm = searchTerm;
        };
    };
}
var count = 0;

function populateData(issuers) {
    var $issuers = $('.js-issuers');
    var $issuer = $('.js-issuer.hide');

    $issuers.html('');

    for (var i = 0; i < issuers.length; ++i) {
        var issuer = $issuer.clone();
        issuer.removeClass('hide');
        issuer.attr('count', count++);
        issuer.attr('href', '/explorer?issuer=' + issuers[i].slug).html(issuers[i].name);
        $issuers.append(issuer);
    };

    $issuers.append($issuer);
}
