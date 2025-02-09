import { GameError } from "./GameError";

export class InvalidKnockedDownPinsCount extends GameError {
    constructor() {
        super(`Invalid number of pins. Either all pins already knocked down or the number provided is invalid`);
    }
}