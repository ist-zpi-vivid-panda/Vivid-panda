'use client';

import { SetStateAction } from 'react';

type ZoomTrayProps = {
  zoomStep: number;
  setZoom: (_: SetStateAction<number>) => void;
  currentZoom: number;
  defaultZoom: number;
};

const ZoomTray = ({ zoomStep, setZoom, currentZoom, defaultZoom }: ZoomTrayProps) => {
  return (
    <div>
      <span>Zoom: {currentZoom}</span>

      <div className="flex-row">
        <button onClick={() => setZoom((prev) => prev + zoomStep)}>+</button>

        <button onClick={() => setZoom(defaultZoom)}>reset</button>

        <button onClick={() => setZoom((prev) => prev - zoomStep)}>-</button>
      </div>
    </div>
  );
};

export default ZoomTray;
