import { MockFrame } from "../../frame/mocks/MockFrame";
import { MockPlayer } from "../../mocks/MockPlayer";
import { Rack } from "../../Rack";
import { Roll } from "../../Roll";
import { SpareBonus } from "../SpareBonus";
import { StrikeBonus } from "../StrikeBonus";

describe('SpareBonus', () => {
    test('should return false for eval() when bonus not aplicable', () => {
        const roll = new Roll('123', 4, true);

        const rack = new Rack(10);
        rack.addRoll(new Roll('1234', 5, true));
        rack.addRoll(roll);

        const mockPlayer = new MockPlayer('Player1', [], []);

        const mockFrame = new MockFrame(mockPlayer);

        const spareBonus: SpareBonus = new SpareBonus(
            mockFrame,
            roll,
            rack,
            1,
            2
        );

        expect(spareBonus.eval()).toBe(false);
    });

    test('should return false for eval() when rack has all non complete rolls', () => {
        const roll = new Roll('123');
        roll.completed = false;

        const rack = new Rack(10);
        rack.addRoll(roll);

        const mockPlayer = new MockPlayer('Player1', [], []);

        const mockFrame = new MockFrame(mockPlayer);

        const spareBonus: SpareBonus = new SpareBonus(
            mockFrame,
            roll,
            rack,
            1,
            2
        );

        expect(spareBonus.eval()).toBe(false);
    });

    test('should calculate bonus properly with next roll is complete', () => {
        const roll = new Roll('123', 5, true);

        const rack = new Rack(10);
        rack.addRoll(new Roll('1234', 5, true));
        rack.addRoll(roll);

        const mockPlayer = new MockPlayer('Player1', [], []);
        mockPlayer.getNthRollFromCurrentRoll.mockReturnValueOnce(new Roll('431', 4, true));

        const mockFrame = new MockFrame(mockPlayer);
        mockFrame.getTotalPinsKnockedDown.mockReturnValueOnce(9);

        const spareBonus: SpareBonus = new SpareBonus(
            mockFrame,
            roll,
            rack,
            1,
            2
        );

        expect(spareBonus.eval()).toBe(true);
        expect(spareBonus.calculate()).toBe(4);
        expect(mockPlayer.getNthRollFromCurrentRoll).toHaveBeenCalledTimes(1);
        expect(mockPlayer.getNthRollFromCurrentRoll).toHaveBeenNthCalledWith(1, expect.any(Roll), 1);
    });

    test('should calculate bonus properly with next roll is not applicable', () => {
        const roll = new Roll('123', 5, true);

        const rack = new Rack(10);
        rack.addRoll(new Roll('1234', 5, true));
        rack.addRoll(roll);

        const mockPlayer = new MockPlayer('Player1', [], []);
        mockPlayer.getNthRollFromCurrentRoll.mockReturnValueOnce(null);

        const mockFrame = new MockFrame(mockPlayer);
        mockFrame.getTotalPinsKnockedDown.mockReturnValueOnce(9);

        const spareBonus: SpareBonus = new SpareBonus(
            mockFrame,
            roll,
            rack,
            1,
            2
        );

        expect(spareBonus.eval()).toBe(true);
        expect(spareBonus.calculate()).toBe(0);
        expect(mockPlayer.getNthRollFromCurrentRoll).toHaveBeenCalledTimes(1);
    });
})