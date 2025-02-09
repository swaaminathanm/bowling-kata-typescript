import { IFrame } from "./frame/IFrame";
import { Roll } from "./Roll";

export class Player {
    private _name: string;
    private _frames: IFrame[] = [];
    private _rolls: Roll[] = [];

    constructor(name: string) {
        this._name = name;
    }

    public get name(): string {
        return this._name;
    }

    public addFrame(frame: IFrame): void {
        this._frames.push(frame);
    }

    public addRoll(roll: Roll): void {
        this._rolls.push(roll);
    }

    public getNthRollFromCurrentRoll(roll: Roll, n: number): Roll | null {
        const currentRollIndex = this._rolls.indexOf(roll);

        if (currentRollIndex === -1) {
            return null;
        }

        const targetIndex = currentRollIndex + n;

        if (targetIndex >= 0 && targetIndex < this._rolls.length) {
            return this._rolls[targetIndex];
        }

        return null;
    }

    public get frames(): IFrame[] {
        return this._frames;
    }
}