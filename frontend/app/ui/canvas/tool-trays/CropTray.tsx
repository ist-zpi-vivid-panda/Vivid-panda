type CropTrayProps = { handleCrop: () => void };

const CropTray = ({ handleCrop }: CropTrayProps) => {
  return (
    <div>
      <button onClick={handleCrop}>Crop</button>
    </div>
  );
};

export default CropTray;
