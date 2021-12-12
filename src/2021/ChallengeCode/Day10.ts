enum Pairs {
  ["("] = ")",
  ["["] = "]",
  ["{"] = "}",
  ["<"] = ">"
}

enum Scores {
  [")"] = 3,
  ["]"] = 57,
  ["}"] = 1197,
  [">"] = 25137,
}

enum CompletionScores {
  ["("] = 1,
  ["["] = 2,
  ["{"] = 3,
  ["<"] = 4,
}

export const Day10 = (input: string[]) => {
  let corruptedScore = 0;
  const openBrackets = "([{<";
  let completionScores = [];
  
  input.map(line => {
    let lineSoFar = []
    const incompleteLine = line.split('').every(c => {
      if (openBrackets.includes(c)) {
        lineSoFar.push(c);
      } else {
        const previousOpen = lineSoFar.pop();
        if (Pairs[previousOpen] !== c) {
          corruptedScore += Scores[c];
          return false;
        }
      }
      return true;
    });
    let completionScore = 0;
    if (incompleteLine) {
      lineSoFar.reverse().forEach(c => {
        completionScore = completionScore * 5 + +CompletionScores[c]
      })
    }
    if (completionScore > 0) completionScores.push(completionScore);
  })

  completionScores.sort((a, b) => a - b);

  console.log("Corrupted Score:", corruptedScore);
  console.log("Completion Score:", completionScores[(completionScores.length - 1) / 2])
}