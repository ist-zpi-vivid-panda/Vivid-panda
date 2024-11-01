'use client';

import { SetStateAction } from 'react';

type RotationTrayProps = {
  rotationStep: number;
  setRotation: (_: SetStateAction<number>) => void;
  currentRotation: number;
  defaultRotation: number;
};

const RotationTray = ({ rotationStep, setRotation, currentRotation, defaultRotation }: RotationTrayProps) => {
  return (
    <div>
      <span>Rotation: {currentRotation}</span>

      <div className="flex-row">
        <button onClick={() => setRotation((prev) => prev + rotationStep)}>Rotate by {rotationStep}°</button>

        <button onClick={() => setRotation(defaultRotation)}>reset</button>

        <button onClick={() => setRotation((prev) => prev - rotationStep)}>Rotate by -{rotationStep}°</button>
      </div>
    </div>
  );
};

export default RotationTray;
