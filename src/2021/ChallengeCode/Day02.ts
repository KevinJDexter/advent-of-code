export const Day02 = (input: string[]) => {
  let horizontal = 0;
  let depth = 0;
  let aimDepth = 0;

  input.forEach(line => {
    const action = line.split(' ');
    const direction = action[0];
    const distance = Number(action[1]);

    switch(direction) {
      case "forward":
        horizontal += distance;
        aimDepth += distance * depth;
        break;
      case "down":
        depth += distance;
        break;
      case "up":
        depth -= distance;
        break;
    }
  })

  console.log("Position times Depth:", horizontal * depth);
  console.log("Position times Aim Depth:", horizontal * aimDepth);
}