import { Player } from "./Player";
import { Roll } from "./Roll";

describe('Player', () => {
    test('should get the Nth roll completed by the player', () => {
        const roll1: Roll = new Roll('123', 5, true);
        const roll2: Roll = new Roll('321', 4, true);
        const player: Player = new Player('Player1');

        player.addRoll(roll1);
        player.addRoll(roll2);

        expect(player.getNthRollFromCurrentRoll(roll1, 1)).not.toBeNull();
        expect(player.getNthRollFromCurrentRoll(roll1, 1)).toBe(roll2);
    });

    test('should return null when there is no Nth roll available for the player', () => {
        const roll1: Roll = new Roll('123', 5, true);
        const roll2: Roll = new Roll('321', 4, true);
        const player: Player = new Player('Player1');

        player.addRoll(roll1);
        player.addRoll(roll2);

        expect(player.getNthRollFromCurrentRoll(roll1, 2)).toBeNull();
    });
});