import { getGameRoomId } from '../src/db';

getGameRoomId('puzzlePartyChat').then((code: string) => {
    console.log('game room code', code);
});