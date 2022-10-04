$(function () {
    // get all users
    $('#get-button').on('click', function () {
        $('#namebody').html(``);

        $.get("allusers", function (data) {
            for (const idx in data) {
                $('#namebody').append(`<tr></tr><td>${data[idx].id}</td><td>${data[idx].displayName}</td><td>${data[idx].realName}</td></tr>`);
            }

        });
    });

    // get all tweets
    $('#get-tweets-button').on('click', function () {
        // clear previous tweets
        $('#tweetbody').html(``);

        $.get("tweets", function (data) {
            for (const idx in data) {
                $('#tweetbody').append(`<tr></tr><td>${data[idx].id}</td><td>${data[idx].text}</td><td>${data[idx].created_at}</td></tr>`);
            }
        });

    });

    // Get recently searched tweets
    $('#get-searched-tweets').on('click', function () {
        $('#searchbody').html(``);

        $.get("search_history", function (data) {
            if(data === undefined || data.length === 0) return;

            for (const idx in data) {
                $('#searchbody').append(`<tr><td>${data[idx].id}</td><td>${data[idx].text}</td><td>${data[idx].created_at}</td></tr>`);
            }

        });

    });

    // Search for tweet
    $('#search-form').on('submit', function (event) {
        event.preventDefault();
        let tweetID = $('#search-input').val();

        $.get(`/tweetinfo?id=${tweetID}`, function (data) {
            $('#searchbody').html(`<tr></tr><td>${data.id}</td><td>${data.text}</td><td>${data.created_at}</td></tr>`);
        });

    });

    // Create tweet
    $('#create-form').on('submit', function (event) {
        event.preventDefault();
        var createInput = $('#create-input');

        let input = createInput.val().split(";");

        let twtID = input[0];
        let twtText = input[1];

        if(twtID === undefined || twtText === undefined) return;

        $.ajax({
            url: '/create_tweet',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ id: twtID, created_at: new Date(), text: twtText }),
            dataType: 'json'
        });

    });

    // Update username
    $("#update-user").on('submit', function (event) {
        event.preventDefault();
        var updateInput = $('#update-input');
        var inputString = updateInput.val();

        const parsedStrings = inputString.split(';');

        if(parsedStrings.length < 2) return;

        $.ajax({
            url: '/updateuser',
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ name: parsedStrings[0], newDisplayName: parsedStrings[1] }),
            dataType: 'json'
        });

    });

    // Delete tweet
    $("#delete-form").on('submit', function () {
        let twtID = $('#delete-input');
        event.preventDefault();

        $.ajax({
            url: '/del_tweet',
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ id: twtID.val() }),
            dataType: 'json'
        });

    });


});


                    
   