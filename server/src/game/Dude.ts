import * as BABYLON from 'babylonjs';
import { createVector, getRandomFloat } from '../utils/gameUtils';
import { DudeMovementType } from '../rooms/constants';
import { Player } from './Player';

export class Dude {
  private scene: BABYLON.Scene;
  speed: number = 0.01;
  chaseSpeed: number = 0.1;
  dudeMesh!: BABYLON.Mesh;
  actionTriggerBox!: BABYLON.Mesh;
  id: string;
  frontVector!: BABYLON.Vector3;
  chaseList: { [id: string]: Player } = {};
  lockon?: Player;

  movementType: string;

  constructor(scene: BABYLON.Scene, id: string) {
    this.scene = scene;
    this.id = id;
    this.movementType = DudeMovementType.RANDOM;
  }

  init(position: BABYLON.Vector3) {
    this.dudeMesh = BABYLON.MeshBuilder.CreateSphere(
      `dude_${this.id}`,
      { diameterX: 1.5, diameterY: 0.75, diameterZ: 1.5 },
      this.scene
    );
    this.dudeMesh.checkCollisions = true;
    this.dudeMesh.position = position;
    this.frontVector = new BABYLON.Vector3(
      Math.sin(this.dudeMesh.rotation.y),
      0,
      Math.cos(this.dudeMesh.rotation.y)
    );

    this.dudeMesh.onCollideObservable.add(e => {
      if (this.movementType === DudeMovementType.RANDOM) {
        this.changeDirectionRandom();
      }
    });

    // This mesh is used to trigger actions on intersection
    this.actionTriggerBox = BABYLON.MeshBuilder.CreateBox('collider', { size: 12 }, this.scene);
    this.actionTriggerBox.parent = this.dudeMesh;
    this.actionTriggerBox.actionManager = new BABYLON.ActionManager(this.scene);
  }

  getActionManager() {
    return this.actionTriggerBox.actionManager as BABYLON.ActionManager;
  }

  move() {
    if (this.movementType === DudeMovementType.RANDOM) {
      this.dudeMesh.moveWithCollisions(
        this.frontVector.multiplyByFloats(this.speed, this.speed, this.speed)
      );
    } else if (this.movementType === DudeMovementType.FOLLOW && this.lockon) {
      const playerPosition = this.lockon.playerMesh.position;
      const direction = playerPosition.subtract(this.dudeMesh.position);
      const distance = direction.length();
      const dir = direction.normalize();
      if (distance <= 3) {
        this.movementType = DudeMovementType.TESTING;
        this.lockon.caught = true;
      }
      this.dudeMesh.moveWithCollisions(
        direction.multiplyByFloats(this.chaseSpeed, this.chaseSpeed, this.chaseSpeed)
      );
    }
  }

  changeDirectionRandom() {
    const rotationDelta = getRandomFloat(-Math.PI / 3, Math.PI / 3);
    this.dudeMesh.rotation.y += rotationDelta;
    this.frontVector = new BABYLON.Vector3(
      Math.sin(this.dudeMesh.rotation.y),
      0,
      Math.cos(this.dudeMesh.rotation.y)
    );
  }

  private detectMovementType() {
    const keys = Object.keys(this.chaseList);
    if (keys.length > 0) {
      this.movementType = DudeMovementType.FOLLOW;
      if (!this.lockon) {
        this.lockon = this.chaseList[keys[0]];
      }
      return;
    }
    this.movementType = DudeMovementType.RANDOM;
  }

  addPlayerToChaseList(player: Player) {
    this.chaseList[player.id] = player;
    this.detectMovementType();
  }

  removePlayerFromChaseList(player: Player) {
    delete this.chaseList[player.id];
    if (this.lockon && this.lockon.id === player.id) {
      this.lockon = undefined;
    }
    this.detectMovementType();
  }
}
