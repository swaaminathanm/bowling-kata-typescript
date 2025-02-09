import { InvalidKnockedDownPinsCount } from "./error/InvalidKnockedDownPinsCount";
import { Roll } from "./Roll";

export class Rack {
    private _hitPins: number = 0;
    private _rolls: Roll[] = [];
    readonly totalPins: number;

    constructor(totalPins: number) {
        this.totalPins = totalPins;
    }

    get hitPins(): number {
        return this._hitPins;
    }

    get rolls(): Roll[] {
        return this._rolls;
    }

    set hitPins(pins: number) {
        this._hitPins += pins;
    }

    public addRoll(roll: Roll): void {
        this._rolls.push(roll);
    }

    getKnockedDownPins(): number {
        return this._rolls.reduce((sum, roll) => roll.pinsKnockedDown, 0);
    }

    getAvailablePins(): number {
        return this.totalPins - this._hitPins;
    }

    canAllowToHit(pinsKnockedDown: number): boolean {
        return (this.getKnockedDownPins() + pinsKnockedDown) > this.totalPins;
    }

    isCompleted(): boolean {
        return this._hitPins >= this.totalPins;
    }
}