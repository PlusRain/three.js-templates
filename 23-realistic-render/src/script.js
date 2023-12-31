import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'




/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
/**
 * Models
 */
gltfLoader.load(
    // '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    '/models/hamburger.glb',

    (gltf)=>{
        gltf.scene.scale.set(0.5,0.5,0.5)
        gltf.scene.position.set(0, -1 ,0)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        gui.add(gltf.scene.rotation,'y').min(- Math.PI).max(Math.PI).step(0.001).name('rotation')
        updateAllmaterials()
    }
)






/**
 * Base
 */
// Debug
const gui = new dat.GUI()

const debugObject = {}







// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Add the CubeTextureLoader to our loaders:
 */
const cubeTextureLoader = new THREE.CubeTextureLoader()
/**
 * Environment map
 */


/**
 * Update all materials
 */
const updateAllmaterials = ()=>{
    scene.traverse(
    (child)=>{
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
            {
            child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity

            child.castShadow = true
            child.receiveShadow = true

            }
    }
    
    )
}
debugObject.envMapIntensity = 2.5
gui.add(debugObject,'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllmaterials)



const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])


environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap










/**
 * Test sphere
 */
// const testSphere = new THREE.Mesh(
//     new THREE.SphereBufferGeometry(1, 32, 32),
//     new THREE.MeshStandardMaterial()
// )
// scene.add(testSphere)


/**
 * Lights
 * 
 */
const directionalLight = new THREE.DirectionalLight('#ffffff',3)
directionalLight.position.set(0.25,3, - 2.25)


directionalLight.castShadow = true
scene.add(directionalLight)

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightCameraHelper)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.05


/**
 * Dat.GUI
 */
gui.add(directionalLight,'intensity').min(0).max(10).step(0.001).name('LightIntensity')
gui.add(directionalLight.position,'x').min(-5).max(5).step(0.001).name('lightX')
gui.add(directionalLight.position,'y').min(-5).max(5).step(0.001).name('LightY')
gui.add(directionalLight.position,'z').min(-5).max(5).step(0.001).name('LightZ')



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// change the render's set for more realistic settings
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 3

gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

gui
.add(renderer, 'toneMapping', {
No: THREE.NoToneMapping,
Linear: THREE.LinearToneMapping,
Reinhard: THREE.ReinhardToneMapping,
Cineon: THREE.CineonToneMapping,
ACESFilmic: THREE.ACESFilmicToneMapping
})
.onFinishChange(() =>
{
renderer.toneMapping = Number(renderer.toneMapping)
updateAllmaterials()
})

renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding


renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap



/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()