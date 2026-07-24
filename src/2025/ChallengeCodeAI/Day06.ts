export const Day06 = (input: string[]): void => {
  const lines: string[] = input.filter(line => line.trim() !== '');
  if (lines.length === 0) {
    console.log(`Worksheet total: 0`);
    console.log(`Corrected worksheet total: 0`);
    return;
  }

  const operatorLine: string = lines[lines.length - 1];
  const numberLines: string[] = lines.slice(0, lines.length - 1);

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

  const width: number = Math.max(...lines.map(line => line.length));

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

    let blockEnd: number = charCol;
    while (blockEnd < width && !isSeparator(blockEnd)) {
      blockEnd++;
    }

    let isMultiply: boolean = false;
    for (let c: number = charCol; c < blockEnd; c++) {
      const ch: string = c < operatorLine.length ? operatorLine[c] : ' ';
      if (ch === '+' || ch === '*') {
        isMultiply = ch === '*';
        break;
      }
    }

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
