const { v4: uuidv4 } = require('uuid');
import { Frame } from "./Frame";
import { IBonusEvaluator } from "../bonus/IBonusEvaulator";
import { IFrame } from "./IFrame";
import { SpecialFrame } from "./SpecialFrame";
import { Player } from "../Player";
import { IGameConfig } from "../config/IGameConfig";

export class FrameFactory {
    public static createFrame(gameConfig: IGameConfig, player: Player, isLast: boolean, bonusEvaulator: IBonusEvaluator): IFrame {
        const frame: Frame = new Frame(`frame_${uuidv4()}`, gameConfig.maxPinsPerFrameInARack, gameConfig.maxRollsPerFrame, player, bonusEvaulator);
        if (isLast) {
            return new SpecialFrame(`frame_${uuidv4()}`, gameConfig.maxPinsPerFrameInARack, gameConfig.maxRollsPerFrame, player, bonusEvaulator, gameConfig.maxRollsInLastFrame);
        }
        return frame;
    }
}