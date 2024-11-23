const SIZES = Object.freeze(['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'] as const);
const MULT = 1024 as const;

export const formatBytes = (bytes: number, decimals: number = 2): string => {
  // != checks if number is NaN or 0
  if (!+bytes) {
    return `0 ${SIZES[0]}`;
  }

  const dm = decimals < 0 ? 0 : decimals;

  const i = Math.floor(Math.log(bytes) / Math.log(MULT));

  return `${parseFloat((bytes / Math.pow(MULT, i)).toFixed(dm))} ${SIZES[i]}`;
};
