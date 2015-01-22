AudioInterface = {
    
    updateAudioTag: function(newSrc) {
        var audioElem = document.getElementById('audioElement');
        audioElem.src = newSrc;
    },
    
    loadWaveform: function() {
        var container = document.getElementById('audioWaveform');
        
        if (container.innerHTML == '') {
            console.log('load waveform called')
        
            var wavesurfer = Object.create(WaveSurfer);

            wavesurfer.init({
                container: container,
                waveColor: 'violet',
                progressColor: 'purple',
                scrollParent: true
            });

            wavesurfer.on('ready', function() {
                //wavesurfer.play();
            });
            
            wavesurfer.on('seek', function(position) {
                wavesurfer.playPause();
            })
            

            var audioElem = document.getElementById('audioElement');
            
            wavesurfer.load(audioElem.src);
            
        }
    }
}

Template.audio.events({
    "submit #addAudioForm": function(event) {
        var input = document.getElementById('audioFileInput');
        var fileList = input.files;
        console.log('adding file, i hope')
        if (fileList.length > 0) {
            console.log('there was a file')
            Audio.insert(fileList[0], function(error, file) {
                console.log('insert callback')
                input.value = '';
                if (!error) {
                    console.log('no error, proceed to server')
                    Meteor.call('attachAudio', Session.get('current-text-id'), file, function() {
                      
                      
                    })
                    
                } else {
                    console.log(error)
                }
            });
        }
        return false;
    }
})

Template.audio.helpers({
    deferWaveform: function() {
        Meteor.defer(AudioInterface.loadWaveform);
    },
    
    audioUrl: function() {
        var entryId = Session.get('current-text-id');
        var entry = Texts.find({_id: entryId}).fetch()[0];
        var audioId = entry.audio;
        
        if (audioId) {
            var audio = Audio.find({_id: audioId}).fetch();
            if (audio.length > 0) {
                return audio[0].url();
            }
        }
        
        return 'fail.mp3';
    },
    
    audioFile: function() {
        var entryId = Session.get('current-text-id');
        var entry = Texts.findOne({_id: entryId});
        return Audio.findOne({_id: entry.audio});
    }
})