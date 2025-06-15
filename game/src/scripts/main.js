import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118.1/build/three.module.js';

import gsap from 'gsap';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { entity_manager } from './entity-manager.js';
import { entity } from './entity.js';
import { gltf_component } from './gltf-component.js';
import { math } from './math.js';
import { player_entity } from './player-entity';
import { player_input } from './player-input.js';
import { spatial_grid_controller } from './spatial-grid-controller.js';
import { spatial_hash_grid } from './spatial-hash-grid.js';
import { third_person_camera } from './third-person-camera.js';

const _VS = `
varying vec3 vWorldPosition;

void main() {
  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  vWorldPosition = worldPosition.xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;

const _FS = `
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;

varying vec3 vWorldPosition;

void main() {
  float h = normalize( vWorldPosition + offset ).y;
  gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
}`;

class HackNSlashDemo {
  constructor() {
    // this._Initialize();
    console.log('CoU Key: 1990');
    console.log(
      'Words are not always what they seem. AZERTYUIOPQSDFGHJKLMWXCVBN'
    );
    console.log('Knowledge is available @UkiyoCouncil');
  }

  _Initialize() {
    const selectedCharacter = localStorage.getItem(
      'character:selected'
    );
    const previousCharacter = localStorage.getItem(
      'character:previous'
    );
    const game = document.querySelector('#threejs');
    if (selectedCharacter === previousCharacter && game) {
      return;
    }
    if (game) {
      this._scene = null;
      game.remove();
    }

    this._threejs = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
    });
    this._threejs.outputEncoding = THREE.sRGBEncoding;
    this._threejs.gammaFactor = 2.2;
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setPixelRatio(window.devicePixelRatio, 2);
    this._threejs.setSize(window.innerWidth, window.innerHeight);
    this._threejs.domElement.id = 'threejs';

    // OverrideMaterialManager.workaroundEnabled = true;

    document
      .getElementById('container')
      .appendChild(this._threejs.domElement);

    window.addEventListener(
      'resize',
      () => {
        this._OnWindowResize();
      },
      false
    );

    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 0.01;
    const far = 5000;
    this._camera = new THREE.PerspectiveCamera(
      fov,
      window.innerWidth / window.innerHeight,
      near,
      far
    );
    this._camera.position.set(25, 10, 25);

    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color(0x9598d4);
    this._scene.fog = new THREE.FogExp2(0x89b2eb, 0.002);

    let light = new THREE.DirectionalLight(0x9598d4, 3);
    light.position.set(-10, 500, 10);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 1000.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    this._scene.add(light);

    this._sun = light;

    this._composer = new EffectComposer(this._threejs);

    const renderPass = new RenderPass(this._scene, this._camera);
    this._composer.addPass(renderPass);

    // const capabilities = this._composer.getRenderer().capabilities;
    //
    // const normalPass = new NormalPass(this._scene, this._camera);
    // const depthDownsamplingPass = new DepthDownsamplingPass({
    //   normalBuffer: normalPass.texture,
    //   resolutionScale: 0.5
    // });
    // this._composer.addPass(normalPass);
    //
    // const normalDepthBuffer = capabilities.isWebGL2 ?
    //   depthDownsamplingPass.texture : null;
    //
    // // Note: Thresholds and falloff correspond to camera near/far.
    // // Example: worldDistance = distanceThreshold * (camera.far - camera.near)
    // const ssaoEffect = new SSAOEffect(this._camera, normalPass.texture, {
    //   blendFunction: BlendFunction.NORMAL,
    //   distanceScaling: true,
    //   depthAwareUpsampling: true,
    //   normalDepthBuffer,
    //   samples: 9,
    //   rings: 7,
    //   distanceThreshold: 0.02,	// Render up to a distance of ~20 world units
    //   distanceFalloff: 0.0025,	// with an additional ~2.5 units of falloff.
    //   rangeThreshold: 0.0003,		// Occlusion proximity of ~0.3 world units
    //   rangeFalloff: 0.0001,			// with ~0.1 units of falloff.
    //   luminanceInfluence: 0.7,
    //   minRadiusScale: 0.33,
    //   radius: 0.1,
    //   intensity: 1.33,
    //   bias: 0.025,
    //   fade: 0.01,
    //   color: null,
    //   resolutionScale: 0.5
    // });
    //
    // this._composer.addPass(ssaoEffect);

    // const ambientLight = new THREE.AmbientLight(0x9598d4, 0.1); // soft white light
    // this._scene.add(ambientLight);

    // const plane = new THREE.Mesh(
    //   new THREE.PlaneGeometry(5000, 5000, 10, 10),
    //   new THREE.MeshStandardMaterial({
    //     color: 0x1e601c
    //   }));
    // plane.castShadow = false;
    // plane.receiveShadow = true;
    // plane.rotation.x = -Math.PI / 2;
    // this._scene.add(plane);

    this._entityManager = new entity_manager.EntityManager();
    this._grid = new spatial_hash_grid.SpatialHashGrid(
      [
        [-1000, -1000],
        [1000, 1000],
      ],
      [100, 100]
    );

    this._LoadingManager = new THREE.LoadingManager();

    this._LoadingManager.onStart = () => {
      document.querySelector('#loader').style.display = 'flex';
    };
    this._LoadingManager.onLoad = () => {
      gsap.delayedCall(1, () => {
        document.querySelector('#loader').style.display = 'none';
        this._previousRAF = null;
        this._RAF();
      });
    };

    // this._LoadControllers();
    // this._LoadFoliage();
    this._LoadClouds();
    this._LoadMap();
    this._LoadSky();
    this._LoadPickables();
    this._LoadPlayer();
    // this._LoadBackground();

    // this._previousRAF = null;
    // this._RAF();

    localStorage.setItem('character:previous', selectedCharacter);
  }

  _LoadControllers() {
    const ui = new entity.Entity();
    ui.AddComponent(new ui_controller.UIController());
    this._entityManager.Add(ui, 'ui');
  }

  _LoadSky() {
    const hemiLight = new THREE.HemisphereLight(
      0xf9598d4,
      0x9598d4,
      0.6
    );
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    this._scene.add(hemiLight);

    const uniforms = {
      topColor: { value: new THREE.Color(0x9598d4) },
      bottomColor: { value: new THREE.Color(0xffffff) },
      offset: { value: 33 },
      exponent: { value: 0.6 },
    };
    uniforms['topColor'].value.copy(hemiLight.color);

    this._scene.fog.color.copy(uniforms['bottomColor'].value);

    const skyGeo = new THREE.SphereBufferGeometry(1000, 32, 15);
    const skyMat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: _VS,
      fragmentShader: _FS,
      side: THREE.BackSide,
    });

    const sky = new THREE.Mesh(skyGeo, skyMat);
    this._scene.add(sky);
  }

  _LoadMap() {
    // const fbxLoader = new FBXLoader();
    // fbxLoader.load(
    //   "./resources/scenes/POLYGON_Samurai_Demo_Scene.fbx",
    //   (object) => {
    //     // object.traverse(function (child) {
    //     //     if ((child as THREE.Mesh).isMesh) {
    //     //         // (child as THREE.Mesh).material = material
    //     //         if ((child as THREE.Mesh).material) {
    //     //             ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
    //     //         }
    //     //     }
    //     // })
    //     object.traverse((child) => {
    //       if (child.isMesh) {
    //         child.castShadow = true;
    //         child.receiveShadow = true;
    //         child.material.shininess = 0;
    //       }
    //     });
    //     object.scale.set(0.05, 0.05, 0.05);
    //     object.rotation.x = -Math.PI / 2;
    //     this._scene.add(object);
    //   },
    //   (xhr) => {
    //     console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
    // const pos = new THREE.Vector3(150, 0, 0);

    const floor = new entity.Entity();
    floor.AddComponent(
      new gltf_component.StaticModelComponent({
        scene: this._scene,
        resourcePath: './scene/',
        resourceName: 'floor.glb',
        emissive: new THREE.Color(0x000000),
        specular: new THREE.Color(0x000000),
        receiveShadow: true,
        castShadow: true,
        scale: 6,
        loadingManager: this._LoadingManager,
      }),
      'StaticModelComponent'
    );
    this._entityManager.Add(floor, 'terrain');
    floor.SetActive(false);

    const collision = new entity.Entity();
    collision.AddComponent(
      new gltf_component.StaticModelComponent({
        scene: this._scene,
        resourcePath: './scene/',
        resourceName: 'collision.glb',
        receiveShadow: true,
        castShadow: true,
        emissive: new THREE.Color(0x000000),
        specular: new THREE.Color(0x000000),
        scale: 6,
        loadingManager: this._LoadingManager,
      }),
      'StaticModelComponent'
    );
    this._entityManager.Add(collision, 'collision');
    collision.SetActive(false);

    const env = new entity.Entity();
    env.AddComponent(
      new gltf_component.StaticModelComponent({
        scene: this._scene,
        resourcePath: './scene/',
        resourceName: 'environment.glb',
        receiveShadow: true,
        castShadow: true,
        emissive: new THREE.Color(0x000000),
        specular: new THREE.Color(0x000000),
        scale: 6,
        loadingManager: this._LoadingManager,
      }),
      'StaticModelComponent'
    );
    this._entityManager.Add(env);
    env.SetActive(false);

    const other = new entity.Entity();
    other.AddComponent(
      new gltf_component.StaticModelComponent({
        scene: this._scene,
        resourcePath: './scene/',
        resourceName: 'other.glb',
        receiveShadow: true,
        castShadow: true,
        emissive: new THREE.Color(0x000000),
        specular: new THREE.Color(0x000000),
        scale: 6,
        loadingManager: this._LoadingManager,
      }),
      'StaticModelComponent'
    );
    this._entityManager.Add(other);
    other.SetActive(false);
  }

  _LoadClouds() {
    const e = new entity.Entity();
    e.AddComponent(
      new gltf_component.StaticModelComponent({
        scene: this._scene,
        resourcePath: './scene/',
        resourceName: 'clouds.glb',
        receiveShadow: true,
        castShadow: true,
        scale: 6,
        shininess: 0,
        loadingManager: this._LoadingManager,
      }),
      'StaticModelComponent'
    );
    this._entityManager.Add(e);
    e.SetActive(false);
  }

  _LoadBackground() {
    const e = new entity.Entity();
    e.AddComponent(
      new gltf_component.StaticModelComponent({
        scene: this._scene,
        resourcePath: './scene/',
        resourceName: 'fuji.glb',
        receiveShadow: true,
        castShadow: true,
        scale: 0,
        shininess: 0,
        loadingManager: this._LoadingManager,
      }),
      'StaticModelComponent'
    );
    this._entityManager.Add(e);
    e.SetActive(false);
  }

  _LoadFoliage() {
    for (let i = 0; i < 100; ++i) {
      const names = [
        'CommonTree_Dead',
        'CommonTree',
        'BirchTree',
        'BirchTree_Dead',
        'Willow',
        'Willow_Dead',
        'PineTree',
      ];
      const name = names[math.rand_int(0, names.length - 1)];
      const index = math.rand_int(1, 5);

      const pos = new THREE.Vector3(
        (Math.random() * 2.0 - 1.0) * 500,
        0,
        (Math.random() * 2.0 - 1.0) * 500
      );

      const e = new entity.Entity();
      e.AddComponent(
        new gltf_component.StaticModelComponent({
          scene: this._scene,
          resourcePath: './nature/FBX/',
          resourceName: name + '_' + index + '.fbx',
          scale: 0.25,
          emissive: new THREE.Color(0x000000),
          specular: new THREE.Color(0x000000),
          receiveShadow: true,
          castShadow: true,
          shininess: 0,
          loadingManager: this._LoadingManager,
        }),
        'StaticModelComponent'
      );
      e.AddComponent(
        new spatial_grid_controller.SpatialGridController({
          grid: this._grid,
        }),
        'SpatialGridController'
      );
      e.SetPosition(pos);
      e.SetQuaternion(
        new THREE.Quaternion((Math.PI / 2) * 3, 50, 0, 1)
      );
      this._entityManager.Add(e);
      e.SetActive(false);
    }
  }

  _LoadPickables() {
    const selectedCharacter = JSON.parse(
      localStorage.getItem('character:selected')
    );

    let character = 've';
    if (selectedCharacter === 've') {
      character = 'rin';
    }
    if (selectedCharacter === 'rin') {
      character = 'syf';
    }

    let map = new THREE.TextureLoader().load(
      '/images/question_mark.png'
    );
    let material = new THREE.SpriteMaterial({ map: map });

    const sensei = new entity.Entity();
    sensei.AddComponent(
      new gltf_component.AnimatedModelComponent({
        scene: this._scene,
        resourcePath: './characters/',
        resourceName: character + '.glb',
        // resourceAnimation: character + "-idle.fbx",
        scale: 2.2,
        receiveShadow: true,
        castShadow: true,
      }),
      'AnimatedModelComponent'
    );
    sensei.AddComponent(
      new spatial_grid_controller.SpatialGridController({
        grid: this._grid,
      }),
      'SpatialGridController'
    );
    // sensei.AddComponent(new quest_component.QuestComponent());
    sensei.SetPosition(new THREE.Vector3(-10, -5, -25));
    this._entityManager.Add(sensei);

    const cubeVe = new entity.Entity();
    cubeVe.AddComponent(
      new gltf_component.AnimatedModelComponent({
        scene: this._scene,
        resourcePath: './scene/',
        resourceName: 'cube_ve.glb',
        // resourceAnimation: character + "-idle.fbx",
        scale: 2.2,
        receiveShadow: true,
        castShadow: true,
      }),
      'AnimatedModelComponent'
    );
    cubeVe.AddComponent(
      new spatial_grid_controller.SpatialGridController({
        grid: this._grid,
      }),
      'SpatialGridController'
    );
    cubeVe.AddComponent(
      new player_input.PickableComponent(),
      'PickableComponent'
    );
    // sensei.AddComponent(new quest_component.QuestComponent());
    cubeVe.SetPosition(new THREE.Vector3(-10, -5, -25));
    this._entityManager.Add(cubeVe, 'greeting');

    let sprite = new THREE.Sprite(material);
    sprite.position.set(-10, 10, -25);
    this._scene.add(sprite);

    map = new THREE.TextureLoader().load(
      '/images/magnifying_glass.png'
    );
    material = new THREE.SpriteMaterial({ map: map });

    const flag = new entity.Entity();
    flag.AddComponent(
      new gltf_component.AnimatedModelComponent({
        scene: this._scene,
        resourcePath: '/scene/',
        resourceName: 'kitsune_flag.glb',
        scale: 6,
        receiveShadow: true,
        castShadow: true,
      }),
      'AnimatedModelComponent'
    );
    flag.AddComponent(
      new spatial_grid_controller.SpatialGridController({
        grid: this._grid,
      }),
      'SpatialGridController'
    );
    flag.AddComponent(
      new player_input.PickableComponent(),
      'PickableComponent'
    );
    // sensei.AddComponent(new quest_component.QuestComponent());
    flag.SetPosition(new THREE.Vector3(20, -1, -35));
    this._entityManager.Add(flag, 'flag');

    sprite = new THREE.Sprite(material);
    sprite.position.set(20, 15, -35);
    this._scene.add(sprite);

    const arch = new entity.Entity();
    arch.AddComponent(
      new gltf_component.AnimatedModelComponent({
        scene: this._scene,
        resourcePath: '/scene/',
        resourceName: 'arch.glb',
        scale: 6,
        receiveShadow: true,
        castShadow: true,
      }),
      'AnimatedModelComponent'
    );
    // sensei.AddComponent(new quest_component.QuestComponent());
    arch.SetPosition(new THREE.Vector3(-85, -1, -25));
    this._entityManager.Add(arch, 'arch');

    const archCube = new entity.Entity();
    archCube.AddComponent(
      new gltf_component.AnimatedModelComponent({
        scene: this._scene,
        resourcePath: '/scene/',
        resourceName: 'cube_arch.glb',
        scale: 6,
        receiveShadow: true,
        castShadow: true,
      }),
      'AnimatedModelComponent'
    );
    archCube.AddComponent(
      new player_input.PickableComponent(),
      'PickableComponent'
    );
    // sensei.AddComponent(new quest_component.QuestComponent());
    archCube.SetPosition(new THREE.Vector3(-85, 0, -25));
    this._entityManager.Add(archCube, 'cube_arch');

    sprite = new THREE.Sprite(material);
    sprite.position.set(-85, 28, -25);
    this._scene.add(sprite);

    const scroll = new entity.Entity();
    scroll.AddComponent(
      new gltf_component.AnimatedModelComponent({
        scene: this._scene,
        resourcePath: '/scene/',
        resourceName: 'scroll.glb',
        scale: 6,
        receiveShadow: true,
        castShadow: true,
      }),
      'AnimatedModelComponent'
    );
    scroll.AddComponent(
      new player_input.PickableComponent(),
      'PickableComponent'
    );
    // sensei.AddComponent(new quest_component.QuestComponent());
    this._entityManager.Add(scroll, 'scroll');
  }

  _LoadPlayer() {
    const params = {
      camera: this._camera,
      scene: this._scene,
      composer: this._composer,
      loadingManager: this._LoadingManager,
    };

    // const levelUpSpawner = new entity.Entity();
    // levelUpSpawner.AddComponent(new level_up_component.LevelUpComponentSpawner({
    //   camera: this._camera,
    //   scene: this._scene
    // }));
    // this._entityManager.Add(levelUpSpawner, "level-up-spawner");

    // const axe = new entity.Entity();
    // axe.AddComponent(new inventory_controller.InventoryItem({
    //   type: "weapon",
    //   damage: 3,
    //   renderParams: {
    //     name: "Axe",
    //     scale: 0.25,
    //     icon: "war-axe-64.png"
    //   }
    // }));
    // this._entityManager.Add(axe);
    //
    // const sword = new entity.Entity();
    // sword.AddComponent(new inventory_controller.InventoryItem({
    //   type: "weapon",
    //   damage: 3,
    //   renderParams: {
    //     name: "Sword",
    //     scale: 0.25,
    //     icon: "pointy-sword-64.png"
    //   }
    // }));
    // this._entityManager.Add(sword);

    const player = new entity.Entity();
    player.AddComponent(
      new player_entity.BasicCharacterController(params),
      'BasicCharacterController'
    );
    player.AddComponent(
      new player_input.BasicCharacterControllerInput(params),
      'BasicCharacterControllerInput'
    );
    // player.AddComponent(
    //   new equip_weapon_component.EquipWeapon({ anchor: "RightHandIndex1" }));
    // player.AddComponent(new inventory_controller.InventoryController(params));
    // player.AddComponent(new health_component.HealthComponent({
    //   updateUI: true,
    //   health: 100,
    //   maxHealth: 100,
    //   strength: 50,
    //   wisdomness: 5,
    //   benchpress: 20,
    //   curl: 100,
    //   experience: 0,
    //   level: 1
    // }));
    player.AddComponent(
      new spatial_grid_controller.SpatialGridController({
        grid: this._grid,
      }),
      'SpatialGridController'
    );
    // player.AddComponent(new attack_controller.AttackController({ timing: 0.7 }));
    this._entityManager.Add(player, 'player');

    // player.Broadcast({
    //   topic: "inventory.add",
    //   value: axe.Name,
    //   added: false
    // });
    //
    // player.Broadcast({
    //   topic: "inventory.add",
    //   value: sword.Name,
    //   added: false
    // });
    //
    // player.Broadcast({
    //   topic: "inventory.equip",
    //   value: sword.Name,
    //   added: false
    // });

    const camera = new entity.Entity();
    camera.AddComponent(
      new third_person_camera.ThirdPersonCamera({
        camera: this._camera,
        target: this._entityManager.Get('player'),
      }),
      'ThirdPersonCamera'
    );
    this._entityManager.Add(camera, 'player-camera');

    // for (let i = 0; i < 50; ++i) {
    //   const monsters = [
    //     {
    //       resourceName: "Ghost.fbx",
    //       resourceTexture: "Ghost_Texture.png"
    //     },
    //     {
    //       resourceName: "Alien.fbx",
    //       resourceTexture: "Alien_Texture.png"
    //     },
    //     {
    //       resourceName: "Skull.fbx",
    //       resourceTexture: "Skull_Texture.png"
    //     },
    //     {
    //       resourceName: "GreenDemon.fbx",
    //       resourceTexture: "GreenDemon_Texture.png"
    //     },
    //     {
    //       resourceName: "Cyclops.fbx",
    //       resourceTexture: "Cyclops_Texture.png"
    //     },
    //     {
    //       resourceName: "Cactus.fbx",
    //       resourceTexture: "Cactus_Texture.png"
    //     }
    //   ];
    //   const m = monsters[math.rand_int(0, monsters.length - 1)];
    //
    //   const npc = new entity.Entity();
    //   npc.AddComponent(new npc_entity.NPCController({
    //     camera: this._camera,
    //     scene: this._scene,
    //     resourceName: m.resourceName,
    //     resourceTexture: m.resourceTexture
    //   }));
    //   npc.AddComponent(
    //     new health_component.HealthComponent({
    //       health: 50,
    //       maxHealth: 50,
    //       strength: 2,
    //       wisdomness: 2,
    //       benchpress: 3,
    //       curl: 1,
    //       experience: 0,
    //       level: 1,
    //       camera: this._camera,
    //       scene: this._scene
    //     }));
    //   npc.AddComponent(
    //     new spatial_grid_controller.SpatialGridController({ grid: this._grid }));
    //   npc.AddComponent(new health_bar.HealthBar({
    //     parent: this._scene,
    //     camera: this._camera
    //   }));
    //   npc.AddComponent(new attack_controller.AttackController({ timing: 0.35 }));
    //   npc.SetPosition(new THREE.Vector3(
    //     (Math.random() * 2 - 1) * 500,
    //     0,
    //     (Math.random() * 2 - 1) * 500));
    //   this._entityManager.Add(npc);
    // }
  }

  _OnWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

  _UpdateSun() {
    const player = this._entityManager.Get('player');
    const pos = player._position;

    this._sun.position.copy(pos);
    this._sun.position.add(new THREE.Vector3(-10, 500, -10));
    this._sun.target.position.copy(pos);
    this._sun.updateMatrixWorld();
    this._sun.target.updateMatrixWorld();
  }

  _RAF() {
    requestAnimationFrame((t) => {
      if (this._previousRAF === null) {
        this._previousRAF = t;
      }

      this._RAF();

      this._composer.render();
      this._Step(t - this._previousRAF);
      this._previousRAF = t;
    });
  }

  _Step(timeElapsed) {
    const timeElapsedS = Math.min(1.0 / 30.0, timeElapsed * 0.001);

    this._UpdateSun();

    this._entityManager.Update(timeElapsedS);
  }
}

// let _APP = null;
//
// window.addEventListener("load", () => {
//   _APP = new HackNSlashDemo();
// });

// export const initialize = () => {
//   if (_APP !== null) return;
//   _APP = new HackNSlashDemo();
// };

export const useGame = () => new HackNSlashDemo();
