export const Day02 = (input: string[]): void => {
  const isSafe = (levels: number[]): boolean => {
    if (levels.length < 2) return true;

    const increasing: boolean = levels[1] > levels[0];

    for (let i: number = 1; i < levels.length; i++) {
      const step: number = increasing
        ? levels[i] - levels[i - 1]
        : levels[i - 1] - levels[i];

      if (step < 1 || step > 3) return false;
    }

    return true;
  };

  const isSafeWithDampener = (levels: number[]): boolean => {
    for (let removed: number = 0; removed < levels.length; removed++) {
      if (isSafe(levels.filter((_, index: number) => index !== removed))) return true;
    }

    return false;
  };

  let safeCount: number = 0;
  let dampenedSafeCount: number = 0;

  for (const line of input) {
    const trimmed: string = line.trim();
    if (trimmed.length === 0) continue;

    const levels: number[] = trimmed.split(' ').map(Number);

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
