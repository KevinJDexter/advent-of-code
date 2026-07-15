export const Day01 = (input: string[]) => {
  console.log("Day1");
  let dialPosition = 50;
  let result = 0;
  let round2Result = 0;
  input.forEach((line, i) => {
    const number = Number(line.slice(1));
    if (line[0] === 'R') {
      dialPosition += number;
      while (dialPosition > 99) { 
        dialPosition -= 100;
        round2Result += 1;
      }
    } else if (line[0] === 'L') {
      if (dialPosition === 0) {
        round2Result -= 1;
      }
      dialPosition -= number;
      while (dialPosition < 0) {
        dialPosition += 100;
        round2Result += 1;
      }
      if (dialPosition === 0) {
        round2Result += 1;
      }
    }
    if (dialPosition === 0) {
      result += 1;
    }
  })
  console.log("Dial Was At 0 ", result, "Times");
  console.log("Dial Passed 0 ", round2Result, "Times");
}
