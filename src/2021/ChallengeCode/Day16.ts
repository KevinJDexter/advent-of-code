const hexMap = {
  "0": "0000",
  "1": "0001",
  "2": "0010",
  "3": "0011",
  "4": "0100",
  "5": "0101",
  "6": "0110",
  "7": "0111",
  "8": "1000",
  "9": "1001",
  "A": "1010",
  "B": "1011",
  "C": "1100",
  "D": "1101",
  "E": "1110",
  "F": "1111",
}

type T_Packet = {
  versionId: number;
  typeId: number;
  lengthTypeId?: number;
  operandLength?: number;
  subpackets: T_Packet[];
  binaryNumber?: string;
  number?: number;
  totalBitLength: number;
  totalSubpacketsContained?: number;
}

export const Day16 = (input: string[]) => {
  const bitString = input[0].split('').map(char => hexMap[char]).join('');



  let i = 0;
  let totalVersionIds = 0;
  let currentVersion = 0;
  let currentType = 0;
  let bitsInSubpacket = 0;
  let subpacketsInPacket = 0;

  let allPackets: T_Packet[] = [];
  let packetPath: T_Packet[] = [];

  while(i < bitString.length) {
    let newPacket: T_Packet = {subpackets: [], totalSubpacketsContained: 0} as T_Packet;
    newPacket.versionId = parseInt(bitString.substr(i, 3), 2);
    totalVersionIds += newPacket.versionId;
    newPacket.totalBitLength = 3;
    i +=3;
    newPacket.typeId = parseInt(bitString.substr(i, 3), 2);
    newPacket.totalBitLength += 3;
    i +=3;

    if (newPacket.typeId === 4) {
      let repeat = true;
      let numbersAsBitstring = '';
      while (repeat) {
        if (bitString[i] === "0") repeat = false;
        newPacket.totalBitLength += 1;
        i++;
        numbersAsBitstring = numbersAsBitstring + bitString.substr(i, 4);
        newPacket.totalBitLength += 4;
        i += 4;
      }
      newPacket.binaryNumber = numbersAsBitstring;
      newPacket.number = parseInt(newPacket.binaryNumber, 2);
    } else {
      newPacket.lengthTypeId = parseInt(bitString[i]);
      newPacket.totalBitLength += 1;
      i++;
      if (newPacket.lengthTypeId === 0) {
        newPacket.operandLength = parseInt(bitString.substr(i, 15), 2);
        newPacket.totalBitLength += 15;
        i += 15;
      } else {
        newPacket.operandLength = parseInt(bitString.substr(i, 11), 2);
        newPacket.totalBitLength += 11;
        i += 11;
      }
      packetPath.push(newPacket);
    }

    allPackets.push(newPacket)
  }
  const firstPacket = allPackets.shift()
  const subpacketArray = buildSubpacketArray(firstPacket, allPackets);

  console.log("Value of transmission:", equatePacket(subpacketArray));
  console.log("Total of all Version IDs:", totalVersionIds)
}

const buildSubpacketArray = (currentPacket: T_Packet, remainingPackets: T_Packet[]) => {
  if (currentPacket.typeId !== 4) {
    let localOperandLength = currentPacket.operandLength;
    let futurePackets = [...remainingPackets];
    while (localOperandLength > 0) {
      const nextPacket = futurePackets.shift();
      const nextSubpacket = buildSubpacketArray(nextPacket, futurePackets);
      currentPacket.subpackets = [...currentPacket.subpackets, nextSubpacket];
      currentPacket.totalBitLength += nextSubpacket.totalBitLength;
      currentPacket.totalSubpacketsContained += 1;
      if (nextSubpacket.totalSubpacketsContained && nextSubpacket.totalSubpacketsContained > 0) {
        futurePackets = futurePackets.filter((p, i) => i >= nextSubpacket.totalSubpacketsContained);
        currentPacket.totalSubpacketsContained += nextSubpacket.totalSubpacketsContained
      }
      if (currentPacket.lengthTypeId === 0) {
        localOperandLength -= nextSubpacket.totalBitLength;
      } else {
        localOperandLength --;
      }
    }
  }
  return currentPacket
}

const equatePacket = (packet: T_Packet) => {
  let total = 0;
  const numbers = packet.subpackets.map(p => equatePacket(p));
  switch (packet.typeId) {
    case 0: 
      numbers.forEach(num => total += num);
      return total;
    case 1: 
      total = 1;
      numbers.forEach(num => total = total * num);
      return total;
    case 2: 
      return Math.min(...numbers);
    case 3: 
      return Math.max(...numbers);
    case 4: 
      return packet.number;
    case 5: 
      if (numbers[0] > numbers[1]) {
        return 1;
      } else {
        return 0;
      };
    case 6: 
      if (numbers[0] < numbers[1]) {
        return 1;
      } else {
        return 0;
      };
    case 7: 
      if (numbers[0] === numbers[1]) {
        return 1;
      } else {
        return 0;
      };
    default:
      return 0;
  }
}