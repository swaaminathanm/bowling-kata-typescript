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
            rollsRequiredToKnockDownAllPins: 1
        },
        spare: {
            enabled: true,
            bonusRolls: 1,
            rollsRequiredToKnockDownAllPins: 2
        },
    },
    players: [
        { name: 'Player1' },
        { name: 'Player2' },
    ],
};