//particle-visualizer.js
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function AudioVisualizer(element) {
    //Rendering
    this.scene;
    this.camera;
    this.renderer;
    this.animationId = 0;

    this.element = element;

    //particles
    this.particles;
    this.particleMaterial;
    this.particleColors = new Array();

    this.thetaSpread = new Array()
    this.phiSpread = new Array()
}

AudioVisualizer.prototype.initialize = function () {
	this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 70, this.element.clientWidth / this.element.clientHeight, 1, 1000);
    this.camera.position.z = 225;
    this.camera.position.y = 40;

    var ambientLight = new THREE.AmbientLight( 0x606060 ); // soft white light
	this.scene.add( ambientLight );

    var light = new THREE.PointLight( 0xffffff );
    light.position.set( 60, 40, 20 );
    this.scene.add(light);

	var distance = 50;
	var geometry = new THREE.Geometry();

	for (i = 0; i < 1440; i += 1) {
	  var vertex = new THREE.Vector3();

	  this.thetaSpread[i] = i
	  this.phiSpread[i] = i*100

	  var theta = this.thetaSpread[i];
	  var phi = this.phiSpread[i];

	  vertex.x = distance * Math.sin(theta) * Math.cos(phi);
	  vertex.y = distance * Math.sin(theta) * Math.sin(phi);
	  vertex.z = distance * Math.cos(theta);

      this.particleColors[i] = new THREE.Color(0.2,0.2, 0.9);

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
    
    this.renderer.setSize( this.element.clientWidth, this.element.clientHeight );

    this.element.appendChild(this.renderer.domElement);

    var self = this;

    window.addEventListener( 'resize', function() {
    	self.camera.aspect = self.element.clientWidth / self.element.clientHeight;
        self.camera.updateProjectionMatrix();
        self.renderer.setSize( self.element.clientWidth, self.element.clientHeight );
    }, false );
};


AudioVisualizer.prototype.toggle = function() {
}

AudioVisualizer.prototype.render = function() {

	array = [1,1,1];
	if(audioSource) {
		array = audioSource.slice(0, 96);
	}
		// update particles
		var time = Date.now() * 0.0005;
		this.particles.rotation.y = time;

		var distance = 80
		var vertices = this.particles.geometry.vertices;
		for ( var i = 0; i < vertices.length; i++ ) {

			var data = array[i % (array.length-1)]
			var augmentationValue = i%(10*(data)) + distance

			var theta = this.thetaSpread[i];
			var phi = this.phiSpread[i];

			vertices[i].x = augmentationValue * Math.sin(theta) * Math.cos(phi);
			vertices[i].y = augmentationValue * Math.sin(theta) * Math.sin(phi);
			vertices[i].z = augmentationValue * Math.cos(theta);
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