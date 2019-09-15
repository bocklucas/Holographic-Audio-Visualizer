var getUserMedia = require('get-user-media-promise');
var MicrophoneStream = require('microphone-stream');
var SpeakTTS = require('speak-tts');
const { Wit } = require('node-wit');

var micStream = new MicrophoneStream();
const client = new Wit({
    accessToken: 'Q6L3QLRZT3NWQTDVU36K47S7VKGODNWK'
});

initMic();
initSpeech();

function initMic() {
    getUserMedia({ video: false, audio: true })
        .then(function(stream) {
            micStream.setStream(stream);
        }).catch(function(error) {
            console.log(error);
        });
        micStream.on('data', function(chunk) {
            if (chunk) {
                audioSource = MicrophoneStream.toRaw(chunk).slice(0, 48);
            }
        });
}

function initSpeech() {
    var speech = new SpeakTTS.default()
    speech.init({
        'volume': 0.1,
         'lang': 'en-GB',
         'rate': 1,
         'pitch': 1,
         'voice': 'Daniel',
         'splitSentences': true,
         'listeners': {
             'onvoiceschanged': (voices) => {
                //  console.log("Event voiceschanged", voices)
             }
         }
        })
        speech.speak({
            text: 'Good morning sir, how may I assist you?',
        }).then(() => {
            console.log("Success !")
        }).catch(e => {
            console.error("An error occurred :", e)
        })
}

function communicateWithWit (message) {
    var response = 'An error occured';
     client.message(message, {})
            .then((data) => {
                console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
                response = JSON.stringify(data);
            })
            .catch(console.error);
    return response;
}