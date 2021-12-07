export const Day1 = (input: string[]) => {
  // console.log(inputAsNum);

  let increases = 0;
  let groupIncreases = 0;
  input.map(Number).forEach((num, i, list) => {
    if (num < list[i + 1]) increases++
    if (num < list[i + 3]) groupIncreases++
  })
  
  console.log("Depth Increase Count:", increases)
  console.log("Depth Window Increase Count:", groupIncreases)
}
