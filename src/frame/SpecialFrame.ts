const { v4: uuidv4 } = require('uuid');
import { Bonus } from "../bonus/Bonus";
import { IBonusEvaluator } from "../bonus/IBonusEvaulator";
import { FrameCompleteException } from "../error/FrameCompleteException";
import { InvalidKnockedDownPinsCount } from "../error/InvalidKnockedDownPinsCount";
import { Frame } from "../frame/Frame";
import { Player } from "../Player";
import { Rack } from "../Rack";
import { Roll } from "../Roll";

export class SpecialFrame extends Frame {
    private _maxCapRollsInLastFrame: number;
    private _pendingBonusRolls: number = 0;
    private _maxPinsInTheRack: number;

    constructor(id: string, maxPinsInTheRack: number, maxRollsPerFrame: number, player: Player, bonusEvaluator: IBonusEvaluator, maxCapRollsInLastFrame: number) {
        super(id, maxPinsInTheRack, maxRollsPerFrame, player, bonusEvaluator);
        this._maxCapRollsInLastFrame = maxCapRollsInLastFrame;
        this._maxPinsInTheRack = maxPinsInTheRack;
    }

    roll(pinsKnockedDown: number): void {
        if (pinsKnockedDown < 0) {
            throw new InvalidKnockedDownPinsCount();
        }

        if (this.isComplete()) {
            throw new FrameCompleteException(this._id);
        }

        const rack: Rack | null = this.getLastNonCompletedRack();

        if (rack!.canAllowToHit(pinsKnockedDown)) {
            throw new InvalidKnockedDownPinsCount();
        }

        const roll: Roll = new Roll(`roll_${uuidv4()}`);
        this._rolls.push(roll);
        rack!.addRoll(roll);
        this.player.addRoll(roll);

        roll.pinsKnockedDown = pinsKnockedDown;
        rack!.hitPins = pinsKnockedDown;
        roll.completed = true;

        const applicableBonus: Bonus | null = this._bonusEvaulator.getApplicableBonus(this, roll, rack!);
        if (applicableBonus !== null) {
            this._bonus.push(applicableBonus);
        }

        this._pendingBonusRolls--;
        if (this._pendingBonusRolls <= 0)
            this._pendingBonusRolls = 0;

        if (applicableBonus) {
            this._pendingBonusRolls += applicableBonus.bonusRolls;
            this._racks.push(new Rack(this._maxPinsInTheRack));
        }
    }

    // calculateScore(): number {
    //     return this.getTotalPinsKnockedDown();
    // }

    isComplete(): boolean {
        const completedRollsCount: number = this.getCompletedRollsCount();
        const isMaxCapReached: boolean = completedRollsCount >= this._maxCapRollsInLastFrame;
        const isNoRollsLeft: boolean = (this._pendingBonusRolls <= 0) && (completedRollsCount >= this._maxRollsPerFrame);
        return isMaxCapReached || isNoRollsLeft;
    }

}