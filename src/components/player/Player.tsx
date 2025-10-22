import { Graphics, FederatedPointerEvent } from "pixi.js";
import { useSelector, useDispatch } from 'react-redux'
import { type RootState } from '@/store/store'
import { levelUp, takeDamage } from '@/store/playerSlice'

export class Player extends Graphics {
  size = 150;
  speed = 6;

  constructor(x: number, y: number) {
    super();
    this.rect(-this.size / 2, -this.size / 2, this.size, this.size)
      .fill({ color: 0x0d3dd9 });
    this.position.set(x, y);
  }

  move(keys: Record<string, boolean>): boolean {
    let dx = 0, dy = 0;
    if (keys["arrowleft"] || keys["a"]) dx -= this.speed;
    if (keys["arrowright"] || keys["d"]) dx += this.speed;
    if (keys["arrowup"] || keys["w"]) dy -= this.speed;
    if (keys["arrowdown"] || keys["s"]) dy += this.speed;

    if (dx || dy) {
      this.x += dx;
      this.y += dy;
      return true;
    }
    return false;
  }

  clamp(screenWidth: number, screenHeight: number) {
    const minX = this.size / 2;
    const minY = this.size / 2;
    const maxX = screenWidth - this.size / 2;
    const maxY = screenHeight - this.size / 2;
    this.x = Math.max(minX, Math.min(maxX, this.x));
    this.y = Math.max(minY, Math.min(maxY, this.y));
  }

  handlePointerDown(event: FederatedPointerEvent) {
    const { x, y } = event.global;
    this.position.set(x, y);
  }
}
