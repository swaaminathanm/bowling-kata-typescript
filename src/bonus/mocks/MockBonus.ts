import { IFrame } from "../../frame/IFrame";
import { Rack } from "../../Rack";
import { Roll } from "../../Roll";
import { StrikeBonus } from "../StrikeBonus";

export class MockBonus extends StrikeBonus {
    private _mockBonusRolls: number;

    constructor(bonusRolls: number) {
        super({} as IFrame, {} as Roll, {} as Rack, 0);
        this._mockBonusRolls = bonusRolls;
    }

    eval = jest.fn();

    calculate = jest.fn();

    get bonusRolls(): number {
        return this._mockBonusRolls;
    }
}