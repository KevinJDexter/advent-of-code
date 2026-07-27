export const Day08 = (input: string[]) => {
  const fuseboxCount = input.length;
  const distanceRecords: Record<number, number[]> = [];
  const rawDistances: number[] = [];
  const distanceFormula = (coords1, coords2) => {
    const [x1, y1, z1] = coords1;
    const [x2, y2, z2] = coords2;
    return (Math.sqrt((x1 - x2) * (x1 - x2) +(y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2)))
  };

  const fuseBoxCoordinates = input.map(coords => coords.split(',').map(Number))

  for (let i = 0; i < fuseboxCount; i++) {
    for (let j = i + 1; j < fuseboxCount; j++) {
      const distance = distanceFormula(fuseBoxCoordinates[i], fuseBoxCoordinates[j])
      distanceRecords[distance] = [i, j];
      rawDistances.push(distance);
    }
  }

  rawDistances.sort((a, b) => b - a);
  const connectedFuseboxes: number[] = [];
  let connections = 0;
  let lastLink: number[] = [];
  const circuits: number[][] = [];
  while (connections < 1000 || circuits.length > 1 || connectedFuseboxes.length < 1000) {
    const distance = rawDistances.pop();
    if (!distance) break;
    const firstFusebox = distanceRecords[distance][0];
    const secondFusebox = distanceRecords[distance][1];
    lastLink = [firstFusebox, secondFusebox];
    const firstFuseboxConnected = connectedFuseboxes.includes(firstFusebox);
    const secondFuseboxConnected = connectedFuseboxes.includes(secondFusebox);
    connections ++;
    if (firstFuseboxConnected && secondFuseboxConnected) {
      const firstConnectedCircuit = circuits.findIndex(circuit => circuit.includes(firstFusebox));
      const secondConnectedCircuit = circuits.findIndex(circuit => circuit.includes(secondFusebox));
      if (firstConnectedCircuit === secondConnectedCircuit) {
        continue;
      } else {
        const newCircuit = [...circuits[firstConnectedCircuit], ...circuits[secondConnectedCircuit]];
        circuits.splice(Math.max(firstConnectedCircuit, secondConnectedCircuit), 1);
        circuits.splice(Math.min(firstConnectedCircuit, secondConnectedCircuit), 1);
        circuits.push(newCircuit);
      }
    } else if (!firstFuseboxConnected && !secondFuseboxConnected) {
      connectedFuseboxes.push(firstFusebox, secondFusebox);
      circuits.push([firstFusebox, secondFusebox]);
    } else {
      let circuitIndex = circuits.findIndex(circuit => circuit.includes(firstFuseboxConnected ? firstFusebox : secondFusebox));
      circuits[circuitIndex].push(firstFuseboxConnected ? secondFusebox : firstFusebox);
      connectedFuseboxes.push(firstFuseboxConnected ? secondFusebox : firstFusebox);
    }
    
    if (connections === 1000) {
      const circuitSizes = circuits.map(circuit => circuit.length).sort((a,b) => b-a);

      console.log("Longest Circuits:",  circuitSizes[0] * circuitSizes[1] * circuitSizes[2]);
    }
  }

  const finalResult = fuseBoxCoordinates[lastLink[0]][0] * fuseBoxCoordinates[lastLink[1]][0];
  console.log("Last Junction Connect:", finalResult)
}