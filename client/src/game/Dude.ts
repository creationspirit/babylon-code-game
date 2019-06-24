import * as BABYLON from 'babylonjs';

export class Dude {
  private scene: BABYLON.Scene;
  id: string;
  mesh: BABYLON.Mesh;
  skeleton: BABYLON.Skeleton;

  constructor(scene: BABYLON.Scene, prefabMesh: BABYLON.Mesh, id: string) {
    this.scene = scene;
    this.id = id;

    let skeleton = prefabMesh.getChildMeshes(true)[0].skeleton as BABYLON.Skeleton;
    this.mesh = prefabMesh.clone(this.id);

    skeleton = skeleton.clone(`skeleton_${id}`, `skeleton_${id}`);

    this.mesh.getChildMeshes(true).forEach(childMesh => {
      childMesh.skeleton = skeleton;
    });
    this.skeleton = skeleton;
    this.mesh.isEnabled(false);
  }

  init(position: BABYLON.Vector3) {
    this.mesh.position = position;
    this.scene.beginAnimation(this.skeleton, 1, 100, true, 0.8);
  }

  update(position: BABYLON.Vector3) {
    const direction = position.subtract(this.mesh.position).normalize();
    this.mesh.rotation.y = Math.atan2(-1 * direction.x, -1 * direction.z);
    this.mesh.position = position;
  }
}
