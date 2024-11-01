type Enum<E> = Record<keyof E, number | string> & { [k: number]: number | string };

const getEnumKeys = <E extends Enum<E>>(enumObj: E): (keyof E)[] => {
  const keys = Object.keys(enumObj);

  if (keys.length % 2 !== 0) {
    return keys as (keyof E)[];
  }

  return Object.keys(enumObj).filter((item) => isNaN(Number(item))) as (keyof E)[];
};

export const getEnumValues = <E extends Enum<E>>(enumObj: E): E[keyof E][] =>
  getEnumKeys(enumObj).map((key) => enumObj[key]) as E[keyof E][];
