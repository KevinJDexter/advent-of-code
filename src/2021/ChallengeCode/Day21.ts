export const Day21 = (input: string[]) => {
  console.log("Day21");
  let playerOneInitialPosition = +input[0][input[0].length - 1];
  let playerTwoInitialPosition = +input[1][input[1].length - 1];

  let playerOnePosition = playerOneInitialPosition;
  let playerTwoPosition = playerTwoInitialPosition;
  let playerOneScore = 0;
  let playerTwoScore = 0;
  let numRolls = 0;
  let nextRoll = 1;

  let playerOneTurn = true;
  while(playerOneScore < 1000 && playerTwoScore < 1000) {
    let roll = 0;
    for(let i = 0; i < 3; i++) {
      roll += nextRoll;
      nextRoll++;
      if (nextRoll === 101) {
        nextRoll = 1;
      }
    }
    if (playerOneTurn) {
      playerOnePosition = (playerOnePosition + roll) % 10 === 0 ? 10 : (playerOnePosition + roll) % 10;
      playerOneScore += playerOnePosition;
    } else {
      playerTwoPosition = (playerTwoPosition + roll) % 10 === 0 ? 10 : (playerTwoPosition + roll) % 10;
      playerTwoScore += playerTwoPosition;
    }
    numRolls += 3;
    playerOneTurn = !playerOneTurn
  }

  const emptyRunningGames = {};
  for (let i = 0; i < 21; i++) {
    for (let j = 0; j < 21; j++) {
      for (let k = 1; k < 11; k++) {
        for (let l = 1; l < 11; l++) {
          const key = `P1Score:${i};P2Score:${j};P1Pos:${k};P2Pos:${l}`
          emptyRunningGames[key] = 0;
        }
      }
    }
  }
  let runningGames = {...emptyRunningGames};
  runningGames[`P1Score:0;P2Score:0;P1Pos:${playerOneInitialPosition};P2Pos:${playerTwoInitialPosition}`] = 1;
  let numRunningGames = 1;

  let playerOneWins = 0;
  let playerTwoWins = 0;
  playerOneTurn = true;
   
  while (numRunningGames > 0) {
    let nextRunningGames = {...emptyRunningGames};

    numRunningGames = 0;
    Object.keys(emptyRunningGames).forEach(game => {
      if (runningGames[game]) {
        let gameDetails = game.split(';');
        for (let i = 1; i <= 3; i++) {
          for (let j = 1; j <= 3; j++) {
            for (let k = 1; k <= 3; k++) {
              const roll = i + j + k;
              if (playerOneTurn) {
                const gamePlayerOneScore = +gameDetails[0].split(':')[1]
                const gamePlayerOnePos = +gameDetails[2].split(':')[1];
                const newPlayerOnePosition = (gamePlayerOnePos + roll) % 10 === 0 ? 10 : (gamePlayerOnePos + roll) % 10;
                const newPlayerOneScore = gamePlayerOneScore + newPlayerOnePosition;
                if (newPlayerOneScore >= 21) {
                  playerOneWins += runningGames[game];
                } else {
                  const key = `${gameDetails[0].split(':')[0]}:${newPlayerOneScore};${gameDetails[1]};${gameDetails[2].split(':')[0]}:${newPlayerOnePosition};${gameDetails[3]}`
                  nextRunningGames[key] = nextRunningGames[key] + runningGames[game];
                  numRunningGames += runningGames[game];
                }
              } else {
                const gamePlayerTwoScore = +gameDetails[1].split(':')[1]
                const gamePlayerTwoPos = +gameDetails[3].split(':')[1];
                const newPlayerTwoPosition = (gamePlayerTwoPos + roll) % 10 === 0 ? 10 : (gamePlayerTwoPos + roll) % 10;
                const newPlayerTwoScore = gamePlayerTwoScore + newPlayerTwoPosition;
                if (newPlayerTwoScore >= 21) {
                  playerTwoWins += runningGames[game];
                } else {
                  const key = `${gameDetails[0]};${gameDetails[1].split(':')[0]}:${newPlayerTwoScore};${gameDetails[2]};${gameDetails[3].split(':')[0]}:${newPlayerTwoPosition}`
                  nextRunningGames[key] = nextRunningGames[key] + runningGames[game];
                  numRunningGames += runningGames[game];
                }
              }
            }
          }
        }
      }
    })
    playerOneTurn =  !playerOneTurn;
    runningGames = {...nextRunningGames}
  }

  console.log("Losing player times number of rolls on deterministic die:", numRolls * Math.min(playerOneScore, playerTwoScore))
  console.log("Most wins by a single player:", Math.max(playerOneWins, playerTwoWins))
}