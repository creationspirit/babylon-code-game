import { Schema, type } from '@colyseus/schema';
import { Vector3 } from 'babylonjs';

export class DudeState extends Schema {
  @type('number')
  x: number | undefined;

  @type('number')
  y: number | undefined;

  constructor() {
    super();
  }

  updatePosition(position: Vector3) {
    (this.x = position.x), (this.y = position.z);
  }
}
