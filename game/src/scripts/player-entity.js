import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118.1/build/three.module.js";

import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js";

import { entity } from "./entity.js";
import { finite_state_machine } from "./finite-state-machine.js";
import { player_state } from "./player-state.js";


export const player_entity = (() => {

  class CharacterFSM extends finite_state_machine.FiniteStateMachine {
    constructor(proxy) {
      super();
      this._proxy = proxy;
      this._Init();
    }

    _Init() {
      this._AddState("idle", player_state.IdleState);
      this._AddState("walk", player_state.WalkState);
      this._AddState("run", player_state.RunState);
      this._AddState("attack", player_state.AttackState);
      this._AddState("death", player_state.DeathState);
    }
  }

  class BasicCharacterControllerProxy {
    constructor(animations) {
      this._animations = animations;
    }

    get animations() {
      return this._animations;
    }
  }

  class BasicCharacterController extends entity.Component {
    constructor(params) {
      super();
      this._Init(params);
    }

    _Init(params) {
      this._params = params;
      this._deceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
      this._acceleration = new THREE.Vector3(1, 0.125, 50.0);
      this._velocity = new THREE.Vector3(0, 0, 0);
      this._position = new THREE.Vector3();

      this._animations = {};
      this._stateMachine = new CharacterFSM(
        new BasicCharacterControllerProxy(this._animations));

      this._LoadModels();
    }

    InitComponent() {
      this._RegisterHandler("health.death", (m) => {
        this._OnDeath(m);
      });
    }

    _OnDeath(msg) {
      this._stateMachine.SetState("death");
    }

    _LoadModels() {
      const selectedCharacter = localStorage.getItem("character:selected");
      const loader = new GLTFLoader(this._params.loadingManager);
      loader.setPath("./characters/");
      loader.setResourcePath("./characters/");
      loader.load(JSON.parse(selectedCharacter) + ".glb", (glb) => {
        this._target = glb.scene;
        this._target.scale.setScalar(2.2);
        this._target.rotation.y = Math.PI;
        this._params.scene.add(this._target);

        // this._bones = {};
        //
        // for (let b of this._target.children[1].skeleton.bones) {
        //   this._bones[b.name] = b;
        // }

        this._target.traverse(c => {
          c.castShadow = true;
          c.receiveShadow = true;
          if (c.material && c.material.map) {
            c.material.map.encoding = THREE.sRGBEncoding;
          }
        });

        this.Broadcast({
          topic: "load.character",
          model: this._target,
          bones: this._bones
        });

        this._mixer = new THREE.AnimationMixer(this._target);

        glb.animations.forEach(a => {
          const clip = a;
          const action = this._mixer.clipAction(clip);

          this._animations[a.name] = {
            clip: clip,
            action: action
          };
        });

        // const _OnLoad = (animName, anim) => {
        //   const clip = anim.animations[0];
        //   const action = this._mixer.clipAction(clip);
        //
        //   this._animations[animName] = {
        //     clip: clip,
        //     action: action
        //   };
        // };

        // this._manager = new THREE.LoadingManager();
        // this._manager.onLoad = () => {
        this._stateMachine.SetState("idle");
        // };

        // const loader = new FBXLoader(this._manager);
        // loader.setPath("./resources/characters/sensei/");
        // loader.load("", (a) => {
        //   _OnLoad("run", a);
        // });
        // loader.load("", (a) => {
        //   _OnLoad("walk", a);
        // });
        // loader.load("Sword And Shield Slash.fbx", (a) => {
        //   _OnLoad("attack", a);
        // });
        // loader.load("Sword And Shield Death.fbx", (a) => {
        //   _OnLoad("death", a);
        // });
      });
      // loader.finished = () => {
      //   this._stateMachine.SetState("idle");
      // };
    }

    _FindIntersections(pos) {
      const _IsAlive = (c) => {
        const h = c.entity.GetComponent("HealthComponent");
        if (!h) {
          return true;
        }
        return h._health > 0;
      };

      const grid = this.GetComponent("SpatialGridController");
      const nearby = grid.FindNearbyEntities(5).filter(e => _IsAlive(e));
      const collisions = [];

      for (let i = 0; i < nearby.length; ++i) {
        const e = nearby[i].entity;
        const d = ((pos.x - e._position.x) ** 2 + (pos.z - e._position.z) ** 2) ** 0.5;

        // HARDCODED
        if (d <= 4) {
          collisions.push(nearby[i].entity);
        }
      }
      return collisions;
    }

    Update(timeInSeconds) {
      if (!this._stateMachine._currentState) {
        return;
      }

      const input = this.GetComponent("BasicCharacterControllerInput");

      this._stateMachine.Update(timeInSeconds, input);

      if (this._mixer) {
        this._mixer.update(timeInSeconds);
      }

      // HARDCODED
      if (this._stateMachine._currentState._action) {
        this.Broadcast({
          topic: "player.action",
          action: this._stateMachine._currentState.Name,
          time: this._stateMachine._currentState._action.time
        });
      }

      const currentState = this._stateMachine._currentState;
      // if (currentState.Name !== "walk" &&
      //   currentState.Name !== "run" &&
      //   currentState.Name !== "idle") {
      //   return;
      // }

      const velocity = this._velocity;
      const frameDeceleration = new THREE.Vector3(
        velocity.x * this._deceleration.x,
        velocity.y * this._deceleration.y,
        velocity.z * this._deceleration.z
      );
      frameDeceleration.multiplyScalar(timeInSeconds);
      frameDeceleration.z = Math.sign(frameDeceleration.z) * Math.min(
        Math.abs(frameDeceleration.z), Math.abs(velocity.z));

      velocity.add(frameDeceleration);

      const controlObject = this._target;
      const _Q = new THREE.Quaternion();
      const _A = new THREE.Vector3();
      const _R = controlObject.quaternion.clone();

      const acc = this._acceleration.clone();
      if (input._keys.shift) {
        acc.multiplyScalar(2.0);
      }

      if (input._keys.forward) {
        velocity.z += acc.z * timeInSeconds;
      }
      if (input._keys.backward) {
        velocity.z -= acc.z * timeInSeconds;
      }
      if (input._keys.left) {
        _A.set(0, 1, 0);
        _Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * this._acceleration.y);
        _R.multiply(_Q);
      }
      if (input._keys.right) {
        _A.set(0, 1, 0);
        _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * this._acceleration.y);
        _R.multiply(_Q);
      }

      controlObject.quaternion.copy(_R);

      const oldPosition = new THREE.Vector3();
      oldPosition.copy(controlObject.position);

      const forward = new THREE.Vector3(0, 0, 1);
      forward.applyQuaternion(controlObject.quaternion);
      forward.normalize();

      const sideways = new THREE.Vector3(1, 0, 0);
      sideways.applyQuaternion(controlObject.quaternion);
      sideways.normalize();

      sideways.multiplyScalar(velocity.x * timeInSeconds);
      forward.multiplyScalar(velocity.z * timeInSeconds);

      const pos = controlObject.position.clone();
      pos.add(forward);
      pos.add(sideways);

      const collisions = this._FindIntersections(pos);
      if (collisions.length > 0) {
        return;
      }

      // const grid = this.GetComponent("SpatialGridController");
      // const nearby = grid.FindNearbyEntities(5);
      // console.log(nearby);

      const dir = new THREE.Vector3();
      controlObject.getWorldDirection(dir);
      let raycaster = new THREE.Raycaster(pos, dir);
      const collision = this.FindEntity("collision");
      const intersect = raycaster.intersectObjects(collision._components.StaticModelComponent._target.children);
      if (intersect.length > 0) {
        if (intersect[0].distance < 4) return;
      }

      const terrain = this.FindEntity("terrain");
      const castFrom = new THREE.Vector3();
      const castDirection = new THREE.Vector3(0, -1, 0);
      raycaster = new THREE.Raycaster(pos, new THREE.Vector3(0, -1, 0));
      castFrom.copy(pos);
      castFrom.y += 200;
      raycaster.set(castFrom, castDirection);
      const intersections = raycaster.intersectObjects(terrain._components.StaticModelComponent._target.children);
      if (intersections.length > 0) {
        pos.y = intersections[0].point.y;
      }

      controlObject.position.copy(pos);
      this._position.copy(pos);

      this._parent.SetPosition(this._position);
      this._parent.SetQuaternion(this._target.quaternion);
    }
  }

  return {
    BasicCharacterControllerProxy: BasicCharacterControllerProxy,
    BasicCharacterController: BasicCharacterController
  };
})();