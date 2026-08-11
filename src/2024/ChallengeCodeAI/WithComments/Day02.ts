export const Day02 = (input: string[]): void => {
  // A report is safe when every step moves the same direction by 1, 2, or 3.
  //
  // The three failure modes the instructions call out — a gap larger than 3, a
  // repeated value, and a switch between increasing and decreasing — all reduce
  // to a single range check if we normalize the step's sign first. Decide the
  // direction from the first pair, then measure every step *in that direction*:
  //
  //   gap too large   -> step > 3
  //   repeated value  -> step === 0
  //   direction flip  -> step < 0
  //
  // So `1 <= step <= 3` is the whole rule, and one comparison catches all three.
  const isSafe = (levels: number[]): boolean => {
    // Fewer than two levels means there are no steps to violate anything.
    if (levels.length < 2) return true;

    const increasing: boolean = levels[1] > levels[0];

    for (let i: number = 1; i < levels.length; i++) {
      // Subtract in whichever order makes a valid step positive, so the check
      // below is identical for increasing and decreasing reports.
      const step: number = increasing
        ? levels[i] - levels[i - 1]
        : levels[i - 1] - levels[i];

      // Bail on the first bad step; most unsafe reports fail early, so there is
      // no reason to score the rest of the row.
      if (step < 1 || step > 3) return false;
    }

    return true;
  };

  // Part two: the Problem Dampener rescues a report if deleting any single level
  // makes it safe. We try each removal and stop at the first one that works.
  //
  // This is O(rowLength^2) per rescued row, which sounds wasteful but is not:
  // rows are single digits long, and the sweep only runs on reports that already
  // failed. See the notes in AiInstructions/Day02.md for the linear alternative
  // and why it is not worth the complexity here.
  const isSafeWithDampener = (levels: number[]): boolean => {
    for (let removed: number = 0; removed < levels.length; removed++) {
      if (isSafe(levels.filter((_, index: number) => index !== removed))) return true;
    }

    return false;
  };

  let safeCount: number = 0;
  let dampenedSafeCount: number = 0;

  for (const line of input) {
    // Trim guards against trailing whitespace and \r from CRLF-terminated files.
    const trimmed: string = line.trim();
    if (trimmed.length === 0) continue;

    const levels: number[] = trimmed.split(' ').map(Number);

    // An already-safe report also counts under the dampener, and short-circuits
    // the removal sweep entirely.
    if (isSafe(levels)) {
      safeCount++;
      dampenedSafeCount++;
    } else if (isSafeWithDampener(levels)) {
      dampenedSafeCount++;
    }
  }

  console.log(`Safe reports: ${safeCount}`);
  console.log(`Safe reports with the Problem Dampener: ${dampenedSafeCount}`);
};
