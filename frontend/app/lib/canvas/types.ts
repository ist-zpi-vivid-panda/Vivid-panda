export type MouseInfo = {
  x: number;
  y: number;
  angle: number;
};

export type RepeatableCanvasAction = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  image: HTMLImageElement;
};

export type CanvasAction = RepeatableCanvasAction & {
  x: number;
  y: number;
  angle: number;
};

export enum EditingTool {
  Rotation,
}
