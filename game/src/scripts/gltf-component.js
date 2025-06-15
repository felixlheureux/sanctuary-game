import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/GLTFLoader.js';

import { entity } from './entity.js';

export const gltf_component = (() => {
  class StaticModelComponent extends entity.Component {
    constructor(params) {
      super();
      this._Init(params);
    }

    _Init(params) {
      this._params = params;

      this._LoadModels();
    }

    InitComponent() {
      this._RegisterHandler('update.position', (m) => {
        this._OnPosition(m);
      });
    }

    _OnPosition(m) {
      if (this._target) {
        this._target.position.copy(m.value);
      }
    }

    _LoadModels() {
      if (
        this._params.resourceName.endsWith('glb') ||
        this._params.resourceName.endsWith('gltf')
      ) {
        this._LoadGLB();
      } else if (this._params.resourceName.endsWith('fbx')) {
        this._LoadFBX();
      }
    }

    _OnLoaded(obj) {
      this._target = obj;
      this._params.scene.add(this._target);

      this._target.scale.setScalar(this._params.scale);
      this._target.position.copy(this._parent._position);

      let texture = null;
      if (this._params.resourceTexture) {
        const texLoader = new THREE.TextureLoader();
        texture = texLoader.load(this._params.resourceTexture);
        texture.encoding = THREE.sRGBEncoding;
      }

      this._target.traverse((c) => {
        if (c.name.includes('hide')) c.visible = false;
        let materials = c.material;
        if (!(c.material instanceof Array)) {
          materials = [c.material];
        }

        for (let m of materials) {
          if (m) {
            if (texture) {
              m.map = texture;
            }
            if (this._params.specular) {
              m.specular = this._params.specular;
            }
            if (this._params.emissive) {
              m.emissive = this._params.emissive;
            }
            if (this._params.shininess !== undefined) {
              m.shininess = this._params.shininess;
            }
            m.metalness = 0.01;
          }
        }
        if (this._params.receiveShadow !== undefined) {
          c.receiveShadow = this._params.receiveShadow;
        }
        if (this._params.castShadow !== undefined) {
          c.castShadow = this._params.castShadow;
        }
        if (this._params.visible !== undefined) {
          c.visible = this._params.visible;
        }
      });
    }

    _LoadGLB() {
      const loader = new GLTFLoader(this._params.loadingManager);
      loader.setPath(this._params.resourcePath);
      loader.setResourcePath(this._params.resourcePath);
      loader.load(this._params.resourceName, (glb) => {
        this._OnLoaded(glb.scene);
        glb.scene.traverse((child) => {
          if (child.geometry) {
            this._parent._disposables.add(child.geometry);
          }
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((material) =>
                this._parent._disposables.add(material)
              );
            } else {
              this._parent._disposables.add(child.material);
            }
          }
        });
      });
    }

    _LoadFBX() {
      const loader = new FBXLoader(this._params.loadingManager);
      loader.setPath(this._params.resourcePath);
      loader.setResourcePath(this._params.resourcePath);
      loader.load(this._params.resourceName, (fbx) => {
        this._OnLoaded(fbx);
        fbx.traverse((child) => {
          if (child.geometry) {
            this._parent._disposables.add(child.geometry);
          }
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((material) =>
                this._parent._disposables.add(material)
              );
            } else {
              this._parent._disposables.add(child.material);
            }
          }
        });
      });
    }

    Update(timeInSeconds) {}

    Dispose() {
      if (this._target) {
        this._params.scene.remove(this._target);
        this._target.traverse((child) => {
          if (child.geometry) {
            child.geometry.dispose();
          }
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((material) =>
                material.dispose()
              );
            } else {
              child.material.dispose();
            }
          }
        });
        this._target = null;
      }
    }
  }

  class StaticModelComponentFromLoaded extends entity.Component {
    constructor(params) {
      super();
      this._Init(params);
    }

    _Init(params) {
      this._params = params;

      this._AddObj();
    }

    InitComponent() {
      this._RegisterHandler('update.position', (m) => {
        this._OnPosition(m);
      });
    }

    _OnPosition(m) {
      if (this._target) {
        this._target.position.copy(m.value);
      }
    }

    _AddObj() {
      this._target = this._params.obj;
    }

    Update(timeInSeconds) {}
  }

  class AnimatedModelComponent extends entity.Component {
    constructor(params) {
      super();
      this._Init(params);
    }

    InitComponent() {
      this._RegisterHandler('update.position', (m) => {
        this._OnPosition(m);
      });
    }

    _OnPosition(m) {
      if (this._target) {
        this._target.position.copy(m.value);
        this._target.position.y = -0.2;
      }
    }

    _Init(params) {
      this._params = params;

      this._LoadModels();
    }

    _LoadModels() {
      if (
        this._params.resourceName.endsWith('glb') ||
        this._params.resourceName.endsWith('gltf')
      ) {
        this._LoadGLB();
      } else if (this._params.resourceName.endsWith('fbx')) {
        this._LoadFBX();
      }
    }

    _OnLoaded(obj, animations) {
      this._target = obj;
      this._params.scene.add(this._target);

      this._target.scale.setScalar(this._params.scale);
      this._target.position.copy(this._parent._position);

      this.Broadcast({
        topic: 'update.position',
        value: this._parent._position,
      });

      let texture = null;
      if (this._params.resourceTexture) {
        const texLoader = new THREE.TextureLoader();
        texture = texLoader.load(this._params.resourceTexture);
        texture.encoding = THREE.sRGBEncoding;
      }

      this._target.traverse((c) => {
        if (c.name.includes('hide')) c.visible = false;
        let materials = c.material;
        if (!(c.material instanceof Array)) {
          materials = [c.material];
        }

        for (let m of materials) {
          if (m) {
            if (texture) {
              m.map = texture;
            }
            if (this._params.specular) {
              m.specular = this._params.specular;
            }
            if (this._params.emissive) {
              m.emissive = this._params.emissive;
            }
          }
        }
        if (this._params.receiveShadow !== undefined) {
          c.receiveShadow = this._params.receiveShadow;
        }
        if (this._params.castShadow !== undefined) {
          c.castShadow = this._params.castShadow;
        }
        if (this._params.visible !== undefined) {
          c.visible = this._params.visible;
        }
      });

      this._parent._mesh = this._target;
      this.Broadcast({
        topic: 'load.character',
        model: this._target,
      });

      this._mixer = new THREE.AnimationMixer(this._target);

      for (let i = 0; i < animations.length; i++) {
        if (animations[i].name === 'idle') {
          const clip = animations[i];
          if (clip) {
            const action = this._mixer.clipAction(animations[i]);
            action.play();
          }
        }
      }
    }

    _LoadGLB() {
      const loader = new GLTFLoader();
      loader.setPath(this._params.resourcePath);
      loader.load(this._params.resourceName, (glb) => {
        this._OnLoaded(glb.scene, glb.animations);
      });
    }

    _LoadFBX() {
      const loader = new FBXLoader();
      loader.setPath(this._params.resourcePath);
      loader.load(this._params.resourceName, (fbx) => {
        this._OnLoaded(fbx);
      });
    }

    Update(timeInSeconds) {
      if (this._mixer) {
        this._mixer.update(timeInSeconds);
      }
    }
  }

  return {
    StaticModelComponent: StaticModelComponent,
    StaticModelComponentFromLoaded: StaticModelComponentFromLoaded,
    AnimatedModelComponent: AnimatedModelComponent,
  };
})();
