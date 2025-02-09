import { Player } from "../Player";
import { Roll } from "../Roll";

export interface IFrame {
    roll(pinsKnockedDown: number): void;

    calculateScore(): number;

    isComplete(): boolean;

    getTotalPinsKnockedDown(): number

    get rolls(): Roll[];

    get player(): Player;
}