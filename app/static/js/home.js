$(document).ready(function () {

    $("#push-bp").click(function () {
        OpenBadges.issue(["http://cedar-badgekitapi.herokuapp.com/public/assertions/c107acba00e8721c4f260c54c6091712a5c6bb12"], function (errors, successes) {
            if (errors) {
                console.info("issue failed");
                console.error(errors);
            }

            if (sucesses) {
                console.info("issue successful");
                console.info(sucesses);
            }
        });
    });
});
