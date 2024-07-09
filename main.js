import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'

function init() {

	var scene = new THREE.Scene()
	var gui = new GUI()

	//initialize objects
	var sphereMaterial = getMaterial('lambert', 'rgb(255, 255, 255)')
	var sphere = getSphere(sphereMaterial, 1, 24)

	var planeMaterial = getMaterial('lambert', 'rgb(255, 255, 255)')
	var plane = getPlane(planeMaterial, 30)

	var lightLeft = getSpotLight(1, 'rgb(255, 220, 180)')
	var lightRight = getSpotLight(1, 'rgb(255, 220, 180)')

	// manipulate objects
	sphere.position.y = sphere.geometry.parameters.radius
	plane.rotation.x = Math.PI/2

	lightLeft.position.x = -5
	lightLeft.position.y = 2
	lightLeft.position.z = -4

	lightRight.position.x = 5
	lightRight.position.y = 2
	lightRight.position.z = -4

	// manipulate materials

	// dat.gui
	var folder1 = gui.addFolder('light_1')
	folder1.add(lightLeft, 'intensity', 0, 10)
	folder1.add(lightLeft.position, 'x', -5, 15)
	folder1.add(lightLeft.position, 'y', -5, 15)
	folder1.add(lightLeft.position, 'z', -5, 15)

	var folder2 = gui.addFolder('light_2')
	folder2.add(lightRight, 'intensity', 0, 10)
	folder2.add(lightRight.position, 'x', -5, 15)
	folder2.add(lightRight.position, 'y', -5, 15)
	folder2.add(lightRight.position, 'z', -5, 15)

	// add objects to the scene
	scene.add(sphere)
	scene.add(plane)
	scene.add(lightLeft)
	scene.add(lightRight)

	// camera position
 
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


	// renderer
	var renderer = new THREE.WebGLRenderer()
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.shadowMap.enabled = true
	document.getElementById('webgl').appendChild(renderer.domElement)

	var controls = new OrbitControls( camera, renderer.domElement )

	update(renderer, scene, camera, controls)

	return scene

}

	function getSphere(material, size, segments) {
		var geometry = new THREE.SphereGeometry(size, segments, segments)
		var obj = new THREE.Mesh(geometry, material)
		obj.castShadow = true;

		return obj
	}

	function getMaterial(type, color) {
		var selectedMaterial
		var materialOptions = {
			color: color === undefined ? 'rgb(255, 255, 255)' : color, 
		}

		switch (type) {
			case 'basic':
				selectedMaterial = new THREE.MeshBasicMaterial(materialOptions)
				break
			case 'lambert':
				selectedMaterial = new THREE.MeshLambertMaterial(materialOptions)
				break
			case 'phong':
				selectedMaterial = new THREE.MeshPhongMaterial(materialOptions)
				break
			case 'standard':
				selectedMaterial = new THREE.MeshStandardMaterial(materialOptions)
				break
			default:
				selectedMaterial = new THREE.MeshBasicMaterial(materialOptions)
				break
		}

		return selectedMaterial
	}


	function getSpotLight(intensity, color) {
		color = color === undefined ? 'rgb(255, 255, 255)' : color 
		var light = new THREE.SpotLight(color, intensity)
		light.castShadow = true
		light.penumbra = 0.5

		// set up shadow properties for the light
		light.shadow.mapSize.width = 1024
		light.shadow.mapSize.height = 1024
		light.shadow.bias = 0.001

		return light
	}

	function getPlane(material, size) {
		var geometry = new THREE.PlaneGeometry(size, size)
		material.side = THREE.DoubleSide
		var obj = new THREE.Mesh(geometry, material)
		obj.receiveShadow = true
	
		return obj
	}



	function update(renderer, scene, camera, controls) {
		controls.update()

		renderer.render(
			scene,
			camera
		)
	
		requestAnimationFrame(function() {
			update(renderer, scene, camera, controls, clock)
		})
	}





var scene = init()

console.log(scene);


