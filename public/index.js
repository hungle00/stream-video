document.addEventListener('DOMContentLoaded', init, false);

function init() {
  	const VP = document.getElementById('videoPlayer')
  	const VPToggle = document.getElementById('toggleButton')

  	VPToggle.addEventListener('click', function() {
  		if (VP.paused) VP.play()
  	   else VP.pause()
  	})
}