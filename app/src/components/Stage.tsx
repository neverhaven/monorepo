import { MouseEventHandler, ReactElement, useEffect, useRef, useState } from 'react';
import { styled } from '../styled';

export interface IStageSprite {
  update(): void;
  draw(ctx: CanvasRenderingContext2D, x: number, y: number): void;
}

export interface IStageObject {
  x: number;
  y: number;
  sprite: IStageSprite;
}

export interface IStageProps {
  className?: string;
  framerate?: number;
  paused?: boolean;
  objects: IStageObject[];
  onClick?: MouseEventHandler<HTMLDivElement>;
}

function StageBase({ className, framerate = 15, paused = false, objects, onClick }: IStageProps): ReactElement {
  const objectsRef = useRef<IStageObject[]>([]);
  const [div, setDiv] = useState<HTMLDivElement | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    objectsRef.current = objects;
  }, [objects]);

  useEffect(() => {
    if (canvas != null) {
      canvas.width = 0;
      canvas.height = 0;
    }
  }, [canvas]);

  useEffect(() => {
    if (div == null || canvas == null) {
      return;
    }

    const ctx = canvas.getContext('2d');

    if (ctx == null) {
      setCanvas(() => {
        throw Error('Failed getting 2d context from canvas');
      });

      return;
    }

    const handle = setInterval(() => {
      canvas.width = div.clientWidth;
      canvas.height = div.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      objectsRef.current
        .slice()
        .sort((a, b) => b.y - a.y || b.x - a.x)
        .forEach(({ sprite, x, y }) => {
          if (!paused) {
            sprite.update();
          }
          sprite.draw(ctx, x, y);
        });
    }, 1000 / Math.max(1, framerate));

    return () => clearInterval(handle);
  }, [paused, framerate, div, canvas]);

  return (
    <div ref={setDiv} className={className} onClick={onClick}>
      <canvas ref={setCanvas} />
    </div>
  );
}

export const Stage = styled(StageBase, 'Stage')`
  position: relative;
  overflow: hidden;
  margin: 0;
  padding: 0;
  border: none;
  height: 100%;
  width: 100%;

  & > canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
`;
