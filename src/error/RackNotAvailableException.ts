import { Frame } from "../frame/Frame";
import { GameError } from "./GameError";

export class RackNotAvailableException extends GameError {
    constructor(frameId: string) {
        super(`Rack not available in the Frame "${frameId}"`);
    }
}