export const Day15 = (input: string[]) => {
  let path: number[][] = [];
  for (let i = 0; i < input.length; i++) {
    path.push([])
    for (let j = 0; j < input[0].length; j++) {
      if (i === 0 && j === 0) {
        path[i].push(0);
      } else if (i === 0) {
        path[i].push(path[i][j - 1] + +input[i][j]);
      } else if (j === 0) {
        path[i].push(path[i - 1][j] + +input[i][j]);
      } else {
        path[i].push(Math.min(path[i - 1][j], path[i][j-1]) + +input[i][j]);
      }
    }
  }

  let expandedInput: string[] = []
  for(let i = 0; i < input.length; i++) {
    let currentInput = input[i]
    for(let j = 1; j < 5; j++) {
      currentInput = currentInput + input[i].split('').map(n => (+n + j > 9 ? +n + j -9 : +n + j)).join('');
    }
    expandedInput.push(currentInput);
  }
  for (let j = 1; j < 5; j++) {
    for(let i = 0; i < input.length; i++) {
      expandedInput.push(expandedInput[i].split('').map(n => (+n + j > 9 ? +n + j -9 : +n + j)).join(''))
    }
  }

  let expandedPath: number[][] = [];
  for (let i = 0; i < expandedInput.length; i++) {
    expandedPath.push([])
    for (let j = 0; j < expandedInput[0].length; j++) {
      if (i === 0 && j === 0) {
        expandedPath[i].push(0);
      } else if (i === 0) {
        expandedPath[i].push(expandedPath[i][j - 1] + +expandedInput[i][j]);
      } else if (j === 0) {
        expandedPath[i].push(expandedPath[i - 1][j] + +expandedInput[i][j]);
      } else {
        expandedPath[i].push(Math.min(expandedPath[i - 1][j], expandedPath[i][j-1]) + +expandedInput[i][j]);
      }
    }
  }

  for (let k = 0; k < 5; k++){
    for (let i = 0; i < expandedInput.length; i++) {
      for (let j = 0; j < expandedInput[0].length; j++) {
        if (i === 0 && j === 0) {
          expandedPath[i][j] = 0;
        } else if (i === 0) {
          if (j === expandedInput[0].length - 1) {
            expandedPath[i][j] = Math.min(expandedPath[i][j - 1], expandedPath[i + 1][j]) + +expandedInput[i][j];
          } else {
            expandedPath[i][j] = Math.min(expandedPath[i][j - 1], expandedPath[i][j + 1], expandedPath[i + 1][j]) + +expandedInput[i][j];
          }
        } else if (j === 0) {
          if (i === expandedInput.length - 1) {
            expandedPath[i][j] = Math.min(expandedPath[i - 1][j], expandedPath[i][j + 1]) + +expandedInput[i][j];
          } else {
            expandedPath[i][j] = Math.min(expandedPath[i - 1][j], expandedPath[i + 1][j], expandedPath[i][j + 1]) + +expandedInput[i][j];
          }
        } else {
          if (i === expandedInput.length - 1) {
            if (j === expandedInput.length - 1) {
              expandedPath[i][j] = Math.min(expandedPath[i - 1][j], expandedPath[i][j-1]) + +expandedInput[i][j];
            } else {
              expandedPath[i][j] = Math.min(expandedPath[i - 1][j], expandedPath[i][j-1], expandedPath[i][j + 1]) + +expandedInput[i][j];
            }
          } else {
            if (j === expandedInput.length - 1) {
              expandedPath[i][j] = Math.min(expandedPath[i - 1][j], expandedPath[i][j-1], expandedPath[i + 1][j]) + +expandedInput[i][j];
            } else {
              expandedPath[i][j] = Math.min(expandedPath[i - 1][j], expandedPath[i][j-1], expandedPath[i + 1][j], expandedPath[i][j + 1]) + +expandedInput[i][j];
            }
          }
        }
      }
    }
  }
  console.log("Lowest risk path:", path[input.length-1][input[0].length-1])
  console.log("Lowest risk expanded path:", expandedPath[expandedInput.length-1][expandedInput[0].length-1])
}