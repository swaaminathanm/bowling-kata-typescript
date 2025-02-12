import { Player } from "../../Player";
import { SpecialFrame } from "../SpecialFrame";
import { IBonusEvaluator } from '../../bonus/IBonusEvaulator';
import { InvalidKnockedDownPinsCount } from "../../error/InvalidKnockedDownPinsCount";
import { FrameCompleteException } from "../../error/FrameCompleteException";
import { MockBonus } from "../../bonus/mocks/MockBonus";

const mockBonusEvaluator: jest.Mocked<IBonusEvaluator> = {
    getApplicableBonus: jest.fn(),
};

describe('SpecialFrame', () => {
    const frameId: string = 'frame_123';
    const maxPinsInTheRack: number = 10;
    const maxCapRollsInLastFrame: number = 3;

    afterEach(() => {
        mockBonusEvaluator.getApplicableBonus.mockReset();
    });

    test('should throw expection when the pins yet to be knocked down is more than the rack size', () => {
        const maxRollsPerFrame: number = 2;
        const player: Player = new Player('Player1');
        const frame: SpecialFrame = new SpecialFrame(
            frameId,
            maxPinsInTheRack,
            maxRollsPerFrame,
            player,
            mockBonusEvaluator,
            maxCapRollsInLastFrame
        );

        expect(() => { frame.roll(20) }).toThrow(InvalidKnockedDownPinsCount);
    });

    test('should throw expection when the pins yet to be knocked down is less than 0', () => {
        const maxRollsPerFrame: number = 2;
        const player: Player = new Player('Player1');
        const frame: SpecialFrame = new SpecialFrame(
            frameId,
            maxPinsInTheRack,
            maxRollsPerFrame,
            player,
            mockBonusEvaluator,
            maxCapRollsInLastFrame
        );

        expect(() => { frame.roll(-1) }).toThrow(InvalidKnockedDownPinsCount);
    });

    test('should throw expection when roll happens after the frame is complete', () => {
        const maxRollsPerFrame: number = 1;
        const player: Player = new Player('Player1');
        const frame: SpecialFrame = new SpecialFrame(
            frameId,
            maxPinsInTheRack,
            maxRollsPerFrame,
            player,
            mockBonusEvaluator,
            maxCapRollsInLastFrame
        );

        expect(() => {
            frame.roll(2);
            frame.roll(2);
        }).toThrow(FrameCompleteException);
    });

    test('should complete the frame successfully and with correct score when no bonus applicable', () => {
        const maxRollsPerFrame: number = 2;
        const player: Player = new Player('Player1');

        mockBonusEvaluator.getApplicableBonus.mockReturnValue(null);

        const frame: SpecialFrame = new SpecialFrame(
            frameId,
            maxPinsInTheRack,
            maxRollsPerFrame,
            player,
            mockBonusEvaluator,
            maxCapRollsInLastFrame
        );

        frame.roll(4);
        frame.roll(4);

        expect(player.rolls.length).toBe(2);
        expect(frame.racks.length).toBe(1);
        expect(frame.calculateScore()).toBe(8);
    });

    test('should complete the frame when all rolls have strike bonus', () => {
        const maxRollsPerFrame: number = 2;
        const player: Player = new Player('Player1');

        const frame: SpecialFrame = new SpecialFrame(
            frameId,
            maxPinsInTheRack,
            maxRollsPerFrame,
            player,
            mockBonusEvaluator,
            maxCapRollsInLastFrame
        );

        const mockStrikeBonus = new MockBonus(2);

        mockStrikeBonus.calculate.mockReturnValueOnce(20);
        mockStrikeBonus.calculate.mockReturnValueOnce(10);
        mockStrikeBonus.calculate.mockReturnValueOnce(0);

        mockBonusEvaluator.getApplicableBonus.mockReturnValue(mockStrikeBonus);

        frame.roll(10);
        frame.roll(10);
        frame.roll(10);

        expect(frame.calculateScore()).toBe(60);
        expect(frame.racks.length).toBe(4);
        expect(mockBonusEvaluator.getApplicableBonus).toHaveBeenCalledTimes(3);
    });

    test('should complete the frame when all rolls have a spare bonus', () => {
        const maxRollsPerFrame: number = 2;
        const player: Player = new Player('Player1');

        const frame: SpecialFrame = new SpecialFrame(
            frameId,
            maxPinsInTheRack,
            maxRollsPerFrame,
            player,
            mockBonusEvaluator,
            maxCapRollsInLastFrame
        );

        const mockSpareBonus = new MockBonus(1);

        mockSpareBonus.calculate.mockReturnValue(4);

        mockBonusEvaluator.getApplicableBonus.mockReturnValueOnce(null);
        mockBonusEvaluator.getApplicableBonus.mockReturnValueOnce(mockSpareBonus);
        mockBonusEvaluator.getApplicableBonus.mockReturnValueOnce(null);

        frame.roll(5);
        frame.roll(5);
        frame.roll(4);

        expect(frame.calculateScore()).toBe(18);
        expect(frame.racks.length).toBe(2);
    });

    test('should complete the frame when all rolls have a mix of strike and spare bonus', () => {
        const maxRollsPerFrame: number = 2;
        const maxCapRollsInLastFrame: number = 4;
        const player: Player = new Player('Player1');

        const frame: SpecialFrame = new SpecialFrame(
            frameId,
            maxPinsInTheRack,
            maxRollsPerFrame,
            player,
            mockBonusEvaluator,
            maxCapRollsInLastFrame
        );

        const mockSpareBonus = new MockBonus(1);
        const mockStrikeBonus = new MockBonus(2);

        mockStrikeBonus.calculate.mockReturnValueOnce(10);
        mockSpareBonus.calculate.mockReturnValueOnce(4);

        mockBonusEvaluator.getApplicableBonus.mockReturnValueOnce(mockStrikeBonus);
        mockBonusEvaluator.getApplicableBonus.mockReturnValueOnce(null);
        mockBonusEvaluator.getApplicableBonus.mockReturnValueOnce(mockSpareBonus);
        mockBonusEvaluator.getApplicableBonus.mockReturnValueOnce(null);

        frame.roll(10);
        frame.roll(5);
        frame.roll(5);
        frame.roll(4);

        expect(frame.calculateScore()).toBe(38);
        expect(frame.racks.length).toBe(3);
    });
});