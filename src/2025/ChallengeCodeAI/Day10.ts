export const Day10 = (input: string[]): void => {
  const enumerateSubsets = (
    arr: bigint[],
    sink: (xorValue: bigint, count: number) => void,
  ): void => {
    const m: number = arr.length;
    let xorValue: bigint = 0n;
    let count: number = 0;
    sink(xorValue, count);
    let prevGray: number = 0;
    for (let i: number = 1; i < (1 << m); i++) {
      const gray: number = i ^ (i >> 1);
      const changedBit: number = Math.log2(gray ^ prevGray) | 0;
      xorValue ^= arr[changedBit];
      if ((gray >> changedBit) & 1) count++; else count--;
      sink(xorValue, count);
      prevGray = gray;
    }
  };

  const minPresses = (buttons: bigint[], target: bigint): number => {
    const half: number = buttons.length >> 1;
    const firstHalf: bigint[] = buttons.slice(0, half);
    const secondHalf: bigint[] = buttons.slice(half);

    const bestByXor: Map<bigint, number> = new Map<bigint, number>();
    enumerateSubsets(firstHalf, (xorValue, count) => {
      const prev: number | undefined = bestByXor.get(xorValue);
      if (prev === undefined || count < prev) bestByXor.set(xorValue, count);
    });

    let best: number = Infinity;
    enumerateSubsets(secondHalf, (xorValue, count) => {
      const needed: bigint = target ^ xorValue;
      const other: number | undefined = bestByXor.get(needed);
      if (other !== undefined && count + other < best) best = count + other;
    });
    return best;
  };

  let total: number = 0;

  for (const line of input) {
    const trimmed: string = line.trim();
    if (trimmed === '') continue;

    const tokens: string[] = trimmed.split(/\s+/);
    let target: bigint = 0n;
    const buttons: bigint[] = [];

    for (const token of tokens) {
      if (token[0] === '[') {
        const pattern: string = token.slice(1, -1);
        for (let i: number = 0; i < pattern.length; i++) {
          if (pattern[i] === '#') target |= (1n << BigInt(i));
        }
      } else if (token[0] === '(') {
        const indices: string = token.slice(1, -1);
        let mask: bigint = 0n;
        for (const part of indices.split(',')) {
          mask |= (1n << BigInt(Number(part)));
        }
        buttons.push(mask);
      }
    }

    const result: number = minPresses(buttons, target);
    if (result !== Infinity) total += result;
  }

  console.log(`Sum of minimum button presses: ${total}`);
};
