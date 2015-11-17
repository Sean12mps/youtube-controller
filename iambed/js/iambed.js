// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
time_update_interval = 0;

function onYouTubeIframeAPIReady() {
	player = new YT.Player( 'imbd-player', {
		height: '675',
		width: '1200',
		videoId: '3zaGt-X3quI',
		events: ({
			'onReady': initialize,
		}),
		playerVars: {
			controls: 0,
			autoplay: 0,
			disablekb: 1,
			enablejsapi: 1,
			iv_load_policy: 3,
			showinfo: 0,
			modestbranding: 1,
			rel: 0,
		}
	});
}

function initialize(){

	// Update the controls on load
	updateTimerDisplay();
	updateProgressBar();

	// Clear any old interval.
	clearInterval(time_update_interval);

	// Start interval to update elapsed time display and
	// the elapsed part of the progress bar every second.
	time_update_interval = setInterval(function () {
		updateTimerDisplay();
		updateProgressBar();
	}, 1000)

}

// This function is called by initialize()
function updateProgressBar(){
	// Update the value of our progress bar accordingly.
	$( '.imbd-progress-bar' ).val( ( player.getCurrentTime() / player.getDuration() ) * 100 );
}



// This function is called by initialize()
function updateTimerDisplay(){
	// Update current time text display.
	$( '.imbd-current-time' ).text( formatTime( player.getCurrentTime() ) );
	$( '.imbd-duration' ).text( formatTime( player.getDuration() ) );
}

function formatTime( time ){
	time = Math.round( time );

	var minutes = Math.floor(time / 60),
	seconds = time - minutes * 60;

	seconds = seconds < 10 ? '0' + seconds : seconds;

	return minutes + ":" + seconds;
}


$( '.imbd-progress-bar' ).on( 'mouseup touchend', function (e) {

	// Calculate the new time for the video.
	// new time in seconds = total duration in seconds * ( value of range input / 100 )
	var newTime = player.getDuration() * ( e.target.value / 100 );

	// Skip video to new time.
	player.seekTo( newTime );

});

// output player controller
var imbController = '<div class="imbd-controller">' +
					'	<a href="#" class="imbd-play font-icon-play"></a>' +
					'	<a href="#" class="imbd-pause font-icon-pause"></a>' +
					'	<div class="imbd-vid-span"><span class="imbd-current-time">0:00</span> / <span class="imbd-duration">0:00</span></div>' +
					'	<input type="range" class="imbd-progress-bar" value="0">' +
					'</div>';

$( '.imbd-wrapper' ).append( imbController );


// control binding
$( '.imbd-play' ).on( 'click', function(e) {
	e.preventDefault();
	player.playVideo();
});


$( '.imbd-pause' ).on( 'click', function(e) {
	e.preventDefault();
	player.pauseVideo();
});

$( '.imbd-mute-toggle' ).on( 'click', function() {
    var mute_toggle = $( this );

    if ( player.isMuted() ){
        player.unMute();
        mute_toggle.text( 'volume_up' );
    }
    else {
        player.mute();
        mute_toggle.text( 'volume_off' );
    }
});

$( '.volume-input' ).on( 'change', function () {
    player.setVolume( $( this ).val() );
});
