import { Roll } from "./Roll";

export class Rack {
    private _rolls: Roll[] = [];
    readonly totalPins: number;

    constructor(totalPins: number) {
        this.totalPins = totalPins;
    }

    get rolls(): Roll[] {
        return this._rolls;
    }

    public addRoll(roll: Roll): void {
        this._rolls.push(roll);
    }

    getCompletedRolls(): Roll[] {
        return this._rolls.filter(roll => roll.completed);
    }

    getKnockedDownPins(): number {
        return this._rolls.reduce((sum, roll) => sum + roll.pinsKnockedDown, 0);
    }

    getAvailablePins(): number {
        return this.totalPins - this.getKnockedDownPins();
    }

    canAllowToHit(pinsKnockedDown: number): boolean {
        return (this.getKnockedDownPins() + pinsKnockedDown) <= this.totalPins;
    }

    isCompleted(): boolean {
        return this.getKnockedDownPins() >= this.totalPins;
    }
}