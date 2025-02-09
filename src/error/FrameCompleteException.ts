import { GameError } from "./GameError";

export class FrameCompleteException extends GameError {
    constructor(frameId: string) {
        super(`Frame "${frameId}" is complete`);
    }
}