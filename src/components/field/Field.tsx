import { useEffect, useRef } from "react";
import { Application, FederatedPointerEvent, Graphics } from "pixi.js";

export default function Field() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let app: Application | null = null;
    let disposed = false;
    let handlePointerDown: ((event: FederatedPointerEvent) => void) | null = null;
    let moveTicker: (() => void) | null = null;
    let onResize: (() => void) | null = null;

    const keys: Record<string, boolean> = {};

    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) {
        event.preventDefault();
      }
      keys[event.key.toLowerCase()] = true;
    };

    const onKeyUp = (event: KeyboardEvent) => {
      keys[event.key.toLowerCase()] = false;
    };

    const init = async () => {
      const createdApp = new Application();
      await createdApp.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x222222,
      });

      if (disposed) {
        createdApp.destroy(true);
        return;
      }

      app = createdApp;

      if (containerRef.current) {
        containerRef.current.appendChild(createdApp.canvas);
      }

      const SIZE = 150;
      const rect = new Graphics();
      rect.rect(-SIZE / 2, -SIZE / 2, SIZE, SIZE).fill({ color: 0xff0000 });
      rect.position.set(createdApp.screen.width / 2, createdApp.screen.height / 2);
      createdApp.stage.addChild(rect);

      const clampPosition = () => {
        const minX = SIZE / 2;
        const minY = SIZE / 2;
        const maxX = createdApp.screen.width - SIZE / 2;
        const maxY = createdApp.screen.height - SIZE / 2;
        rect.x = Math.max(minX, Math.min(maxX, rect.x));
        rect.y = Math.max(minY, Math.min(maxY, rect.y));
      };

      handlePointerDown = (event: FederatedPointerEvent) => {
        const { x, y } = event.global;
        rect.position.set(x, y);
        clampPosition();
      };

      createdApp.stage.eventMode = "static";
      createdApp.stage.hitArea = createdApp.screen;
      createdApp.stage.addEventListener("pointerdown", handlePointerDown);

      window.addEventListener("keydown", onKeyDown, { passive: false });
      window.addEventListener("keyup", onKeyUp);

      const speed = 6;
      const move = () => {
        let dx = 0;
        let dy = 0;

        if (keys["arrowleft"]) {
          dx -= speed;
        }
        if (keys["arrowright"]) {
          dx += speed;
        }
        if (keys["arrowup"]) {
          dy -= speed;
        }
        if (keys["arrowdown"]) {
          dy += speed;
        }
        if (keys["a"]) {
          dx -= speed;
        }
        if (keys["d"]) {
          dx += speed;
        }
        if (keys["w"]) {
          dy -= speed;
        }
        if (keys["s"]) {
          dy += speed;
        }

        if (dx !== 0 || dy !== 0) {
          rect.x += dx;
          rect.y += dy;
          clampPosition();
        }
      };

      moveTicker = move;
      createdApp.ticker.add(move);

      onResize = () => {
        if (!app) {
          return;
        }
        app.renderer.resize(window.innerWidth, window.innerHeight);
        clampPosition();
      };

      window.addEventListener("resize", onResize);
    };

    init();

    return () => {
      disposed = true;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (onResize) {
        window.removeEventListener("resize", onResize);
        onResize = null;
      }
      if (app) {
        if (moveTicker) {
          app.ticker.remove(moveTicker);
          moveTicker = null;
        }
        if (containerRef.current?.contains(app.canvas)) {
          containerRef.current.removeChild(app.canvas);
        }
        if (handlePointerDown) {
          app.stage.removeEventListener("pointerdown", handlePointerDown);
          handlePointerDown = null;
        }
        app.destroy(true);
        app = null;
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full"></div>;
}
