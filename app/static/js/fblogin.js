var res;

// This function is called when someone finishes with the Login
// Button.	See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
    var loginUrl = '/login-facebook';

    if (res.status === 'connected') {
        var data = {
            userID: res.authResponse.userID,
            accessToken: res.authResponse.accessToken,
            expiresIn: res.authResponse.expiresIn
        }

        $.get(loginUrl, data, function (redirectTo) {
            window.location = redirectTo;
        });
    } else {
        FB.login(function (response) {
            if (response.status == 'connected') {
                var data = {
                    userID: response.authResponse.userID,
                    accessToken: response.authResponse.accessToken,
                    expiresIn: response.authResponse.expiresIn
                };

                $.get(loginUrl, data, function (redirectTo) {
                    window.location = redirectTo;
                });
            }

            FB.getLoginStatus(function (response) {
                res = response;
            });
        }, {scope: 'public_profile, email'});
    }
}

window.fbAsyncInit = function () {
    FB.init({
        appId: appId,
        xfbml: true,
        version: 'v2.0'
    });

    FB.getLoginStatus(function (response) {
        res = response;
    });
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));