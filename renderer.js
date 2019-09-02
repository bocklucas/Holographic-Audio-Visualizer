const audio = require('./audio-source')
const electron = require('electron');
const ParticleVisualizer = require('./particle-visualizer.js');
var getUserMedia = require('get-user-media-promise');
var MicrophoneStream = require('microphone-stream');
const { Wit } = require('node-wit');

const client = new Wit({
    accessToken: 'Q6L3QLRZT3NWQTDVU36K47S7VKGODNWK'
});

var selectedVisualizer = 0;
var visualizers = [
    new ParticleVisualizer(document.getElementById("particle")),
];

var loader = new audio.AudioLoader();
var micStream = new MicrophoneStream();
var audioSource = [1, 1, 1, 1];

electron.ipcRenderer.on('control', (event, message) => {
    switch (message) {
        case 'NEXT':
            audioSource.next();
            break;
        case 'PREVIOUS':
            audioSource.previous();
            break;
        case 'TOGGLE_VISUALIZER_SETTING':
            visualizers[selectedVisualizer].toggle();
            break;
        case 'CHANGE_VISUALIZER':
            selectedVisualizer = (selectedVisualizer + 1) % visualizers.length
            animateVisualizer(selectedVisualizer);
            break;
        case 'TOGGLE_PLAY':
            audioSource.toggle();
        default:
            console.log('Unrecognized command: ' + message);
            break;
    }
})

electron.ipcRenderer.on('volume', (event, message) => {
    const volume = Number(message);
    if (volume) {
        audioSource.setVolume(volume)
    }
})

function animateVisualizer(index) {
    for (let i = 0; i < visualizers.length; i++) {
        if (i == index) {
            visualizers[i].element.style.display = 'inline-block'
            visualizers[i].animate(micStream);
            window.dispatchEvent(new Event('resize'));
        } else {
            visualizers[i].element.style.display = 'none'
            visualizers[i].stop();
        }
    }
}

loader.loadStream(function() {
    getUserMedia({ video: false, audio: true })
        .then(function(stream) {
            micStream.setStream(stream);
        }).catch(function(error) {
            console.log(error);
        });
    client.message('Turn on the printer please', {})
        .then((data) => {
            // console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
        })
        .catch(console.error);

    for (let i = 0; i < visualizers.length; i++) {
        visualizers[i].initialize();
    }

    micStream.on('data', function(chunk) {
        if (chunk) {
            audioSource = MicrophoneStream.toRaw(chunk).slice(0, 48);
        }
    });

    animateVisualizer(selectedVisualizer);
})