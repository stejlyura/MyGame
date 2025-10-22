import { useEffect, useRef } from "react";
import { Application, FederatedPointerEvent } from "pixi.js";
import { Player } from "../player/Player";

export default function Field() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let app: Application | null = null;
    let disposed = false;
    let handlePointerDown: ((event: FederatedPointerEvent) => void) | null = null;
    let moveTicker: (() => void) | null = null;
    let onResize: (() => void) | null = null;
    let player: Player | null = null;

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

      player = new Player(
        createdApp.screen.width / 2,
        createdApp.screen.height / 2,
      );
      createdApp.stage.addChild(player);

      const clampPlayer = () => {
        if (!player || !app) {
          return;
        }
        player.clamp(app.screen.width, app.screen.height);
      };

      handlePointerDown = (event: FederatedPointerEvent) => {
        if (player) {
          player.handlePointerDown(event);
          clampPlayer();
        }
      };

      createdApp.stage.eventMode = "static";
      createdApp.stage.hitArea = createdApp.screen;
      createdApp.stage.addEventListener("pointerdown", handlePointerDown);

      window.addEventListener("keydown", onKeyDown, { passive: false });
      window.addEventListener("keyup", onKeyUp);

      const move = () => {
        if (!player) {
          return;
        }
        const moved = player.move(keys);
        if (moved) {
          clampPlayer();
        }
      };

      moveTicker = move;
      createdApp.ticker.add(move);

      onResize = () => {
        if (!app) {
          return;
        }
        app.renderer.resize(window.innerWidth, window.innerHeight);
        clampPlayer();
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
        if (player) {
          app.stage.removeChild(player);
          player.destroy();
          player = null;
        }
        app.destroy(true);
        app = null;
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full"></div>;
}







