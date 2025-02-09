import { IFrame } from "../frame/IFrame";
import { Rack } from "../Rack";
import { Roll } from "../Roll";
import { Bonus } from "./Bonus";

export class SpareBonus implements Bonus {
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
        const rollsOverCount: number = this._rack.rolls.reduce((sum, roll) => {
            if (roll.completed) {
                sum += 1;
                return sum;
            }
            return sum;
        }, 0);

        return (rollsOverCount === 2) && (this._frame.getTotalPinsKnockedDown() >= this._rack.totalPins)
    }

    calculate(): number {
        const roll: Roll | null = this._frame.player.getNthRollFromCurrentRoll(this._roll, 1);

        if (!roll) {
            return 0;
        }

        return roll.pinsKnockedDown;
    }

}