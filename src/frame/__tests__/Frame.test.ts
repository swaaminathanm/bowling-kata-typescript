import { IBonusEvaluator } from "../../bonus/IBonusEvaulator";
import { MockBonus } from "../../bonus/mocks/MockBonus";
import { FrameCompleteException } from "../../error/FrameCompleteException";
import { InvalidKnockedDownPinsCount } from "../../error/InvalidKnockedDownPinsCount";
import { MockPlayer } from "../../mocks/MockPlayer";
import { Frame } from "../Frame";

const mockBonusEvaluator: jest.Mocked<IBonusEvaluator> = {
    getApplicableBonus: jest.fn(),
};

describe('Frame', () => {
    const frameId: string = 'frame_123';
    const maxPinsInTheRack: number = 10;

    afterEach(() => {
        mockBonusEvaluator.getApplicableBonus.mockReset();
    });

    test('should throw exception with knocked down piks is less than 0', () => {
        const maxRollsPerFrame: number = 2;
        const player: MockPlayer = new MockPlayer('Player1', [], []);
        const frame: Frame = new Frame(
            frameId,
            maxPinsInTheRack,
            maxRollsPerFrame,
            player,
            mockBonusEvaluator
        );

        expect(() => { frame.roll(-1); }).toThrow(InvalidKnockedDownPinsCount);
    });

    test('should throw exception when roll happens after frame is has the rolls exhausted', () => {
        const maxRollsPerFrame: number = 2;
        const player: MockPlayer = new MockPlayer('Player1', [], []);
        const frame: Frame = new Frame(
            frameId,
            maxPinsInTheRack,
            maxRollsPerFrame,
            player,
            mockBonusEvaluator
        );

        mockBonusEvaluator.getApplicableBonus.mockReturnValue(null);

        expect(() => {
            frame.roll(5);
            frame.roll(5);
            frame.roll(5);
        }).toThrow(FrameCompleteException);
    });

    test('should successfully calculate score for a non bonus frame', () => {
        const maxRollsPerFrame: number = 2;
        const player: MockPlayer = new MockPlayer('Player1', [], []);
        const frame: Frame = new Frame(
            frameId,
            maxPinsInTheRack,
            maxRollsPerFrame,
            player,
            mockBonusEvaluator
        );

        mockBonusEvaluator.getApplicableBonus.mockReturnValue(null);

        frame.roll(4);
        frame.roll(3);

        expect(frame.calculateScore()).toBe(7);
    });

    test('should successfully calculate score for a bonus frame', () => {
        const maxRollsPerFrame: number = 2;
        const player: MockPlayer = new MockPlayer('Player1', [], []);
        const frame: Frame = new Frame(
            frameId,
            maxPinsInTheRack,
            maxRollsPerFrame,
            player,
            mockBonusEvaluator
        );

        const mockSpareBonus = new MockBonus(1);

        mockSpareBonus.calculate.mockReturnValueOnce(4);

        mockBonusEvaluator.getApplicableBonus.mockReturnValueOnce(null);
        mockBonusEvaluator.getApplicableBonus.mockReturnValueOnce(mockSpareBonus);

        frame.roll(5);
        frame.roll(5);

        expect(frame.calculateScore()).toBe(14);
    });
});