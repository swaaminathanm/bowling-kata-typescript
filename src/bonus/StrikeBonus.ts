import { IFrame } from "../frame/IFrame";
import { Rack } from "../Rack";
import { Roll } from "../Roll";
import { Bonus } from "./Bonus";

export class StrikeBonus implements Bonus {
    private _frame: IFrame;
    private _roll: Roll;
    private _bonusRolls: number;
    private _rack: Rack;

    constructor(frame: IFrame, roll: Roll, rack: Rack, bonusRolls: number) {
        this._frame = frame;
        this._roll = roll;
        this._bonusRolls = bonusRolls;
        this._rack = rack;
    }
    get bonusRolls(): number {
        return this._bonusRolls;
    }

    eval(): boolean {
        return this._roll.completed &&
            (this._roll.pinsKnockedDown >= this._rack.totalPins)
    }

    calculate(): number {
        const roll1: Roll | null = this._frame.player.getNthRollFromCurrentRoll(this._roll, 1);
        const roll2: Roll | null = this._frame.player.getNthRollFromCurrentRoll(this._roll, 2);
        let bonus: number = 0;

        if (roll1 !== null) {
            bonus += roll1.pinsKnockedDown;
        }
        if (roll2 !== null) {
            bonus += roll2.pinsKnockedDown;
        }

        return bonus;
    }

}