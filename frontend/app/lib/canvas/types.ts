export type MouseInfo = {
  x: number;
  y: number;
  angle: number;
};

export type CanvasAction = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  image: HTMLImageElement;
  x: number;
  y: number;
  angle: number;
};

export enum EditingTool {
  Rotation,
}
