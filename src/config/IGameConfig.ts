export interface IGameConfig {
    totalFrames: number;
    maxPinsPerFrameInARack: number;
    maxRollsPerFrame: number;
    maxRollsInLastFrame: number;
    availableBonus: {
        strike: {
            enabled: boolean;
            bonusRolls: number;
            rollsRequiredToKnockDownAllPins: number;
        };
        spare: {
            enabled: boolean;
            bonusRolls: number;
            rollsRequiredToKnockDownAllPins: number;
        };
    };
    players: {
        name: string;
    }[];
}