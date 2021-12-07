export const Day3 = (input: string[]) => {
  let oneBitCounts = input[0].split('').map(_ => 0);
  let ogr = '';
  let co2sr = '';

  for (let i = 0; i < input[0].length; i++) {
    let countsOgr = 0;
    let oneBitCountsOgr = 0;
    let countsCo2sr = 0;
    let oneBitCountsCo2sr = 0;
    let firstRowOgr = "";
    let firstRowCo2sr = "";
    input.map(row => {
      if (row[i] === "1") oneBitCounts[i] = oneBitCounts[i] + 1;
      if (row.startsWith(ogr)) {
        countsOgr++;
        if (row[i] === "1") oneBitCountsOgr++;
        if (!firstRowOgr.length) firstRowOgr = row;
      }
      if (row.startsWith(co2sr)) {
        countsCo2sr++;
        if (row[i] === "1") oneBitCountsCo2sr++;
        if (!firstRowCo2sr.length) firstRowCo2sr = row;
      }
    })
    if (countsOgr === 1) {
      ogr = firstRowOgr;
    } else if (oneBitCountsOgr >= countsOgr/2) {
      ogr = ogr + '1';
    } else {
      ogr = ogr + '0';
    }
    if (countsCo2sr === 1) {
      co2sr = firstRowCo2sr;
    } else if (oneBitCountsCo2sr < countsCo2sr/2) {
      co2sr = co2sr + '1';
    } else {
      co2sr = co2sr + '0';
    }
  }
  let gamma = '';
  let epsilon = '';
  oneBitCounts.forEach(count => {
    if (count > input.length/2) {
      gamma = gamma + '1';
      epsilon = epsilon + '0';
    } else {
      gamma = gamma + '0';
      epsilon = epsilon + '1';
    }
  })
  const convertBitToNum = (bitString) => {
    let result = 0;
    bitString.split('').forEach(bit => {
      result = result * 2;
      result = result + Number(bit);
    })
    return result;
  }
  const gammaNum = convertBitToNum(gamma);
  const epsilonNum = convertBitToNum(epsilon);
  const ogrNum = convertBitToNum(ogr);
  const co2srNum = convertBitToNum(co2sr);
  console.log("Power Consumption:", gammaNum * epsilonNum)
  console.log("Life Support Rating:", ogrNum * co2srNum)
}