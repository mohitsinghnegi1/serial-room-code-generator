import { setGameRoomMapping, getGameRoomAddress } from '../src/gameRoomMapper';

async function test() {
    await setGameRoomMapping('puzzlePartyCard', 'aaaaab', 'localhost:8000/gameig/');
    console.log("Address: ", await getGameRoomAddress('puzzlePartyCard', 'aaaaab'));
}

test();