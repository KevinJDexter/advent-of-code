export const Day03 = (input: string[]) => {
  let joltageSum = 0;
  let largeJoltageSum = 0;

  input.forEach((batteryBank: string) => {
    let joltageFirstDigit = 0;
    let joltageFirstDigitIndex = -1;
    let joltageSecondDigit = 0;
    for (let i = 9; i >= 0; i--) {
      const index = batteryBank.indexOf(i.toString());
      if (index >= 0 && index < batteryBank.length - 1) {
        joltageFirstDigit = i;
        joltageFirstDigitIndex = index;
        break
      }
    }
    const batteryBankAfterFirstDigit = batteryBank.slice(joltageFirstDigitIndex + 1);
    for (let i = 9; i >= 0; i--) {
      const index = batteryBankAfterFirstDigit.indexOf(i.toString());
      if (index >= 0) {
        joltageSecondDigit = i;
        break
      }
    }
    joltageSum += joltageFirstDigit * 10 + joltageSecondDigit;

    let largeJoltage = '';
    let currentBank = batteryBank;
    while (largeJoltage.length < 12) {
      const currentJoltageLength = largeJoltage.length;
      for (let i = 9; i >= 0; i--) {
        const index = currentBank.indexOf(i.toString());
        if (index >= 0 && index < currentBank.length - (11 - currentJoltageLength)) {
          largeJoltage += i.toString();
          currentBank = currentBank.slice(index + 1);
          break;
        }
      }
    }
     
    largeJoltageSum += parseInt(largeJoltage);
  })


  console.log("Joltage Sum: ", joltageSum);
  console.log("Large Joltage Sum: ", largeJoltageSum);
}