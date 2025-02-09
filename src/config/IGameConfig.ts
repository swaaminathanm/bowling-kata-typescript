export interface IGameConfig {
    totalFrames: number;
    maxPinsPerFrameInARack: number;
    maxRollsPerFrame: number;
    maxRollsInLastFrame: number;
    availableBonus: {
        strike: {
            enabled: boolean;
            bonusRolls: number;
        };
        spare: {
            enabled: boolean;
            bonusRolls: number;
        };
    };
    players: {
        name: string;
    }[];
}