import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class Carousel {
  constructor(options) {
    this.scene = new THREE.Scene();
    this.scene.background = null;

    this.container = options.dom;
    this.canvas = this.container.querySelector("#canvas");
    this.scroll = this.container.querySelector("#scroll");
    this.arch = this.container.querySelector("#arch");
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer({ alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xEFEADB, 1);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.domElement.linear = true;
    this.renderer.domElement.flat = true;
    this.container.appendChild(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 50);
    this.camera.position.set(0, 3, 15);
    this.camera.lookAt(this.scene.position);
    this.objects = [];
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.rotateSpeed = 0.5;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.5;
    this.controls.minPolarAngle = Math.PI / 2;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    window.addEventListener("resize", this.resize.bind(this));
    window.addEventListener("click", this.onMouseDown.bind(this), false);
    window.addEventListener("mousemove", this.onMouseMove.bind(this), false);

    this.init();
    this.render();
  }

  init() {
    // const geometry = new THREE.BoxBufferGeometry();
    // const material = new THREE.MeshNormalMaterial();

    const texture = new THREE.Texture(this.scroll);
    texture.needsUpdate = true;
    texture.encoding = THREE.sRGBEncoding;

    const material = new THREE.SpriteMaterial({ map: texture });

    const count = 6;

    for (let i = 0; i < count; i++) {

      const sprite = new THREE.Sprite(material);

      const t = i / count * 2 * Math.PI;

      sprite.position.x = Math.cos(t) * 6;
      sprite.position.z = Math.sin(t) * 6;
      sprite.scale.set(3, 3, 1);
      sprite.castShadow = true;

      this.scene.add(sprite);
      this.objects.push(sprite);
    }

    const archTexture = new THREE.Texture(this.arch);
    archTexture.needsUpdate = true;
    archTexture.encoding = THREE.sRGBEncoding;

    const archMaterial = new THREE.SpriteMaterial({ map: archTexture });
    const archSprite = new THREE.Sprite(archMaterial);
    archSprite.scale.set(10, 10, 1);
    archSprite.position.setY(2);
    this.scene.add(archSprite);

    // this.uniforms = {
    //   time: { value: 1.0 }
    // };
    //
    // const portalMaterial = new THREE.ShaderMaterial({
    //   uniforms: this.uniforms,
    //   vertexShader: portalVertexShader,
    //   fragmentShader: portalFragmentShader
    // });
    //
    // const portalSprite = new THREE.Sprite(portalMaterial);
    // portalSprite.scale.set(4, 8, 1);
    // portalSprite.lookAt(this.camera.position);
    //
    // this.scene.add(portalSprite);
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    this.camera.updateProjectionMatrix();
  }

  onMouseDown(event) {

    event.preventDefault();

    this.mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.objects);

    if (intersects.length > 0) {
      intersects[0].object.callback();
    }
  }

  onMouseMove(event) {

    event.preventDefault();

    this.mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
  }

  render() {
    requestAnimationFrame(this.render.bind(this));

    // for (let object of this.objects) {
    //
    //   object.rotation.z += 0.005;
    //   object.rotation.x += 0.002;
    //
    // }

    // // update the picking ray with the camera and mouse position
    // this.raycaster.setFromCamera(this.mouse, this.camera);
    //
    // // calculate objects intersecting the picking ray
    // const intersects = this.raycaster.intersectObjects(this.scene.children);
    //
    // if (intersects.length > 0) {
    //   if (intersects[0].object.scale.x < 5) {
    //     intersects[0].object.scale.set(intersects[0].object.scale.x + 0.1, intersects[0].object.scale.y + 0.1, 1);
    //   }
    // }

    // this.uniforms["time"].value = performance.now() / 1000;

    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }
}

new Carousel({
  dom: document.getElementById("canvasContainer")
});