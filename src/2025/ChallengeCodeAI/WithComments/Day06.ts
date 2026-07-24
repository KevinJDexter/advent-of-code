export const Day06 = (input: string[]): void => {
  // Drop any blank lines so parsing isn't thrown off by trailing whitespace
  const lines: string[] = input.filter(line => line.trim() !== '');
  if (lines.length === 0) {
    console.log(`Worksheet total: 0`);
    console.log(`Corrected worksheet total: 0`);
    return;
  }

  const operatorLine: string = lines[lines.length - 1];
  const numberLines: string[] = lines.slice(0, lines.length - 1);

  // ---- Original logic: read numbers horizontally, one token per column ----
  // Splitting on whitespace ignores the varying spacing and gives one token
  // per column, so column index == token index across all rows.
  const operators: string[] = operatorLine.trim().split(/\s+/);
  const numberRows: number[][] = numberLines
    .map(line => line.trim().split(/\s+/).map(Number));

  let worksheetTotal: number = 0;
  for (let col: number = 0; col < operators.length; col++) {
    const isMultiply: boolean = operators[col] === '*';
    let columnResult: number = isMultiply ? 1 : 0;
    for (const row of numberRows) {
      const value: number = row[col];
      if (isMultiply) {
        columnResult *= value;
      } else {
        columnResult += value;
      }
    }
    worksheetTotal += columnResult;
  }
  console.log(`Worksheet total: ${worksheetTotal}`);

  // ---- Corrected logic: read each block vertically, character-column by
  // character-column. Within a block, every character column forms one number
  // by stacking its digits top-to-bottom, and the block's operator is applied
  // across those numbers. Blocks are separated by all-space character columns.
  const width: number = Math.max(...lines.map(line => line.length));

  // A character column is a separator when every number row has a space there
  const isSeparator = (charCol: number): boolean => {
    for (const line of numberLines) {
      const ch: string = charCol < line.length ? line[charCol] : ' ';
      if (ch !== ' ') return false;
    }
    return true;
  };

  let correctedTotal: number = 0;
  let charCol: number = 0;
  while (charCol < width) {
    if (isSeparator(charCol)) {
      charCol++;
      continue;
    }

    // Start of a block; extend to the next separator (or the end)
    let blockEnd: number = charCol;
    while (blockEnd < width && !isSeparator(blockEnd)) {
      blockEnd++;
    }

    // The block's operator is the +/* on the operator line within its range
    let isMultiply: boolean = false;
    for (let c: number = charCol; c < blockEnd; c++) {
      const ch: string = c < operatorLine.length ? operatorLine[c] : ' ';
      if (ch === '+' || ch === '*') {
        isMultiply = ch === '*';
        break;
      }
    }

    // Each character column in the block is one number (digits top-to-bottom)
    let blockResult: number = isMultiply ? 1 : 0;
    for (let c: number = charCol; c < blockEnd; c++) {
      let digits: string = '';
      for (const line of numberLines) {
        const ch: string = c < line.length ? line[c] : ' ';
        if (ch !== ' ') digits += ch;
      }
      if (digits === '') continue;
      const value: number = Number(digits);
      if (isMultiply) {
        blockResult *= value;
      } else {
        blockResult += value;
      }
    }

    correctedTotal += blockResult;
    charCol = blockEnd;
  }

  console.log(`Corrected worksheet total: ${correctedTotal}`);
};
