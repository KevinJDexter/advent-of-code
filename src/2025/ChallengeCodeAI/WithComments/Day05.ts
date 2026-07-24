export const Day05 = (input: string[]): void => {
  const ranges: [number, number][] = [];
  const ingredients: number[] = [];

  // Classify each line: ranges contain a '-', standalone ingredients do not
  for (const rawLine of input) {
    const line: string = rawLine.trim();
    if (line === '') continue;

    if (line.includes('-')) {
      const [start, end] = line.split('-').map(Number);
      ranges.push([start, end]);
    } else {
      ingredients.push(Number(line));
    }
  }

  // Sort ranges by start value, then merge overlapping ranges for fast lookup
  ranges.sort((a, b) => a[0] - b[0]);
  const mergedRanges: [number, number][] = [];
  for (const [start, end] of ranges) {
    const last = mergedRanges[mergedRanges.length - 1];
    if (last && start <= last[1] + 1) {
      last[1] = Math.max(last[1], end);
    } else {
      mergedRanges.push([start, end]);
    }
  }

  // Binary search to check if a number falls in any merged range
  const isFresh = (num: number): boolean => {
    let low: number = 0;
    let high: number = mergedRanges.length - 1;
    while (low <= high) {
      const mid: number = (low + high) >> 1;
      const [start, end] = mergedRanges[mid];
      if (num < start) {
        high = mid - 1;
      } else if (num > end) {
        low = mid + 1;
      } else {
        return true;
      }
    }
    return false;
  };

  // Count how many ingredients fall in at least one range (each counted once)
  let freshCount: number = 0;
  for (const num of ingredients) {
    if (isFresh(num)) freshCount++;
  }

  // Count total fresh ingredients represented by the ranges (union of ranges).
  // Merged ranges are non-overlapping, so summing each span gives the union size.
  let totalFresh: number = 0;
  for (const [start, end] of mergedRanges) {
    totalFresh += end - start + 1;
  }

  console.log(`Fresh ingredients: ${freshCount}`);
  console.log(`Total fresh ingredients (union of ranges): ${totalFresh}`);
};
