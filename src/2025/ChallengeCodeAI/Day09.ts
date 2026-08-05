export const Day09 = (input: string[]): void => {
  const tiles: number[][] = input
    .filter(line => line.trim() !== '')
    .map(line => line.split(',').map(Number));
  const n: number = tiles.length;

  let largestArea: number = 0;

  for (let i: number = 0; i < n; i++) {
    for (let j: number = i + 1; j < n; j++) {
      const width: number = Math.abs(tiles[i][0] - tiles[j][0]) + 1;
      const height: number = Math.abs(tiles[i][1] - tiles[j][1]) + 1;
      const area: number = width * height;
      if (area > largestArea) largestArea = area;
    }
  }

  console.log(`Largest rectangle area: ${largestArea}`);
};
