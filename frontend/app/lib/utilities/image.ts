// manual conversion doesn't seem to work
// export const convertImageDataToImageStr = (imageData: ImageData) => {
//     let binary = '';
//     for (let idx = 0; idx < imageData.data.length; ++idx) {
//       // += is the fastest way to concatenate strings in js
//       binary += String.fromCharCode(imageData.data[idx]);
//     }

//     const base64Image = btoa(binary);

//     return `data:image/png;base64,${base64Image}`;
//   };

export const convertImageDataToImageStr = (imageData: ImageData) => {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d');
  ctx?.putImageData(imageData, 0, 0);

  return canvas.toDataURL();
};
