const numPathsToEnd = (currentRoom: string, remainingPaths: string[], roomToRevisit: string, canRevisitASmallRoom: boolean, roomRevisited: boolean, currentPath: string) => {
  if (currentRoom === 'end') {
    if (roomToRevisit !== ''  && !roomRevisited) {
      return 0;
    }
    return 1;
  }
  if (currentPath[currentPath.length - 3] === 'd') {console.log(currentPath)}
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
    } else if (canRevisitASmallRoom) {
    }
    remainingPathsAfterCurrentRoom = remainingPaths.filter((path: string) => !path.split('-').includes(currentRoom));
  }
  const nextRooms = remainingPathsWithCurrentRoom.map((path: string) => {
    let rooms = path.split('-');
    return rooms[1-rooms.indexOf(currentRoom)];
  })
  nextRooms.forEach((room: string) => {
    if (currentRoom === 'd') {
    }
    numberPaths += numPathsToEnd(room, remainingPathsAfterCurrentRoom, roomToRevisit, canRevisitASmallRoom, markRoomRevisited, currentPath + '-' + room);
    if (willRevisitThisRoom && room !== 'end') {
      numberPaths += numPathsToEnd(room, remainingPaths, currentRoom, canRevisitASmallRoom, markRoomRevisited, currentPath + '-' + room)
    }
  });
  return numberPaths;
}

export const Day12 = (input: string[]) => {
  console.log("Day12");
  console.log("Paths when restricted to one visit to small rooms:", numPathsToEnd('start', input, '', false, false, 'start'));
  console.log("Paths when restricted to two visits to small rooms:", numPathsToEnd('start', input, '', true, false, 'start'));
}