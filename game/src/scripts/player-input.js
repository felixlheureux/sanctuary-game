import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";

import { entity } from "./entity.js";
import MobileDetect from "mobile-detect";
import gsap from "gsap";

export const player_input = (() => {

  class PickableComponent extends entity.Component {
    constructor() {
      super();
    }

    InitComponent() {
    }
  }

  class BasicCharacterControllerInput extends entity.Component {
    constructor(params) {
      super();
      this._params = params;
      this._Init();
    }

    _Init() {
      this._keys = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        space: false,
        shift: false
      };

      this._raycaster = new THREE.Raycaster();

      const md = new MobileDetect(window.navigator.userAgent);
      if (md.mobile() || md.tablet()) {
        this._InitJoyStick();
        document.addEventListener("touchend", (e) => this._onMouseUp(e), false);
        return;
      }
      document.addEventListener("keydown", (e) => this._onKeyDown(e), false);
      document.addEventListener("keyup", (e) => this._onKeyUp(e), false);
      document.addEventListener("mouseup", (e) => this._onMouseUp(e), false);
    }

    _onMouseUp(event) {
      event.stopPropagation();

      if (event.target.id !== "threejs") return;

      const rect = document.getElementById("threejs").getBoundingClientRect();

      const clientX = event.clientX ?? event.changedTouches[0].clientX;
      const clientY = event.clientY ?? event.changedTouches[0].clientY;

      const pos = {
        x: ((clientX - rect.left) / rect.width) * 2 - 1,
        y: ((clientY - rect.top) / rect.height) * -2 + 1
      };

      this._raycaster.setFromCamera(pos, this._params.camera);

      const pickables = this._parent._parent.Filter((e) => {
        const p = e.GetComponent("PickableComponent");

        return p !== undefined;
      });

      const ray = new THREE.Ray();
      ray.origin.setFromMatrixPosition(this._params.camera.matrixWorld);
      ray.direction.set(pos.x, pos.y, 0.5).unproject(
        this._params.camera).sub(ray.origin).normalize();

      // hack
      // document.getElementById("quest-ui").style.visibility = "hidden";

      for (let p of pickables) {
        const carousel = document.querySelector("#clans-carousel");
        const modal = document.querySelector("#greeting-modal");
        const archModal = document.querySelector("#arch-modal");

        if (carousel.style.display === "inline-flex") return;

        // GOOD ENOUGH
        const box = new THREE.Box3().setFromObject(p._mesh);

        if (this._params.camera.position.distanceTo(box.min) > 50) continue;

        if (ray.intersectsBox(box)) {
          if (p._name === "greeting") {
            if (modal.style.visibility === "visible") return;
            // const text = modal.children[0].children[1];
            modal.style.visibility = "visible";
            // text.scrollTop = 0;
            gsap.from(modal, 1, { opacity: 0 });
            // gsap.from(text, 4, { height: 0 });
            // gsap.from(text, 4, { opacity: 0 });
          } else {
            if (event.target.id !== modal.id && modal.style.visibility === "visible") {
              modal.style.visibility = "hidden";
            }
          }
          if (p._name === "flag") {
            carousel.style.display = "inline-flex";
            gsap.from(carousel, 1, { opacity: 0 });
          }
          if (p._name === "cube_arch") {
            archModal.style.display = "inline-flex";
            gsap.from(archModal, 1, { opacity: 0 });
          }
          if (p._name === "scroll") {
            p._mesh.visible = false;
            this._params.showVoid = false;
            for (let i = 0; i < 5; i++) {
              gsap.delayedCall(i + 1, () => {
                const glitchPass = new GlitchPass();
                this._params.composer.addPass(glitchPass);
                this._params.composer.addPass(glitchPass);
              });
            }
            gsap.delayedCall(5, () => {
              localStorage.setItem("void:show", "true");
              window.dispatchEvent(new Event("storage"));
            });
          }
          p.Broadcast({
            topic: "input.picked"
          });
          break;
        } else {
          if (event.target.id !== modal.id && modal.style.visibility === "visible") {
            modal.style.visibility = "hidden";
          }
        }
      }
    }

    _onKeyDown(event) {
      switch (event.keyCode) {
        case 38:
        case 87: // w
          this._keys.forward = true;
          break;
        case 37:
        case 65: // a
          this._keys.left = true;
          break;
        case 40:
        case 83: // s
          this._keys.backward = true;
          break;
        case 39:
        case 68: // d
          this._keys.right = true;
          break;
        case 32: // SPACE
          this._keys.space = true;
          break;
        case 16: // SHIFT
          this._keys.shift = true;
          break;
      }
    }

    _onKeyUp(event) {
      switch (event.keyCode) {
        case 38: // up arrow
        case 87: // w
          this._keys.forward = false;
          break;
        case 37: // left arrow
        case 65: // a
          this._keys.left = false;
          break;
        case 40: // down arrow
        case 83: // s
          this._keys.backward = false;
          break;
        case 39: // right arrow
        case 68: // d
          this._keys.right = false;
          break;
        case 32: // SPACE
          this._keys.space = false;
          break;
        case 16: // SHIFT
          this._keys.shift = false;
          break;
      }
    }

    _InitJoyStick() {
      const circle = document.createElement("div");
      circle.style.cssText = "position:absolute; bottom:35px; width:80px; height:80px; background:rgba(126, 126, 126, 0.5); border:#fff solid medium; border-radius:50%; left:50%; transform:translateX(-50%);";
      const thumb = document.createElement("div");
      thumb.style.cssText = "position: absolute; left: 20px; top: 20px; width: 40px; height: 40px; border-radius: 50%; background: #fff;";
      circle.appendChild(thumb);
      document.querySelector("#container").appendChild(circle);
      this.domElement = thumb;
      this.maxRadius = 40;
      this.maxRadiusSquared = this.maxRadius * this.maxRadius;
      this.origin = { left: this.domElement.offsetLeft, top: this.domElement.offsetTop };

      if (this.domElement !== undefined) {
        const joystick = this;
        if ("ontouchstart" in window) {
          this.domElement.addEventListener("touchstart", function(evt) {
            joystick.tap(evt);
          });
        } else {
          this.domElement.addEventListener("mousedown", function(evt) {
            joystick.tap(evt);
          });
        }
      }
    }

    getMousePosition(evt) {
      let clientX = evt.targetTouches ? evt.targetTouches[0].pageX : evt.clientX;
      let clientY = evt.targetTouches ? evt.targetTouches[0].pageY : evt.clientY;
      return { x: clientX, y: clientY };
    }

    tap(evt) {
      evt = evt || window.event;
      // get the mouse cursor position at startup:
      this.offset = this.getMousePosition(evt);
      const joystick = this;
      if ("ontouchstart" in window) {
        document.ontouchmove = function(evt) {
          joystick.move(evt);
        };
        document.ontouchend = function(evt) {
          joystick.up(evt);
        };
      } else {
        document.onmousemove = function(evt) {
          joystick.move(evt);
        };
        document.onmouseup = function(evt) {
          joystick.up(evt);
        };
      }
    }

    move(evt) {
      evt = evt || window.event;
      const mouse = this.getMousePosition(evt);
      // calculate the new cursor position:
      let left = mouse.x - this.offset.x;
      let top = mouse.y - this.offset.y;
      //this.offset = mouse;

      const sqMag = left * left + top * top;
      if (sqMag > this.maxRadiusSquared) {
        //Only use sqrt if essential
        const magnitude = Math.sqrt(sqMag);
        left /= magnitude;
        top /= magnitude;
        left *= this.maxRadius;
        top *= this.maxRadius;
      }

      // set the element's new position:
      this.domElement.style.top = `${top + this.domElement.clientHeight / 2}px`;
      this.domElement.style.left = `${left + this.domElement.clientWidth / 2}px`;

      const forward = -(top - this.origin.top + this.domElement.clientHeight / 2) / this.maxRadius;
      const turn = (left - this.origin.left + this.domElement.clientWidth / 2) / this.maxRadius;

      this._keys.forward = forward > 0;
      this._keys.backward = forward < 0;
      this._keys.right = turn > 0.75;
      this._keys.left = turn < -0.75;
    }

    up(evt) {
      if ("ontouchstart" in window) {
        document.ontouchmove = null;
        document.touchend = null;
      } else {
        document.onmousemove = null;
        document.onmouseup = null;
      }
      this.domElement.style.top = `${this.origin.top}px`;
      this.domElement.style.left = `${this.origin.left}px`;
      this._keys.forward = false;
      this._keys.backward = false;
      this._keys.right = false;
      this._keys.left = false;
    }

  }

  return {
    BasicCharacterControllerInput: BasicCharacterControllerInput,
    PickableComponent: PickableComponent
  };

})();