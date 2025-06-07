// Clear console on page load

console.clear();

// Custom jQuery selector for text search

$.expr[":"].contains = $.expr.createPseudo(function (arg) {
    return function (elem) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

// Define button color on press

var buttonColorOnPress = "white";

// Document ready event handler

$(document).ready(function () {
    // Load playlist JSON data

    $.getJSON("../pages/musicpool-db/playlist.json", function (data) {
        // Initialize variables

        var abort_other_json; // JSON abort flag

        var playlist = data; // Playlist data

        var index = 0; // Current song index

        var indexing = playlist.songs[index]; // Current song object

        var time = 0; // Current time

        var totalTime = 0; // Total song duration

        var timeList = []; // Time stamps for lyrics

        var play = 0; // Play state (0: paused, 1: playing)

        var counter = 0; // Lyric counter

        var songRepeat = 0; // Song repeat flag

        var songShuffle = 0; // Song shuffle flag

        var mute = 0; // Mute flag

        var stopTimer; // Timer stop flag

        var previousTime; // Previous time

        var safeKill = 0; // Safety kill flag

        var audio = document.getElementById("audioFile"); // Audio element

        // Remove Prev and Next buttons if only one song in playlist

        if (data.songs.length === 1) {
            $("#prev, #next, #playlist-btn").hide();
        } else {
            $("#prev, #next").show();
        }

        // Centerize lyrics function

        function centerize() {
            if (play == 0) return;

            if ($(".current").length == 0) return;

            var a = $(".current").height();

            var c = $("#lyrics").height();

            var d = $(".current").offset().top - $(".current").parent().offset().top;

            var e = d + a / 2 - (c * 1) / 4;

            $("#lyrics").animate({ scrollTop: e + "px" }, { easing: "swing", duration: 100 });
        }

        // Next lyric function

        function next() {
            var current = $("#lyrics .current");

            if (current.length == 0) {
                $("#lyrics-content h2:nth-child(1)").addClass("current");
                return;
            }

            current.removeClass("current");

            current.next().addClass("current");
        }

        // Previous lyric function

        function previous() {
            var current = $("#lyrics .current");

            if (current.length == 0) {
                return;
            }

            var first = $("#lyrics-content h2:nth-child(1)");

            current.removeClass("current");

            if (current === first) {
                return;
            }

            current.prev().addClass("current");
        }

        // Set song name function

        function setSongName(songName) {
            var context = $("#songName");

            for (var i = 0; i < context.length; i++) {
                context[i].innerHTML = songName;
            }
        }

        // Set artist name function

        function setArtistName(artistName) {
            var context = $("#artistName");

            for (var i = 0; i < context.length; i++) {
                context[i].innerHTML = artistName;
            }
        }

        // Set album art function

        function setAlbumArt(albumart) {
            var context = $("#album-art");

            indexing = playlist.songs[index];

            context.attr("src", indexing.albumart);
        }

        // Process time function

        function processTime(a) {
            var b = parseInt(a / 60000);

            var c = parseInt((a % 60000) / 1000);

            if (c < 10) {
                c = "0" + c;
            }

            return b + ":" + c;
        }

        // Reset function

        function reset() {
            time = 0;

            audio.currentTime = 0;
        }

        // Play song function

        function playSong() {
          $('#popup-container-i').fadeIn();
            if (play == 0) {
                play = 1;
                audio.play();
                $("#menu button#play i").removeClass("fa-solid fa-circle-play fa-lg");
                $("#menu button#play i").addClass("fa-solid fa-circle-pause fa-lg");
            } else {
                play = 0;
                audio.pause();
                $("#menu button#play i").removeClass("fa-solid fa-circle-pause fa-lg");
                $("#menu button#play i").addClass("fa-solid fa-circle-play fa-lg");
            }
        }

        // Stop song function

        function stopSong() {
            if (abort_other_json) {
                abort_other_json.abort();
            }
            reset();
            timeList = [];
            previousTime = 0;
            counter = 0;

            clearInterval(stopTimer);

            loadSong();

            if (play == 1) {
                play = 0;
                audio.load();
                $("#menu button#play i").removeClass("fa-solid fa-circle-pause fa-lg");
                $("#menu button#play i").addClass("fa-solid fa-circle-play fa-lg");
            }
        }

        // Processing JSON data function

        function processing(data) {
            indexing = playlist.songs[index];

            data.indexing = indexing;

            data = { ...data, ...data.indexing };

            delete data.indexing;

            if (data.author == "") {
                data.author = "Unknown";
            }

            setSongName(data.song);

            setArtistName(data.author);

            setAlbumArt(data.albumart);

            var html = "";

            timeList = [];

            for (var i = 0; i < data.lyrics.length; i++) {
                timeList.push(data.lyrics[i].time);

                html = html + "<h2>" + data.lyrics[i].line + "</h2>";
            }

            $("#lyrics-content").html(html);

            $("#totalTime").html(processTime(totalTime));

            $("#currentTime").html(processTime(time));

            var percent = (time / totalTime) * 100;

            $("#progress").css("width", percent + "%");
        }


$("#progress-bar, #progressButton").on("mousedown touchstart", function (event) {
  event.preventDefault();
  var progressBarWidth = $("#progress-bar").width();
  var progressBarOffset = $("#progress-bar").offset().left;

  $(document).on("mousemove touchmove", function (event) {
    var clickPosition;

    // Calculate touch position
    if (event.type === "touchmove") {
      clickPosition = event.touches[0].clientX - progressBarOffset;
    } else {
      clickPosition = event.clientX - progressBarOffset;
    }

    var percent = (clickPosition / progressBarWidth) * 100;
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;

    $("#progress").css("width", percent + "%");
    time = parseInt(totalTime * (percent / 100));
    audio.currentTime = parseInt(time / 1000);
  });

  $(document).one("mouseup touchend", function () {
    $(document).off("mousemove touchmove");
  });
});

// Additional event listener for click/touch on progress bar
$("#progress-bar").on("click touchend", function (event) {
  var progressBarWidth = $("#progress-bar").width();
  var clickPosition;

  // Calculate touch position
  if (event.type === "touchend") {
    clickPosition = event.changedTouches[0].clientX - $(this).offset().left;
  } else {
    clickPosition = event.clientX - $(this).offset().left;
  }

  var percent = (clickPosition / progressBarWidth) * 100;
  
  if (percent < 0) percent = 0;
  if (percent > 100) percent = 100;
  
  $("#progress").css("width", percent + "%");
  time = parseInt(totalTime * (percent / 100));
  audio.currentTime = parseInt(time / 1000);
});
 









        function rewind5s() {
            if (time > 5000) time = time - 5000;
            else time = 0;

            audio.currentTime = parseInt(time / 1000);
        }

        function forward5s() {
            if (time + 5000 < totalTime) time = time + 5000;
            else time = totalTime;

            audio.currentTime = parseInt(time / 1000);
        }

        $(document).bind("keydown", function (event) {
            switch (event.keyCode) {
                case 37:
                    rewind5s();

                    break;

                case 39:
                    forward5s();

                    break;
            }
        });

        function toggleRepeat() {
            if (songRepeat == 0) {
                $("#repeat").css("color", buttonColorOnPress);
                songRepeat = 1;
            } else {
                $("#repeat").css("color", "grey");
                songRepeat = 0;
            }
        }
        function toggleShuffle() {
            if (songShuffle == 0) {
                $("#shuffle").css("color", buttonColorOnPress);
                songShuffle = 1;
            } else {
                $("#shuffle").css("color", "grey");
                songShuffle = 0;
            }
        }
        function toggleMute() {
            if (mute == 0) {
                mute = 1;
                audio.volume = 0;
            } else {
                mute = 0;
                audio.volume = 1;
            }
        }

        $(document).bind("keypress", function (event) {
            //console.log(event.keyCode);

            switch (event.keyCode) {
                case 32:
                    playSong();

                    break;

                case 109:
                    toggleMute();

                    break;

                case 114:
                    toggleRepeat();

                    break;

                case 115:
                    toggleShuffle();

                    break;
            }
        });

        function prevSong() {
            if (abort_other_json) {
                abort_other_json.abort();
            }
            reset();
            timeList = [];
            previousTime = 0;
            counter = 0;

            clearInterval(stopTimer);

            index = (index - 1) % playlist.songs.length;

            indexing = playlist.songs[index];

            console.log("audio", indexing);

            $("#audioFile").attr("src", indexing.audio);

            loadSong();
        }

        function nextSong() {
            if (abort_other_json) {
                abort_other_json.abort();
            }
            reset();
            timeList = [];
            previousTime = 0;
            counter = 0;

            clearInterval(stopTimer);

            index = (index + 1) % playlist.songs.length;

            indexing = playlist.songs[index];

            $("#audioFile").attr("src", indexing.audio);

            loadSong();
        }

        // Update timer function

        function updateTimer(data) {
            if (totalTime == 0 || isNaN(totalTime)) {
                totalTime = parseInt(audio.duration * 1000);
                processing(data);
            }

            //for the end of the song

            if (time >= totalTime) {
                if (play == 0) return;
                playSong();
                if (songRepeat == 1) {
                    reset();
                    playSong();
                    return;
                } else {
                    nextSong();
                    playSong();
                }
                return;
            }

            //update timer

            if (play == 1) {
                time = time + 1000;
            } else if (play == -1) {
                time = 0;
            }

            //upadate time on the progress bar

            if (audio.currentTime != previousTime) {
                previousTime = audio.currentTime;
                $("#currentTime").html(processTime(time));
                var percent = (time / totalTime) * 100;
                $("#progress").css("width", percent + "%");
            } else {
                time = parseInt(audio.currentTime * 1000);
                if (time > 100) time = time - 100;
                if (play == 1) {
                    audio.pause();
                    if (audio.readyState == 4) {
                        audio.play();
                    }
                }
            }

            safeKill = 0;

            while (true) {
                safeKill += 1;

                if (safeKill >= 100) break;

                if (counter == 0) {
                    if (time < timeList[counter]) {
                        previous();
                        break;
                    }
                }

                if (counter == timeList.length && time <= timeList[counter - 1]) {
                    counter--;
                    previous();
                }

                if (time >= timeList[counter]) {
                    if (counter <= timeList.length) {
                        counter++;
                    }
                    next();
                } else if (time < timeList[counter - 1]) {
                    counter--;
                    previous();
                } else {
                    if (play == 1 && !audio.paused && !audio.ended) centerize();
                    break;
                }
            }
        }

        // Load song function

        function loadSong() {
            // Hide Prev button if current song is first in playlist

            if (index === 0) {
                $("#prev").hide();
            } else {
                $("#prev").show();
            }

            // Hide Next button if current song is last in playlist

            if (index === playlist.songs.length - 1) {
                $("#next").hide();
            } else {
                $("#next").show();
            }

            $("#audioFile").attr("src", indexing.audio);

            abort_other_json = $.getJSON(indexing.json, function (data) {
                processing(data);

                totalTime = NaN;

                stopTimer = setInterval(function () {
                    updateTimer(data);
                }, 1000);
            });
        }

        loadSong();

        $("#prev").on("click", prevSong);

        $("#next").on("click", nextSong);

        $("#play").on("click", playSong);

        $("#stop").on("click", stopSong);

        $("#repeat").on("click", toggleRepeat);

        $("#shuffle").on("click", toggleShuffle);

        // Play song at index function

        function playSongAtIndex(data) {
            if (data == index) return;

            if (index >= playlist.songs.length) return;

            if (abort_other_json) {
                abort_other_json.abort();
                reset();
                clearInterval(stopTimer);
                timeList = [];
                previousTime = 0;
                counter = 0;
            }

            index = data;

            indexing = playlist.songs[index];

            $("#audioFile").attr("src", indexing.audio);

            loadSong();
        }

        // Add to playlist function

        function addToPlayList(data, index) {
            indexing = playlist.songs[index];

            var html = "";
            html = $("#show-list").html();
            html += '<div class="float-song-card" data-index="' + index + '"><img class="album-art" src="' + indexing.albumart + '"><h2 class="song">' + indexing.song + '</h2>';
            $("#show-list").html(html);
            $(".float-song-card").on("click", function () {
                playSongAtIndex($(this).attr("data-index"));
            });
        }

        // Set playlist function

        function setPlaylist() {
            for (var i = 0; i < playlist.songs.length; i++) {
                $.getJSON(
                    playlist.songs[i].json,
                    (function (i) {
                        return function (data) {
                            addToPlayList(data, i);
                        };
                    })(i)
                );
            }
        }

        // Initialize playlist

        setPlaylist();
    });

    // Search functionality

    $("#search").keyup(function () {
        var toSearch = $(this).val();

        $(".float-song-card").css("display", "none");

        $(".float-song-card:contains(" + toSearch + ")").css("display", "inline-block");
    });

    // Toggle playlist

    var togglePlaylist = 0;

    $("#playlist-btn").on("click", function () {
        if (togglePlaylist == 0) {
            $("#playlist").css("transform", "translateX(0)");

            togglePlaylist = 1;
        } else {
            $("#playlist").css("transform", "translateX(100%)");

            togglePlaylist = 0;
        }
    });

    // Leave pool button

    $("#leavePool").on("click", function () {
        window.location.href = "https://frithhilton.com.ng/pages/freshPlayer.html";
    });
});