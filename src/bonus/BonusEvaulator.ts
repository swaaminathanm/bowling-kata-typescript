import { Bonus } from "./Bonus";
import { IBonusEvaluator } from "./IBonusEvaulator";
import { IFrame } from "../frame/IFrame";
import { IGameConfig } from "../config/IGameConfig";
import { Roll } from "../Roll";
import { StrikeBonus } from "./StrikeBonus";
import { SpareBonus } from "./SpareBonus";
import { Rack } from "../Rack";

export class BonusEvaulator implements IBonusEvaluator {
    private _gameConfig: IGameConfig

    constructor(gameConfig: IGameConfig) {
        this._gameConfig = gameConfig;
    }

    getApplicableBonus(frame: IFrame, roll: Roll, rack: Rack): Bonus | null {
        const bonusConfig: any = this._gameConfig.availableBonus;

        if (bonusConfig.strike?.enabled) {
            const bonus = new StrikeBonus(frame, roll, rack, bonusConfig.strike.bonusRolls);
            if (bonus.eval()) {
                return bonus;
            }
        }

        if (bonusConfig.spare?.enabled) {
            const bonus = new SpareBonus(frame, roll, rack, bonusConfig.spare.bonusRolls,
                bonusConfig.spare.rollsRequiredToKnockDownAllPins);
            if (bonus.eval()) {
                return bonus;
            }
        }

        return null;
    }

}