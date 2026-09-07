export const Day04 = (input: string[]): void => {
  const grid: string[] = input.map((line: string) => line.trim()).filter((line: string) => line.length > 0);

  const rows: number = grid.length;
  const cols: number = rows > 0 ? grid[0].length : 0;

  const WORD: string = 'XMAS';

  const LAST: number = WORD.length - 1;

  const DIRECTIONS: readonly (readonly [number, number])[] = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];

  const isMasPair = (first: string, second: string): boolean =>
    (first === 'M' && second === 'S') || (first === 'S' && second === 'M');

  let xmasCount: number = 0;
  let crossCount: number = 0;

  for (let row: number = 0; row < rows; row++) {
    for (let col: number = 0; col < cols; col++) {
      const letter: string = grid[row][col];

      if (letter === WORD[0]) {
        for (const [rowStep, colStep] of DIRECTIONS) {
          const endRow: number = row + rowStep * LAST;
          const endCol: number = col + colStep * LAST;

          if (endRow < 0 || endRow >= rows || endCol < 0 || endCol >= cols) continue;

          let matched: boolean = true;

          for (let step: number = 1; step <= LAST; step++) {
            if (grid[row + rowStep * step][col + colStep * step] !== WORD[step]) {
              matched = false;
              break;
            }
          }

          if (matched) xmasCount++;
        }
      } else if (letter === 'A') {
        if (row === 0 || col === 0 || row === rows - 1 || col === cols - 1) continue;

        const crossesHere: boolean =
          isMasPair(grid[row - 1][col - 1], grid[row + 1][col + 1]) &&
          isMasPair(grid[row - 1][col + 1], grid[row + 1][col - 1]);

        if (crossesHere) crossCount++;
      }
    }
  }

  console.log(`XMAS occurrences: ${xmasCount}`);
  console.log(`X-MAS crosses: ${crossCount}`);
};
