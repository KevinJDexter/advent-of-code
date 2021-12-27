export const Day06 = (input: string[]) => {
  let initialFish = input[0].split(',').map(fish => Number(fish));

  let livingFish = {
    0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0
  }
  let fishAfter80 = 0;
  let fishAfter256 = 0;

  initialFish.forEach(fish => {
    livingFish[fish] = livingFish[fish] + 1;
  });

  const advanceGeneration = () => {
    const previousFishGen = {...livingFish};
    for (let i = 8; i >= 0; i--) {
      if (i === 0) {
        livingFish[8] = previousFishGen[0];
        livingFish[6] = livingFish[6] + previousFishGen[0];
      } else {
        livingFish[i-1] = previousFishGen[i];
      }
    }
  }
  for(let i = 0; i < 256; i++) {
    advanceGeneration();
    if (i === 79) {
      for(let j = 0; j < 9; j++) {
        fishAfter80 += livingFish[j];
      }
    }
  }

  for(let j = 0; j < 9; j++) {
    fishAfter256 += livingFish[j];
  }

  console.log("After 80 days", fishAfter80)
  console.log("After 256 days", fishAfter256)
}