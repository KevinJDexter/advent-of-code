export const Day05 = (input: string[]): void => {
  const ruleLines: string[] = [];
  const updateLines: string[] = [];

  for (const line of input) {
    const trimmed: string = line.trim();
    if (trimmed.length === 0) continue;

    if (trimmed.includes('|')) ruleLines.push(trimmed);
    else updateLines.push(trimmed);
  }

  const rules: Set<string> = new Set<string>();

  for (const line of ruleLines) {
    const [left, right] = line.split('|').map(Number);
    rules.add(`${left}|${right}`);
  }

  const isCorrectlyOrdered = (pages: number[]): boolean => {
    for (let earlier: number = 0; earlier < pages.length - 1; earlier++) {
      for (let later: number = earlier + 1; later < pages.length; later++) {
        if (rules.has(`${pages[later]}|${pages[earlier]}`)) return false;
      }
    }

    return true;
  };

  const compareByRule = (first: number, second: number): number => {
    if (rules.has(`${first}|${second}`)) return -1;
    if (rules.has(`${second}|${first}`)) return 1;

    return 0;
  };

  let middleSum: number = 0;
  let fixedMiddleSum: number = 0;

  for (const line of updateLines) {
    const pages: number[] = line.split(',').map(Number);

    const middle: number = pages.length >> 1;

    if (isCorrectlyOrdered(pages)) {
      middleSum += pages[middle];
    } else {
      pages.sort(compareByRule);
      fixedMiddleSum += pages[middle];
    }
  }

  console.log(`Sum of middle pages of correctly ordered updates: ${middleSum}`);
  console.log(`Sum of middle pages of reordered updates: ${fixedMiddleSum}`);
};
