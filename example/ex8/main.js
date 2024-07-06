import * as THREE from 'three'
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'

function init() {

	var scene = new THREE.Scene()
	var gui = new GUI()

	var enableFog = false

	if (enableFog) {
		scene.fog = new THREE.FogExp2(0xffffff, 0.2)
	}

	

	var box = getBox(1, 1, 1)
	var plane = getPlane(20)
	var pointLight = getPointLight(1)
	var sphere = getSphere(0.05)

	plane.name = 'plane-1'

	box.position.y = box.geometry.parameters.height/2
	plane.rotation.x = Math.PI/2
	pointLight.position.y = 1.5
	pointLight.intensity = 2

	gui.add(pointLight, 'intensity', 0, 10)
	gui.add(pointLight.position, 'x', 0, 5)
	gui.add(pointLight.position, 'y', 0, 5)
	gui.add(pointLight.position, 'z', 0, 5)

	scene.add(box)
	scene.add(plane)
	pointLight.add(sphere)
	scene.add(pointLight)


	var camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth/window.innerHeight,
		1,
		1000
	)

	camera.position.x = 1
	camera.position.y = 1
	camera.position.z = 5

	camera.lookAt(new THREE.Vector3(0, 0, 0))
	
	var renderer = new THREE.WebGLRenderer()
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.setClearColor('rgb(120, 120, 120)')
	document.getElementById('webgl').appendChild(renderer.domElement)
	update(renderer, scene, camera)

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

	return mesh
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

	return light
}

function update(renderer, scene, camera) {
	renderer.render(
		scene,
		camera
	)

	requestAnimationFrame(function() {
		update(renderer, scene, camera)
	})
}

var scene = init()

console.log(scene);