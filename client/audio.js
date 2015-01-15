

Template.audio.helpers({
    loadWaveform: function() {
        Meteor.defer(function() {
            var wavesurfer = Object.create(WaveSurfer);

            wavesurfer.init({
                container: document.querySelector('#audioWaveform'),
                waveColor: 'violet',
                progressColor: 'purple'
            });

            wavesurfer.on('ready', function() {
                //wavesurfer.play();
            });
            
            wavesurfer.on('seek', function(position) {
                wavesurfer.playPause();
            })
            

            var audioElem = document.getElementById('audioElement');
            wavesurfer.load(audioElem.src);
        });
    }
})