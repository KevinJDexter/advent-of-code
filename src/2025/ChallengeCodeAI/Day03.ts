export const Day03 = (input: string[]) => {
  let totalJoltage = 0;
  let total12Digit = 0;

  for (const bank of input) {
    // Find largest 2-digit number (joltage value)
    let maxNumber = 0;
    for (let i = 0; i < bank.length - 1; i++) {
      for (let j = i + 1; j < bank.length; j++) {
        const twoDigit = parseInt(bank[i] + bank[j]);
        maxNumber = Math.max(maxNumber, twoDigit);
      }
    }
    totalJoltage += maxNumber;

    // Find largest 12-digit number (greedy approach: pick largest digit at each step)
    if (bank.length >= 12) {
      let largest12Digit = '';
      let currentPos = 0;

      for (let digitIndex = 0; digitIndex < 12; digitIndex++) {
        const remainingDigitsAfterThis = 12 - digitIndex - 1;
        const maxPos = bank.length - remainingDigitsAfterThis - 1;

        let bestDigit = -1;
        let bestPos = currentPos;

        for (let pos = currentPos; pos <= maxPos; pos++) {
          const digit = parseInt(bank[pos]);
          if (digit > bestDigit) {
            bestDigit = digit;
            bestPos = pos;
          }
        }

        largest12Digit += bestDigit;
        currentPos = bestPos + 1;
      }

      total12Digit += parseInt(largest12Digit);
    }
  }

  console.log(`Sum of all joltage values: ${totalJoltage}`);
  console.log(`Sum of all 12-digit values: ${total12Digit}`);
};
