export const Day08 = (input: string[]) => {
  let easyDigitCount = 0;
  let total = 0;
  input.forEach(line => {
    const zeroThroughNine = line.split(" | ")[0].split(" ");
    const outputNums = line.split(" | ")[1].split(" ");
    const one = zeroThroughNine.find(num => num.length == 2).split("");
    const four = zeroThroughNine.find(num => num.length == 4).split("");

    let result = ""
    outputNums.forEach((num, i) => {
      switch(num.length) {
        case 2:
          easyDigitCount++;
          result += "1";
          break;
        case 3:
          easyDigitCount++;
          result += "7";
          break;
        case 4:
          easyDigitCount++;
          result += "4";
          break;
        case 5:
          if (one.every(letter => num.includes(letter))) {
            result += "3";
          } else {
            let occurrences = 0;
            four.forEach(letter => {
              if (num.includes(letter)) occurrences++;
            })
            if (occurrences === 3) result += "5";
            else result += "2"
          }
          break;
        case 6:
          if (four.every(letter => num.includes(letter))) {
            result += "9";
          } else if (one.every(letter => num.includes(letter))) {
            result += "0";
          } else result += "6"
          break;
        case 7:
          easyDigitCount++;
          result += "8";
          break;
      }
    });
    total += +result;
  })
  console.log("Occurrences of Easy Digits:", easyDigitCount)
  console.log("Sum of rows:", total);
}