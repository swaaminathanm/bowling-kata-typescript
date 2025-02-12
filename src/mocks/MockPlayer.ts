import { IFrame } from "../frame/IFrame";
import { MockFrame } from "../frame/mocks/MockFrame";
import { Player } from "../Player";
import { Roll } from "../Roll";

export class MockPlayer extends Player {
    private _mockRolls: Roll[];
    protected _mockName: string;
    private _mockFrames: MockFrame[];

    constructor(name: string, rolls: Roll[], frames: MockFrame[]) {
        super(name)
        this._mockName = name;
        this._mockFrames = frames;
        this._mockRolls = rolls;
    }

    get name(): string {
        return this._mockName;
    }

    get rolls(): Roll[] {
        return this._mockRolls;
    }

    get frames(): MockFrame[] {
        return this._mockFrames;
    }

    addFrame = jest.fn();

    addRoll = jest.fn();

    getNthRollFromCurrentRoll = jest.fn();
}