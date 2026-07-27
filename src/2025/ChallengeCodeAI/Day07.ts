export const Day07 = (input: string[]): void => {
  const startCol: number = input[0].indexOf('S');

  const width: number = Math.max(...input.map(line => line.length));

  let splitCount: number = 0;

  let columnTimelines: Map<number, bigint> = new Map<number, bigint>([[startCol, 1n]]);
  let totalTimelines: bigint = 1n;

  for (let row: number = 1; row < input.length; row++) {
    const line: string = input[row];
    const nextTimelines: Map<number, bigint> = new Map<number, bigint>();

    const carry = (col: number, count: bigint): void => {
      if (col < 0 || col >= width) return;
      nextTimelines.set(col, (nextTimelines.get(col) ?? 0n) + count);
    };

    for (const [col, count] of columnTimelines) {
      const cell: string = col < line.length ? line[col] : '.';

      if (cell === '^') {
        splitCount++;
        totalTimelines += count;
        carry(col - 1, count);
        carry(col + 1, count);
      } else {
        carry(col, count);
      }
    }

    columnTimelines = nextTimelines;
  }

  console.log(`Total beam splits: ${splitCount}`);
  console.log(`Total possible timelines: ${totalTimelines}`);
};
