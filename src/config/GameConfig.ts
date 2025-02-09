import { IGameConfig } from './IGameConfig';

export const GameConfig: IGameConfig = {
    totalFrames: 10,
    maxPinsPerFrameInARack: 10,
    maxRollsPerFrame: 2,
    maxRollsInLastFrame: 3,
    availableBonus: {
        strike: {
            enabled: true,
            bonusRolls: 2,
        },
        spare: {
            enabled: true,
            bonusRolls: 1,
        },
    },
    players: [
        { name: 'Player1' },
        { name: 'Player2' },
    ],
};