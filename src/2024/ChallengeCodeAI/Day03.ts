export const Day03 = (input: string[]): void => {
  const INSTRUCTION_PATTERN: RegExp = /mul\((\d{1,3}),(\d{1,3})\)|don't\(\)|do\(\)/g;

  let total: number = 0;
  let enabledTotal: number = 0;

  let enabled: boolean = true;

  for (const line of input) {
    for (const match of line.matchAll(INSTRUCTION_PATTERN)) {
      if (match[0] === 'do()') {
        enabled = true;
        continue;
      }

      if (match[0] === "don't()") {
        enabled = false;
        continue;
      }

      const product: number = Number(match[1]) * Number(match[2]);

      total += product;
      if (enabled) enabledTotal += product;
    }
  }

  console.log(`Sum of valid mul instructions: ${total}`);
  console.log(`Sum of enabled mul instructions: ${enabledTotal}`);
};
