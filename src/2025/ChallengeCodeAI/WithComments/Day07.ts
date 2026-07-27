export const Day07 = (input: string[]): void => {
  // The single S in the first row is where the beam starts, travelling down.
  const startCol: number = input[0].indexOf('S');

  // Grid width, so beams/timelines that leave the grid on a split are dropped
  // from further travel (they've still "happened" for the timeline count).
  const width: number = Math.max(...input.map(line => line.length));

  // Part 1 (unchanged): number of split events, where beams sharing a column
  // are treated as one. We de-duplicate columns each row via the map's keys.
  let splitCount: number = 0;

  // Part 2: number of distinct timelines. Timelines are NOT merged — two beams
  // that reach the same column through different histories are different
  // timelines. The count grows like 2^(rows of splits), so use BigInt to keep
  // precision. columnTimelines[col] = how many timelines currently sit in col.
  let columnTimelines: Map<number, bigint> = new Map<number, bigint>([[startCol, 1n]]);
  let totalTimelines: bigint = 1n;

  // Walk down row by row. Row 0 holds S, so beams first enter row 1.
  for (let row: number = 1; row < input.length; row++) {
    const line: string = input[row];
    const nextTimelines: Map<number, bigint> = new Map<number, bigint>();

    // Carry `count` timelines into a column for the next row, dropping any that
    // would leave the grid (those timelines already exist, they just escape).
    const carry = (col: number, count: bigint): void => {
      if (col < 0 || col >= width) return;
      nextTimelines.set(col, (nextTimelines.get(col) ?? 0n) + count);
    };

    for (const [col, count] of columnTimelines) {
      const cell: string = col < line.length ? line[col] : '.';

      if (cell === '^') {
        // Part 1: one split event per occupied column (merged view).
        splitCount++;
        // Part 2: each of `count` timelines branches into two, so the total
        // number of timelines grows by `count` (one becomes two, net +count).
        totalTimelines += count;
        // Both branches continue down the neighbouring columns.
        carry(col - 1, count);
        carry(col + 1, count);
      } else {
        // Open space: the timelines in this column continue straight down.
        carry(col, count);
      }
    }

    columnTimelines = nextTimelines;
  }

  console.log(`Total beam splits: ${splitCount}`);
  console.log(`Total possible timelines: ${totalTimelines}`);
};
