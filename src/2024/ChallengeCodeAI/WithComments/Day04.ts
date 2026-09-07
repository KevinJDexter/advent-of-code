export const Day04 = (input: string[]): void => {
  // Trim is safe here: the grid alphabet contains no spaces, so no meaningful
  // character can be lost, and it strips \r from CRLF-terminated files.
  const grid: string[] = input.map((line: string) => line.trim()).filter((line: string) => line.length > 0);

  const rows: number = grid.length;
  const cols: number = rows > 0 ? grid[0].length : 0;

  const WORD: string = 'XMAS';

  // Offset of the word's final letter from its first, used for both the bounds
  // check and the scan length.
  const LAST: number = WORD.length - 1;

  // "Any direction" means the eight compass headings. Reversed spellings need no
  // special handling: a backwards XMAS read left-to-right is the same cells read
  // right-to-left, which is simply the [0, -1] heading starting from the other
  // end. Enumerating all eight from each X covers forwards and backwards once
  // each, with no double counting.
  const DIRECTIONS: readonly (readonly [number, number])[] = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], /*  X  */ [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];

  // Part two: an X-MAS is two MAS strokes crossing at a shared centre. A
  // diagonal pair spells MAS in one direction or the other exactly when the two
  // outer cells are an M and an S in either order — the centre A is already
  // known, so there is nothing else to test.
  const isMasPair = (first: string, second: string): boolean =>
    (first === 'M' && second === 'S') || (first === 'S' && second === 'M');

  let xmasCount: number = 0;
  let crossCount: number = 0;

  for (let row: number = 0; row < rows; row++) {
    for (let col: number = 0; col < cols; col++) {
      const letter: string = grid[row][col];

      // The two parts anchor on different letters, so a single traversal serves
      // both and the branches are naturally mutually exclusive.
      if (letter === WORD[0]) {
        for (const [rowStep, colStep] of DIRECTIONS) {
          const endRow: number = row + rowStep * LAST;
          const endCol: number = col + colStep * LAST;

          // Because the walk is a straight line, checking only the far endpoint
          // proves every intermediate cell is in bounds too. That is one bounds
          // test per direction instead of one per letter, and it means the inner
          // loop can index the grid without any further guarding.
          if (endRow < 0 || endRow >= rows || endCol < 0 || endCol >= cols) continue;

          let matched: boolean = true;

          // Start at 1: the first letter was already confirmed by the anchor check.
          for (let step: number = 1; step <= LAST; step++) {
            if (grid[row + rowStep * step][col + colStep * step] !== WORD[step]) {
              matched = false;
              break;
            }
          }

          if (matched) xmasCount++;
        }
      } else if (letter === 'A') {
        // A cross needs all four diagonal neighbours, so its centre can never sit
        // on an edge. One combined test rules those out before any indexing.
        if (row === 0 || col === 0 || row === rows - 1 || col === cols - 1) continue;

        // Anchoring on the centre rather than on an M is what keeps this simple:
        // each X-MAS has exactly one centre, so every cross is found exactly once
        // and no de-duplication is needed. Anchoring on the arms would find each
        // cross twice, once per stroke.
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
