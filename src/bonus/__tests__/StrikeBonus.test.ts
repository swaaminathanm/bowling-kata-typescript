import { MockFrame } from "../../frame/mocks/MockFrame";
import { MockPlayer } from "../../mocks/MockPlayer";
import { Rack } from "../../Rack";
import { Roll } from "../../Roll";
import { StrikeBonus } from "../StrikeBonus";

describe('StrikeBonus', () => {
    test('should return false for eval() when bonus not aplicable', () => {
        const roll = new Roll('123', 9, true);
        const rack = new Rack(10);
        const mockPlayer = new MockPlayer('Player1', [], []);
        const mockFrame = new MockFrame(mockPlayer);
        const strikeBonus: StrikeBonus = new StrikeBonus(
            mockFrame,
            roll,
            rack,
            2
        );

        expect(strikeBonus.eval()).toBe(false);
    });

    test('should calculate bonus properly with next 2 rolls complete', () => {
        const roll = new Roll('123', 10, true);
        const rack = new Rack(10);

        const mockPlayer = new MockPlayer('Player1', [], []);

        const mockFrame = new MockFrame(mockPlayer);

        mockPlayer.getNthRollFromCurrentRoll.mockReturnValueOnce(new Roll('321', 4, true));
        mockPlayer.getNthRollFromCurrentRoll.mockReturnValueOnce(new Roll('3214', 2, true));

        const strikeBonus: StrikeBonus = new StrikeBonus(
            mockFrame,
            roll,
            rack,
            2
        );

        expect(strikeBonus.eval()).toBe(true);
        expect(strikeBonus.calculate()).toBe(6);
        expect(mockPlayer.getNthRollFromCurrentRoll).toHaveBeenCalledTimes(2);
        expect(mockPlayer.getNthRollFromCurrentRoll).toHaveBeenNthCalledWith(1, expect.any(Roll), 1);
        expect(mockPlayer.getNthRollFromCurrentRoll).toHaveBeenNthCalledWith(2, expect.any(Roll), 2);
    });

    test('should calculate bonus properly with next 2 rolls are not applicable', () => {
        const roll = new Roll('123', 10, true);
        const rack = new Rack(10);

        const mockPlayer = new MockPlayer('Player1', [], []);

        const mockFrame = new MockFrame(mockPlayer);

        mockPlayer.getNthRollFromCurrentRoll.mockReturnValueOnce(null);
        mockPlayer.getNthRollFromCurrentRoll.mockReturnValueOnce(null);

        const strikeBonus: StrikeBonus = new StrikeBonus(
            mockFrame,
            roll,
            rack,
            2
        );

        expect(strikeBonus.eval()).toBe(true);
        expect(strikeBonus.calculate()).toBe(0);
    });
})