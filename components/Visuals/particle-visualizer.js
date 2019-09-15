var c = 0;
var dir = 1;

function AudioVisualizer(element) {
    this.scene;
    this.camera;
    this.renderer;
    this.animationId = 0;

    this.element = element;

    this.particles;
    this.particleMaterial;
    this.particleColors = new Array();

    this.thetaSpread = new Array()
    this.phiSpread = new Array()
}

AudioVisualizer.prototype.initialize = function() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(70, this.element.clientWidth / this.element.clientHeight, 1, 1000);
    this.camera.position.z = 100;
    this.camera.position.y = 0;

    var ambientLight = new THREE.AmbientLight(0x606060); // soft white light
    this.scene.add(ambientLight);

    var light = new THREE.PointLight(0xffffff);
    light.position.set(60, 40, 20);
    this.scene.add(light);

    var distance = 50;
    var geometry = new THREE.Geometry();

    for (i = 0; i < 1440; i += 1) {
        var vertex = new THREE.Vector3();

        this.thetaSpread[i] = i
        this.phiSpread[i] = i * 100

        var theta = this.thetaSpread[i];
        var phi = this.phiSpread[i];

        vertex.x = distance * Math.sin(theta) * Math.cos(phi);
        vertex.y = distance * Math.sin(theta) * Math.sin(phi);
        vertex.z = distance * Math.cos(theta);

        this.particleColors[i] = new THREE.Color(1.0, 0.0, 0.0);

        geometry.vertices.push(vertex);
    }

    geometry.colors = this.particleColors

    this.particleMaterial = new THREE.PointsMaterial({
        size: 2,
        map: new THREE.TextureLoader().load("https://threejs.org/examples/textures/sprites/disc.png"),
        vertexColors: THREE.VertexColors,

        transparent: true,
        depthTest: false
    })

    this.particles = new THREE.Points(geometry, this.particleMaterial);

    this.scene.add(this.particles);

    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setSize(this.element.clientWidth, this.element.clientHeight);

    this.element.appendChild(this.renderer.domElement);

    var self = this;

    window.addEventListener('resize', function() {
        self.camera.aspect = self.element.clientWidth / self.element.clientHeight;
        self.camera.updateProjectionMatrix();
        self.renderer.setSize(self.element.clientWidth, self.element.clientHeight);
    }, false);
};


AudioVisualizer.prototype.toggle = function() {}

AudioVisualizer.prototype.render = function() {

    array = [1, 1, 1];
    if (audioSource) {
        array = audioSource.slice(0, 96);
    }

    var time = Date.now() * 0.001;
    this.particles.rotation.x = time;
    this.particles.rotation.y = time;
    this.particles.rotation.z = time;

    var distance = 30
    var vertices = this.particles.geometry.vertices;
    var colors = this.particles.geometry.colors;
    for (var i = 0; i < vertices.length; i++) {

        var data = array[i % (array.length - 1)]
        var augmentationValue = i % (100 * (data)) + distance

        var theta = this.thetaSpread[i];
        var phi = this.phiSpread[i];

        vertices[i].x = augmentationValue * Math.sin(theta) * Math.cos(phi);
        vertices[i].y = augmentationValue * Math.sin(theta) * Math.sin(phi);
        vertices[i].z = augmentationValue * Math.cos(theta);
        colors[i].r = augmentationValue % 1 + 0.5;
        colors[i].g = 0;
        colors[i].b = 0;
    }

    this.particles.geometry.verticesNeedUpdate = true;
    this.particles.geometry.colorsNeedUpdate = true;
    this.renderer.render(this.scene, this.camera);
}

AudioVisualizer.prototype.animate = function(audioSource) {
    this.render(audioSource);

    var that = this;

    this.animationId = requestAnimationFrame(function() {
        that.animate(audioSource);
    });
}

AudioVisualizer.prototype.stop = function() {
    cancelAnimationFrame(this.animationId);
}

module.exports = AudioVisualizer;