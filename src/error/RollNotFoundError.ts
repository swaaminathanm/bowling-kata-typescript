import { Frame } from "../frame/Frame";
import { GameError } from "./GameError";

export class RollNotFoundError extends GameError {
    constructor(frameId: string) {
        super(`Roll not available for frame "${frameId}"`);
    }
}