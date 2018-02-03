$('document').ready(function(){

    // bulding html string for song cart
    function buidSongHtml(data) {
        var html = "";
        for (var i in data) {
            row = data[i];
            html += "<div class='col s6'>";
            html += "<div class='card-panel pointer'>";
            html += "<span>";
            html += "<input type='hidden' name='song_id' value='" + row.song_id + "'>";
            html += "Title: " + row.title + " <br/>";
            html += "Artist: " + row.artist + " <br/>";
            html += "Difficulty: " + row.difficulty + " <br/>";
            html += "Level: " + row.level + " <br/>";
            html += "Released: " + row.released;
            html += "</span>";
            html += "</div>";
            html += "</div>";
        }

        return html;
    }
    // building song modal to display rating info
    function bindRatingModal() {
         // make a card panel clickable for rating info
        $('.card-panel').unbind('click').bind('click', function(){
            var song_id = $(this).find('input[name="song_id"]').val();

            $('.rating-stars i.material-icons').addClass('grey-text');

            $.get("http://127.0.0.1:5000/songs/avg/rating/" + song_id, function(data){
                var result = data.result;
                var r_html = "";

                r_html += '<div class="row">';
                r_html += '<div class="col s4">Average: '+ result.avg +'</div>';
                r_html += '<div class="col s4">Minimum: '+ result.min +'</div>';
                r_html += '<div class="col s4">Maximum: '+ result.max +'</div>';
                r_html += '</div>';
                r_html += '<div class="row">';
                r_html += '<div class="col s4">';

                for (var i = 1; i <= result.avg; i++){
                    r_html += '<i class="material-icons">star_rate</i>';
                }

                r_html += '</div>';
                r_html += '<div class="col s4">';

                for (var i = 1; i <= result.min; i++){
                    r_html += '<i class="material-icons">star_rate</i>';
                }

                r_html += '</div>';
                r_html += '<div class="col s4">';
                
                for (var i = 1; i <= result.max; i++){
                    r_html += '<i class="material-icons">star_rate</i>';
                }
                
                r_html += '</div>';
                r_html += '</div>';

                $('.rating-row').html(r_html);

                // Star animation
                $('.rating-stars i.material-icons').unbind('click').bind('click', function(){
                    var rating = $(this).attr('data-index');

                    $('.rating-stars i.material-icons').removeClass('active');
                    $('.rating-stars i.material-icons').addClass('grey-text');
                    $(this).addClass('active');

                    for (var i = 1; i <= rating; i++){
                        $('.rating-stars i.material-icons[data-index="' + i + '"]')
                            .removeClass('grey-text');

                    }
                });

                // Submit new rating by clicking on Submit button 
                $('#rate_it_button').unbind('click').bind('click', function(){
                    var rating = $('.rating-stars i.material-icons.active').attr('data-index');
                    if (rating > 0 && rating < 6) {
                        var postData = {
                            'song_id': song_id,
                            'rating': rating
                        };
                        $.post("http://127.0.0.1:5000/songs/rating", postData, function(data){
                            $('#modal1').modal('close');
                        });
                    }
                });

                $('#modal1').modal('open');
            });

        });
    }

    // build and bind pagination 
    function bindPagination(pages, c_page, limit) {
        var p_html = "";

        $('.pagination-col').html("");

        // pagination html
        p_html += '<ul class="pagination">';
        for(var i = 1; i <= pages; i++) {
            if (c_page == i) {
                p_html += '<li class="active"><a href="#!">' + i + '</a></li>';
            } else {
                p_html += '<li class="waves-effect"><a href="#!">' + i + '</a></li>';
            }

        }
        p_html += '</ul>';

        $('.pagination-col').html(p_html);

        // bind pagination
        $('.pagination a').bind('click', function(){
            var offset = ($(this).text() - 1) * limit;
            getSongs(offset);
        });
    }

    // make song request
    function getSongs(offset) {
        // Limit to 4 items per page
        var limit = 4;
        $.get("http://127.0.0.1:5000/songs?offset=" + offset + "&limit=" + limit, function(data){

            var count = data.count;
            var pages = Math.ceil(count / limit);
            // current page
            var c_page = (data.offset / limit) < 1 ? 1 : parseInt(data.offset / limit) + 1;

            $('.all-songs').html("");
            var html = buidSongHtml(data.result)
            $('.all-songs').html(html);

            bindRatingModal();
            bindPagination(pages, c_page, limit);
            


        });
    }

    // Get request on search button click
    $('.btn.search-song').unbind('click').bind('click', function(){
        var message = $('[name="search"]').val();

        $.get("http://127.0.0.1:5000/songs/search?message=" + message, 
            function(data){
            $('.song-list').html("");

            var html = buidSongHtml(data.result)
            $('.song-list').html(html);

           bindRatingModal();

        })
    });

    // Select songs by level
    $('.btn.song-level').unbind('click').bind('click', function(){
        var level = $('[name="level"]').val();

        $.get("http://127.0.0.1:5000/songs/avg/difficulty?level=" + level, 
            function(data){
            $('.song-list').html("");

            var html = buidSongHtml(data.result)
            $('.song-list').html(html);

           bindRatingModal();

        })
    });

    // show all songs
    $('.btn.show-songs').unbind('click').bind('click', function(){
        getSongs(0);
    });

    //initialize modal box
    $('.modal').modal();

}) 