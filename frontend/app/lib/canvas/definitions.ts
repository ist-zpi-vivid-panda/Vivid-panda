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
  Rotation = 'ROTATION',
  Zoom = 'ZOOM',
  Crop = 'CROP',
  Move = 'MOVE',
  Filter = 'FILTER',
  Wand = 'WAND',
}

export type ChangeHistory = {
  handleUndo: () => void;
  handleRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

export type CanvasCRUDOperations = {
  handleSave: () => void;
  handleDelete: () => void;
  handleDownload: () => void;
};
