import * as BABYLON from 'babylonjs';
import { createVector } from '../utils/gameUtils';
import { Dude } from './Dude';

export class Player {
  private scene: BABYLON.Scene;
  speed: number = 0.15;
  playerMesh!: BABYLON.Mesh;
  actionTriggerBox!: BABYLON.Mesh;
  id: string;
  actions: BABYLON.IAction[] = [];
  caught: boolean = false;

  constructor(scene: BABYLON.Scene, id: string) {
    this.scene = scene;
    this.id = id;
  }

  init(position: BABYLON.Vector3, dude: Dude) {
    this.playerMesh = BABYLON.MeshBuilder.CreateSphere(
      `player_${this.id}`,
      { diameterX: 1, diameterY: 0.75, diameterZ: 1 },
      this.scene
    );
    this.playerMesh.checkCollisions = true;
    this.playerMesh.position = position;

    // This mesh is used to trigger actions on intersection
    this.actionTriggerBox = BABYLON.MeshBuilder.CreateBox('collider', { size: 1 }, this.scene);
    this.actionTriggerBox.parent = this.playerMesh;
    this.actionTriggerBox.actionManager = new BABYLON.ActionManager(this.scene);

    this.registerWithDude(dude);
  }

  getActionManager() {
    return this.actionTriggerBox.actionManager as BABYLON.ActionManager;
  }

  private registerWithDude(dude: Dude) {
    const actionManager = this.getActionManager();
    this.actions.push(actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        {
          trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
          parameter: dude.actionTriggerBox,
        },
        () => {
          dude.addPlayerToChaseList(this);
        }
      )
    ) as BABYLON.IAction);
    this.actions.push(actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        {
          trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
          parameter: dude.actionTriggerBox,
        },
        () => {
          dude.removePlayerFromChaseList(this);
        }
      )
    ) as BABYLON.IAction);
  }

  applyMovement(data: any) {
    if (this.caught) {
      return;
    }
    const direction = data.direction;
    const up = new BABYLON.Vector2(direction.x, direction.y);
    const down = new BABYLON.Vector2(-direction.x, -direction.y);
    const left = new BABYLON.Vector2(-direction.y, direction.x);
    const right = new BABYLON.Vector2(direction.y, -direction.x);

    let moveDir = new BABYLON.Vector2(0, 0);
    if (data.keyUp) {
      moveDir.addInPlace(up);
    }
    if (data.keyDown) {
      moveDir.addInPlace(down);
    }
    if (data.keyLeft) {
      moveDir.addInPlace(left);
    }
    if (data.keyRight) {
      moveDir.addInPlace(right);
    }
    moveDir = moveDir.normalize();
    moveDir.scaleInPlace(this.speed);
    this.playerMesh.moveWithCollisions(new BABYLON.Vector3(moveDir.x, 0, moveDir.y));
  }

  dispose() {
    this.playerMesh.dispose();
    this.actions.forEach(action => {
      this.getActionManager().unregisterAction(action);
    });
  }
}
