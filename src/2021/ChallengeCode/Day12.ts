const numPathsToEnd = (currentRoom: string, remainingPaths: string[], roomToRevisit: string, canRevisitASmallRoom: boolean, roomRevisited: boolean) => {
  if (currentRoom === 'end') {
    if (roomToRevisit !== ''  && !roomRevisited) {
      return 0;
    }
    return 1;
  }
  let numberPaths = 0;
  const remainingPathsWithCurrentRoom = remainingPaths.filter((path: string) => path.split('-').includes(currentRoom));
  let remainingPathsAfterCurrentRoom = [...remainingPaths];
  let willRevisitThisRoom = false;
  let markRoomRevisited = roomRevisited;
  if (currentRoom.toLocaleLowerCase() === currentRoom) {
    if (canRevisitASmallRoom && roomToRevisit === '' && currentRoom !== 'start') {
      willRevisitThisRoom = true;
    } else if (canRevisitASmallRoom && roomToRevisit === currentRoom) {
      markRoomRevisited = true;
    }
    remainingPathsAfterCurrentRoom = remainingPaths.filter((path: string) => !path.split('-').includes(currentRoom));
  }
  const nextRooms = remainingPathsWithCurrentRoom.map((path: string) => {
    let rooms = path.split('-');
    return rooms[1-rooms.indexOf(currentRoom)];
  })
  nextRooms.forEach((room: string) => {
    numberPaths += numPathsToEnd(room, remainingPathsAfterCurrentRoom, roomToRevisit, canRevisitASmallRoom, markRoomRevisited);
    if (willRevisitThisRoom && room !== 'end') {
      numberPaths += numPathsToEnd(room, remainingPaths, currentRoom, canRevisitASmallRoom, markRoomRevisited);
    }
  });
  return numberPaths;
}

export const Day12 = (input: string[]) => {
  console.log("Paths when restricted to one visit to small rooms:", numPathsToEnd('start', input, '', false, false));
  console.log("Paths when restricted to two visits to small rooms:", numPathsToEnd('start', input, '', true, false));
}