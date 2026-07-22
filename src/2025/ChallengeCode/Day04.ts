export const Day04 = (input: string[]) => {
  let accessibleByForklift = 0;
  let firstRun = true;
  let recursiveAccessibleByForklift = 0;
  let removedByForklift = new Map<number, number[]>();
  let roomLayout: string[][] = input.map(line => line.split(''));
  let test = 0
  
  while (true) {
    let currentAccessibleByForklift = 0;
    for (let row = 0; row < roomLayout.length; row++) {
      for (let col = 0; col < roomLayout[row].length; col++) {
        if (roomLayout[row][col] === '@') {
          let paperRollsInRange = 0;
          for (let r = Math.max(0, row - 1); r <= Math.min(roomLayout.length - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(roomLayout[r].length - 1, col + 1); c++) {
              if (roomLayout[r][c] === '@') {
                paperRollsInRange++;
              }
            }
          }
          if (paperRollsInRange <= 4) {
            currentAccessibleByForklift++;
            removedByForklift.set(row, [...(removedByForklift.get(row) || []), col]);
          }
        }
      }
    }
    
    if (firstRun) {
      accessibleByForklift = currentAccessibleByForklift;
      firstRun = false;
    }
    recursiveAccessibleByForklift += currentAccessibleByForklift;
    if (currentAccessibleByForklift === 0) {
      break;
    }

    removedByForklift.forEach((cols, row) => {
      cols.forEach(col => {
        roomLayout[row][col] = '.';
      });
    });
    removedByForklift.clear();
  }
  
  
  console.log("Paper Rolls Accessible By Forklift:", accessibleByForklift);
  console.log("Paper Rolls Accessible By Forklift (Recursive):", recursiveAccessibleByForklift);
}