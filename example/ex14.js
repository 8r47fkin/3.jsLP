import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'

function init() {

	var scene = new THREE.Scene()
	var gui = new GUI()
	var clock = new THREE.Clock()

	var enableFog = false

	if (enableFog) {
		scene.fog = new THREE.FogExp2(0xffffff, 0.2)
	}

	var plane = getPlane(25)
	var directionalLight = getDirectionalLight(1)
	var sphere = getSphere(0.05)
	var boxGrid = getBoxGrid(10, 1.5)
	boxGrid.name = 'boxGrid'

	plane.name = 'plane-1'

	plane.rotation.x = Math.PI/2
	directionalLight.position.y = 2
	directionalLight.intensity = 4

	gui.add(directionalLight, 'intensity', 0, 20)
	gui.add(directionalLight.position, 'x', -10, 10)
	gui.add(directionalLight.position, 'y', 0, 10)
	gui.add(directionalLight.position, 'z', -10, 10)

	scene.add(plane)
	directionalLight.add(sphere)
	scene.add(directionalLight)
	scene.add(boxGrid)


	// var camera = new THREE.PerspectiveCamera(
	// 	45,
	// 	window.innerWidth/window.innerHeight,
	// 	1,
	// 	1000
	// )

	var camera = new THREE.OrthographicCamera(
		-15,
		15,
		15,
		-15,
		1,
		1000
	)

	camera.position.set(15, 15, 15);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	
	
	var renderer = new THREE.WebGLRenderer()
	renderer.shadowMap.enabled = true
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.setClearColor('rgb(120, 120, 120)')
	document.getElementById('webgl').appendChild(renderer.domElement)

	var controls = new OrbitControls(camera, renderer.domElement)

	update(renderer, scene, camera, controls, clock)

	return scene

}

function getBox(w, h, d) {
	var geometry = new THREE.BoxGeometry(w, h, d)
	var material = new THREE.MeshPhongMaterial({
		color: 'rgb(120, 120, 120)'
	})
	var mesh = new THREE.Mesh(
		geometry,
		material
	)
	mesh.castShadow = true

	return mesh
}


function getBoxGrid(amount, separationMultiplier) {
    var group = new THREE.Group();

    for (var i = 0; i < amount; i++) {
        for (var j = 0; j < amount; j++) {
            var obj = getBox(1, 1, 1);
            obj.position.x = i * separationMultiplier;
            obj.position.y = obj.geometry.parameters.height / 2; 
            obj.position.z = j * separationMultiplier;
            group.add(obj);
        }
    }

    group.position.x = -(separationMultiplier * (amount - 1)) / 2;
    group.position.z = -(separationMultiplier * (amount - 1)) / 2;
    group.position.y = 0; 

    return group;
}



function getPlane(size) {
	var geometry = new THREE.PlaneGeometry(size, size)
	var material = new THREE.MeshPhongMaterial({
		color: 'rgb(120, 120, 120)',
		side: THREE.DoubleSide
	})
	var mesh = new THREE.Mesh(
		geometry,
		material
	)
	mesh.receiveShadow = true

	return mesh
}

function getSphere(size) {
	var geometry = new THREE.SphereGeometry(size, 24, 24)
	var material = new THREE.MeshBasicMaterial({
		color: 'rgb(255, 255, 255)'
	})
	var mesh = new THREE.Mesh(
		geometry,
		material
	)

	return mesh
}

function getPointLight(intensity) {
	var light = new THREE.PointLight(0xffffff, intensity)
	light.castShadow = true

	return light
}

function getSpotLight(intensity) {
	var light = new THREE.SpotLight(0xffffff, intensity)
	light.castShadow = true

	light.shadow.bias = 0.001
	light.shadow.mapSize.width = 2048
	light.shadow.mapSize.height = 2048

	return light
}

function getDirectionalLight(intensity) {
	var light = new THREE.DirectionalLight(0xffffff, intensity)
	light.castShadow = true

	light.shadow.camera.left = -10
	light.shadow.camera.bottom = -10
	light.shadow.camera.right = 10
	light.shadow.camera.top = 10

	return light
}

function getAmbientLight(intensity) {
	var light = new THREE.AmbientLight('rgb(10, 30, 50)', intensity)

	return light
}

function update(renderer, scene, camera, controls, clock) {
	renderer.render(
		scene,
		camera
	)

	var timeElapsed = clock.getElapsedTime()

	var boxGrid = scene.getObjectByName('boxGrid')
	boxGrid.children.forEach(function(child, index){
		child.scale.y = (Math.sin(timeElapsed * 5 + index) + 1) / 2 +0.001;
		child.position.y = child.scale.y/2
	})

	controls.update()




	requestAnimationFrame(function() {
		update(renderer, scene, camera, controls, clock)
	})
}

var scene = init()

console.log(scene);


