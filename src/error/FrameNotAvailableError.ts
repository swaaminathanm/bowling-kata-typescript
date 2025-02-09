import { GameError } from "./GameError";

export class FrameNotAvailableError extends GameError {
    constructor(playerName: string) {
        super(`Frame not available for "${playerName}"`);
    }
}