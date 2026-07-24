export const Day02 = (input: string[]) => {
  const line = (input[0] || '').trim();
  if (!line) {
    console.log(`Sum of Invalid IDs: 0`);
    console.log(`True Sum of all Invalid IDs: 0`);
    return { sum: 0, trueSum: 0 };
  }

  const ranges = line.split(',').map(part => {
    const [start, end] = part.trim().split('-').map(Number);
    return { start, end };
  });

  // -------- Previous result: even-length numbers whose first half equals the
  // second half. That number is exactly H * (10^k + 1), where H is the k-digit
  // first half (H from 10^(k-1) to 10^k - 1). E.g. H=123 -> 123 * 1001 = 123123.
  const halfEqualIds = new Set<number>();
  let sum = 0;

  for (const { start, end } of ranges) {
    const minLen = String(start).length;
    const maxLen = String(end).length;

    for (let len = minLen; len <= maxLen; len++) {
      if (len % 2 !== 0) continue;

      const half = len / 2;
      const halfMin = Math.pow(10, half - 1);
      const halfMax = Math.pow(10, half) - 1;
      const multiplier = Math.pow(10, half) + 1;

      for (let h = halfMin; h <= halfMax; h++) {
        const candidate = h * multiplier;
        if (candidate >= start && candidate <= end && !halfEqualIds.has(candidate)) {
          halfEqualIds.add(candidate);
          sum += candidate;
        }
      }
    }
  }

  // -------- True result: any number built by repeating a shorter digit block
  // 2+ times (e.g. 123123123, 1212121212, 111). A length-L number is such a
  // repeat when L has a divisor d < L; the pattern P (d digits) repeated r = L/d
  // times equals P * M, where M = 1 + 10^d + 10^(2d) + ... + 10^((r-1)d).
  // We solve for the valid P directly from the range instead of scanning numbers.
  const repeatingIds = new Set<number>();
  let trueSum = 0;

  for (const { start, end } of ranges) {
    const minLen = String(start).length;
    const maxLen = String(end).length;

    for (let len = minLen; len <= maxLen; len++) {
      for (let d = 1; d <= len / 2; d++) {
        if (len % d !== 0) continue; // pattern must tile the length exactly
        const r = len / d;

        // M = repeated-ones multiplier for a d-digit block repeated r times.
        let multiplier = 0;
        for (let i = 0; i < r; i++) multiplier += Math.pow(10, d * i);

        const patternMin = Math.pow(10, d - 1); // no leading zero
        const patternMax = Math.pow(10, d) - 1;

        // Constrain the pattern to values whose repeat lands inside [start, end].
        const low = Math.max(patternMin, Math.ceil(start / multiplier));
        const high = Math.min(patternMax, Math.floor(end / multiplier));

        for (let p = low; p <= high; p++) {
          const candidate = p * multiplier;
          if (candidate >= start && candidate <= end && !repeatingIds.has(candidate)) {
            repeatingIds.add(candidate);
            trueSum += candidate;
          }
        }
      }
    }
  }

  console.log(`Sum of Invalid IDs: ${sum}`);
  console.log(`True Sum of all Invalid IDs: ${trueSum}`);
  return { sum, trueSum };
}
