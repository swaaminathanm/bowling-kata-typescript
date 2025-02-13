const { v4: uuidv4 } = require('uuid');
import { Bonus } from "../bonus/Bonus";
import { FrameCompleteException } from "../error/FrameCompleteException";
import { IBonusEvaluator } from "../bonus/IBonusEvaulator";
import { IFrame } from "./IFrame";
import { Player } from "../Player";
import { Roll } from "../Roll";
import { InvalidKnockedDownPinsCount } from "../error/InvalidKnockedDownPinsCount";
import { Rack } from "../Rack";

export class Frame implements IFrame {
    protected _racks: Rack[] = [];
    protected _bonus: Bonus[] = [];
    protected _maxRollsPerFrame: number;
    protected _player: Player;
    protected _id: string
    protected _rolls: Roll[] = [];
    protected _bonusEvaulator: IBonusEvaluator;

    constructor(id: string, maxPinsInTheRack: number, maxRollsPerFrame: number, player: Player, bonusEvaulator: IBonusEvaluator) {
        this._id = id;
        this._player = player;
        this._bonusEvaulator = bonusEvaulator;
        this._maxRollsPerFrame = maxRollsPerFrame;
        this._racks.push(new Rack(maxPinsInTheRack));
    }

    roll(pinsKnockedDown: number): void {
        if (pinsKnockedDown < 0) {
            throw new InvalidKnockedDownPinsCount();
        }

        if (this.isComplete()) {
            throw new FrameCompleteException(this._id);
        }

        const rack: Rack | null = this.getLastNonCompletedRack();

        if (!rack!.canAllowToHit(pinsKnockedDown)) {
            throw new InvalidKnockedDownPinsCount();
        }

        const roll: Roll = new Roll(`roll_${uuidv4()}`);
        this._rolls.push(roll);
        rack!.addRoll(roll);
        this.player.addRoll(roll);

        roll.pinsKnockedDown = pinsKnockedDown;
        roll.completed = true;

        const applicableBonus: Bonus | null = this._bonusEvaulator.getApplicableBonus(this, roll, rack!);
        if (applicableBonus !== null) {
            this._bonus.push(applicableBonus);
        }
    }

    calculateScore(): number {
        const baseScore: number = this.getTotalPinsKnockedDown();
        const bonus: number = this.calculateBonus();
        return baseScore + bonus;
    }

    isComplete(): boolean {
        const completedRollsCount: number = this.getCompletedRollsCount();
        const isRollsOver: boolean = completedRollsCount >= this._maxRollsPerFrame;
        return this._racks[this._racks.length - 1].isCompleted() || isRollsOver;
    }

    public get racks(): Rack[] {
        return this._racks;
    }

    public get id(): string {
        return this._id;
    }

    public get rolls(): Roll[] {
        return this._rolls;
    }

    public get player(): Player {
        return this._player;
    }

    public getTotalPinsKnockedDown(): number {
        return this._rolls.reduce((sum, roll) => sum + roll.pinsKnockedDown, 0);
    }

    protected getCompletedRollsCount(): number {
        return this._rolls.filter((roll) => roll.completed).length;
    }

    protected getLastNonCompletedRack(): Rack | null {
        const racks: Rack[] = this._racks.filter((rack => !rack.isCompleted()));
        return racks.length > 0 ? racks[0] : null;
    }

    private calculateBonus(): number {
        return this._bonus.reduce((sum, b) => sum + b.calculate(), 0);
    }
}