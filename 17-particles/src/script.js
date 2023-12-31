import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { BufferAttribute } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas 获取画布，容器
const canvas = document.querySelector('canvas.webgl')



// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const particleTexture = textureLoader.load('/textures/particles/8.png')


console.log(particleTexture)



/**
 * Test cube
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxBufferGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(cube)

/**
* Particles
*/
// Geometry
// const particlesGeometry = new THREE.SphereGeometry(1, 32, 32)



// Geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 5000

const positions = new Float32Array(count * 3) // Multiply by 3 because each position is composed of 3 values (x, y, z)
const colors = new Float32Array(count * 3)



for(let i = 0; i < count * 3; i++) // Multiply by 3 for same reason
{
positions[i] = (Math.random() - 0.5) * 10 // Math.random() - 0.5 to have a random value between -0.5 and +0.5
colors[i] = Math.random()
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)) // Create the Three.js BufferAttribute and specify that each information is composed of 3 values
particlesGeometry.setAttribute('color',new THREE.BufferAttribute(colors , 3))

// Material
const particlesMaterial = new THREE.PointsMaterial()
particlesMaterial.size = 0.1
particlesMaterial.sizeAttenuation = true

// particlesMaterial.color = new THREE.Color('#ff88cc')
// particlesMaterial.map = particleTexture
// 设置粒子的透明度 
particlesMaterial.transparent = true
particlesMaterial.alphaMap = particleTexture
// particlesMaterial.alphaTest = 0.001
// particlesMaterial.alphaTest = false
particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending
// particlesMaterial.vertexColors = true


// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)








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
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */

// 将渲染的东西放在 画布上
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update particles
    // particles.rotation.y = elapsedTime * 0.2


    // for(let i =0; i<count;i++){
    //     const i3 = i * 3 //只取三个三个的那些值
    //     const x = particlesGeometry.attributes.position.array[i3]
    //     particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime )

    //     particlesGeometry.attributes.position.needsUpdate = true


    // }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()