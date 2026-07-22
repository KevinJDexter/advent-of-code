export const Day02 = (input: string[]) => {
  const idRangeArray = input[0].split(',');
  let sumOfInvalidIds = 0;
  let sumOfInvalidIdsV2 = 0;
  idRangeArray.forEach((idRange) => {
    const [minId, maxId] = idRange.split('-').map(Number);
    for (let id = minId; id <= maxId; id++) {
      const stringifiedId = id.toString();
      for (let modValue = 1; modValue <= stringifiedId.length / 2; modValue ++){
        if (stringifiedId.length % modValue === 0) {
          const stringifiedIdArray: string[] = [];
          let index = 0;
          while (index < stringifiedId.length) {
            stringifiedIdArray.push(stringifiedId.slice(index, index + modValue));
            index += modValue;
          }
          if (stringifiedIdArray.every((value) => value === stringifiedIdArray[0])) {
            sumOfInvalidIdsV2 += id;
            break;
          }
        }
      }
      if (stringifiedId.length % 2 === 0 && stringifiedId.slice(0, stringifiedId.length / 2) === stringifiedId.slice(stringifiedId.length / 2)) {
        sumOfInvalidIds += id; 
      }
    }
  });
  console.log("Sum of Invalid Ids: ", sumOfInvalidIds);
  console.log("Sum of Invalid Ids V2: ", sumOfInvalidIdsV2);
}