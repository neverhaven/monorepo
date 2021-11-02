import { getImageData } from '../utilities/getImageData';

export type AnimationFrames<TAnimationNames extends string | number | symbol> =
  | number
  | readonly (number | TAnimationNames)[];

export type Animation<TAnimationNames extends string | number | symbol> =
  | AnimationFrames<TAnimationNames>
  | {
      readonly frames: AnimationFrames<TAnimationNames>;
      readonly speed?: number;
      readonly loop?: boolean;
    };

export type Animations<TKeys extends string | number | symbol> = Readonly<Record<TKeys, Animation<TKeys>>>;

type ResolvedAnimations<TKeys extends string | number | symbol> = Readonly<Record<TKeys, readonly number[]>>;

export type SpriteVector = readonly [x: number, y: number];

export interface ISpriteOptions<TAnimations extends Animations<keyof TAnimations>> {
  offset?: SpriteVector;
  layout?: SpriteVector;
  animations?: TAnimations;
}

export class Sprite<TAnimations extends Animations<keyof TAnimations>> {
  readonly #offset: SpriteVector;
  readonly #layout: SpriteVector;
  readonly #animations: ResolvedAnimations<keyof TAnimations>;

  #image: ImageData | null = null;
  #frames: readonly number[] = [0];
  #loop = false;
  #speed = 1;
  #tick = 0;
  #index = 0;

  constructor(
    image: string | Promise<ImageData> | ImageData,
    { offset = [0, 0], layout = [1, 1], animations }: ISpriteOptions<TAnimations> = {},
  ) {
    if (image instanceof ImageData) {
      this.#image = image;
    } else {
      (typeof image === 'string' ? getImageData(image) : image).then((value) => {
        this.#image = value;
      });
    }

    this.#offset = [...offset];
    this.#layout = [Math.max(1, layout[0]), Math.max(1, layout[1])];
    this.#animations = resolveAnimations(animations ?? ({} as TAnimations));
  }

  setAnimation(animation: Animation<keyof TAnimations>): void {
    let frames: readonly (number | keyof TAnimations)[];
    let loop: boolean;
    let speed: number;

    if (typeof animation === 'number') {
      frames = [animation];
      loop = false;
      speed = 1;
    } else if (animation instanceof Array) {
      frames = animation;
      loop = false;
      speed = 1;
    } else {
      frames = typeof animation.frames === 'number' ? [animation.frames] : animation.frames;
      loop = animation.loop === true;
      speed = Math.max(0, animation.speed ?? 1);
    }

    this.#frames = frames.reduce<readonly number[]>(
      (acc, value) => [...acc, ...(typeof value === 'number' ? [value] : this.#animations[value] ?? [])],
      [],
    );
    this.#loop = loop;
    this.#speed = speed;
  }

  update(): void {
    //
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    if (this.#image == null) {
      return;
    }
  }
}

function resolveAnimations<TAnimations extends Animations<keyof TAnimations>>(
  animations: TAnimations,
): ResolvedAnimations<keyof TAnimations> {
  const resolved = {} as Record<keyof TAnimations, number[]>;
  const keys = Object.keys(animations) as (keyof TAnimations)[];

  function resolveRecursive(key: keyof TAnimations): void {
    if (key in resolved) {
      return;
    }

    const animation: number[] = (resolved[key] = []);
    const source = animations[key];
    const array = (source instanceof Array ? source : [source]) as readonly (number | keyof TAnimations)[];

    for (const value of array) {
      if (typeof value === 'number') {
        animation.push(value);
      } else {
        if (!(value in resolved)) {
          resolveRecursive(value);
        }

        animation.push(...resolved[key]);
      }
    }
  }

  for (const key of keys) {
    resolveRecursive(key);
  }

  return resolved;
}
