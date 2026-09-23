export const Day05 = (input: string[]) => {
  const numDict = {};
  let sumOfMiddlePages = 0;
  let sumOfMiddlePagesOfFixedLines = 0;

  input.forEach(line => {
    if (line.includes('|')) {
      const [first, second] = line.split('|');
      if (numDict[first]) {
        numDict[first] = [...numDict[first], second]
      } else {
        numDict[first] = [second]
      }
    } else if (line.includes(',')) {
      const pages = line.split(',');
      const seenPages: string[] = [];
      let validLine = true;
      pages.forEach(page => {
        const pagesToFollow: string[] = numDict[page];
        const hasNotBeenSeen = seenPages.every(seenPage => !pagesToFollow.includes(seenPage))
        if (hasNotBeenSeen) {
          seenPages.push(page);
        } else {
          validLine = false;
          return;
        }
      })
      if (validLine) {
        sumOfMiddlePages += Number(pages[(pages.length - 1) / 2])
      } else {
        const fixedLine: string[] = [];
        let currentIndex = 0;
        while (pages.length > 0 && currentIndex < pages.length) {
          const currentPage = pages[currentIndex];
          const isSafeAddition = pages.every(page => !numDict[page].includes(currentPage));
          if (isSafeAddition) {
            fixedLine.push(currentPage);
            pages.splice(currentIndex, 1);
            currentIndex = 0;
          } else {
            currentIndex ++;
          }
        }
        sumOfMiddlePagesOfFixedLines += Number(fixedLine[(fixedLine.length - 1) / 2]);
      }
    }
  })

  console.log("Sum of middle pages of valid lines:", sumOfMiddlePages)
  console.log("Sum of middle pages of fixed lines:", sumOfMiddlePagesOfFixedLines)
}