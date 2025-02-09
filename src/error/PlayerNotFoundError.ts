import { GameError } from "./GameError";

export class PlayerNotFoundError extends GameError {
    constructor(playerName: string) {
        super(`Player "${playerName}" not found.`);
    }
}