export const Day01 = (input: string[]) => {
  console.log("Day1");

  let value = 50;
  let zeroCount = 0;
  let passCount = 0;

  for (const line of input) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const direction = trimmed[0];
    const amount = parseInt(trimmed.slice(1), 10);
    if ((direction !== 'R' && direction !== 'L') || isNaN(amount)) continue;

    if (direction === 'R') {
      // Times we hit or cross 0 going up: every multiple of 100 reached.
      passCount += Math.floor((value + amount) / 100);
      value = (value + amount) % 100;
    } else {
      // Times we hit or cross 0 going down: first after `value` clicks, then every 100.
      if (value > 0) {
        if (amount >= value) passCount += Math.floor((amount - value) / 100) + 1;
      } else {
        passCount += Math.floor(amount / 100);
      }
      value = ((value - amount) % 100 + 100) % 100;
    }

    if (value === 0) zeroCount++;
  }

  console.log(`Door code (times ended on 0): ${zeroCount}`);
  console.log(`Times passed over 0: ${passCount}`);
  return { zeroCount, passCount };
}
