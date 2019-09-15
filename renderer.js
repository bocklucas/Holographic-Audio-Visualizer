const ParticleVisualizer = require('./components/Visuals/particle-visualizer');

var selectedVisualizer = 0;
var visualizers = [
    new ParticleVisualizer(document.getElementById("particle")),
];
var audioSource = [1];

function animateVisualizer(index) {
    for (let i = 0; i < visualizers.length; i++) {
        if (i == index) {
            visualizers[i].element.style.display = 'inline-block'
            visualizers[i].animate(audioSource);
            window.dispatchEvent(new Event('resize'));
        } else {
            visualizers[i].element.style.display = 'none'
            visualizers[i].stop();
        }
    }
}
for (let i = 0; i < visualizers.length; i++) {
    visualizers[i].initialize();
}

animateVisualizer(selectedVisualizer);
