$('#widget-top-users').append('<p>Top thành viên mới</p>');
$('#widget-top-users').append('<ul class="list-inline"></ul>');
var $ul = $('#widget-top-users ul');


$.get('/users', function (users) {
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        var name = user.name ? user.name : user.username;
        var imageUrl = user.imageUrl ? user.imageUrl : '/images/defaultUser';
        $ul.append('<li>'
                 + '<div class="js-dummy"></div>'
                 + '<a href="/profile/' + user.username + '" class="thumbnail" title="' + name + '">'
                 + '<img src="' + imageUrl + '" alt="' + name + '">'
                 + '</a></li>');
    };

    //css for widget
    var $li = $ul.children('li');
    $li.css({
        width: '20%',
        position: 'relative',
        padding: 0,
    });

    $li.children('.js-dummy').css({
        marginTop: '100%'
    });

    $li.children('a').css({
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        margin: '3px'
    });
});
