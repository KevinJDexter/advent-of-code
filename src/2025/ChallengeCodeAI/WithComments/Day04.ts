export const Day04 = (input: string[]): void => {
  const grid: string[][] = input.map(line => line.split(''));
  const rows: number = grid.length;
  const cols: number = rows > 0 ? grid[0].length : 0;
  let initiallyAccessible: number = 0;
  let totalRemoved: number = 0;

  // All 8 adjacent directions (including diagonals)
  const directions: number[][] = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  const processRound = (): number => {
    const toRemove: [number, number][] = [];

    // Identify all accessible rolls (3 or fewer neighbors)
    for (let r: number = 0; r < rows; r++) {
      for (let c: number = 0; c < cols; c++) {
        if (grid[r][c] === '@') {
          let neighborCount: number = 0;

          // Count adjacent @ symbols
          for (const [dr, dc] of directions) {
            const nr: number = r + dr;
            const nc: number = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === '@') {
              neighborCount++;
            }
          }

          // Mark for removal if accessible
          if (neighborCount <= 3) {
            toRemove.push([r, c]);
          }
        }
      }
    }

    // Remove marked rolls
    for (const [r, c] of toRemove) {
      grid[r][c] = '.';
    }

    return toRemove.length;
  };

  // Initial pass
  initiallyAccessible = processRound();
  console.log(`Paper rolls accessible by forklift: ${initiallyAccessible}`);
  totalRemoved += initiallyAccessible;

  // Recursive removal until no more can be removed
  while (true) {
    const removed: number = processRound();
    if (removed === 0) break;
    totalRemoved += removed;
  }

  console.log(`Total paper rolls removed: ${totalRemoved}`);
};
