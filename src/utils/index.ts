export const interleave: <T>(x: T[], y: T) => T[] = (x, y) => {
  const result = [];
  for (let i = 0; i < x.length; i++) {
    result.push(x[i]);
    if (i < x.length - 1) {
      result.push(y);
    }
  }
  return result;
};
