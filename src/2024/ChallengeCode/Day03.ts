export const Day03 = (input: string[]) => {
  let result = 0;
  input.forEach((line) => {
    const multBreaks = line.split('mul(');
    multBreaks.forEach((multBreak) => {
      const secondBreak = multBreak.split(')')[0];
      const nums = secondBreak.split(',');
      const x = Number(nums[0]);
      const y = Number(nums[1]);
      if (nums.length === 2 && x > 0 && x < 1000 && y > 0 && y < 1000) {
        result += x * y;
      }
    })
  })

  let doResult = 0;
  let doIsEnabled = true;
  input.forEach((line) => {
    let doEnabled = line.split('do()');
    doEnabled.forEach((doLine, i) => {
      if (i !== 0 || doIsEnabled) {
        const dontIndex = doLine.indexOf("don't()");
        const doFullLine = doLine.slice(0, dontIndex);
        const multBreaks = doFullLine.split('mul(');
        multBreaks.forEach((multBreak) => {
          const secondBreak = multBreak.split(')')[0];
          const nums = secondBreak.split(',');
          const x = Number(nums[0]);
          const y = Number(nums[1]);
          if (nums.length === 2 && x > 0 && x < 1000 && y > 0 && y < 1000) {
            doResult += x * y;
          }
        })
      }
    })
    const lastDoIndex = line.lastIndexOf('do()');
    const lastDontIndex = line.lastIndexOf("don't()");
    doIsEnabled = lastDoIndex > lastDontIndex;
  });

  console.log("Sum of mults:", result);
  console.log("Sum of Do mults:", doResult);
}