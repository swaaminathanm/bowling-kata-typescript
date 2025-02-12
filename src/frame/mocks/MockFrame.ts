import { MockPlayer } from "../../mocks/MockPlayer";
import { Player } from "../../Player";
import { IFrame } from "../IFrame";

export class MockFrame implements IFrame {
    private _mockPlayer: MockPlayer

    constructor(player: MockPlayer) {
        this._mockPlayer = player;
    }

    roll = jest.fn();

    calculateScore = jest.fn().mockReturnValue(0);

    isComplete = jest.fn().mockReturnValue(false);

    getTotalPinsKnockedDown = jest.fn().mockReturnValue(0);

    get player(): Player {
        return this._mockPlayer;
    }
}