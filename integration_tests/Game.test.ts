import { Game } from '../src/game/Game';
import { BonusEvaulator } from '../src/bonus/BonusEvaulator';
import { IBonusEvaluator } from '../src/bonus/IBonusEvaulator';
import { IGameConfig } from '../src/config/IGameConfig';
import { InvalidKnockedDownPinsCount } from '../src/error/InvalidKnockedDownPinsCount';

describe('The Bowling Game', () => {
    const mockGameConfig: IGameConfig = {
        totalFrames: 2,
        maxPinsPerFrameInARack: 10,
        maxRollsPerFrame: 2,
        maxRollsInLastFrame: 2,
        availableBonus: {
            strike: {
                enabled: true,
                bonusRolls: 2,
                rollsRequiredToKnockDownAllPins: 1
            },
            spare: {
                enabled: true,
                bonusRolls: 1,
                rollsRequiredToKnockDownAllPins: 2
            },
        },
        players: [
            { name: 'Player1' }
        ],
    };
    const bonusEvaluator: IBonusEvaluator = new BonusEvaulator(mockGameConfig);

    test('should successfully complete a perfect game with no bonus at all', () => {
        const game: Game = new Game(mockGameConfig, bonusEvaluator);
        const playerName: string = mockGameConfig.players[0].name;

        /*
        | Frame | Roll 1 | Roll 2 | Frame Score | Cumulative Score |
        |-------|--------|--------|-------------|-------------------|
        |   1   |   4    |   3    |     7       |         7         |
        |   2   |   2    |   1    |     3       |        10         |
        */
        game.roll(4, playerName);
        game.roll(3, playerName);
        game.roll(2, playerName);
        game.roll(1, playerName);

        expect(game.score(playerName)).toBe(10);
    });

    test('should successfully complete a perfect game (all strikes)', () => {
        const updatedMockGameConfig: IGameConfig = structuredClone(mockGameConfig);
        updatedMockGameConfig.maxRollsInLastFrame = 3;

        const game: Game = new Game(updatedMockGameConfig, bonusEvaluator);
        const playerName: string = updatedMockGameConfig.players[0].name;

        /*
        | Frame | Roll 1 | Roll 2 | Bonus Rolls | Frame Score | Cumulative Score |
        |-------|--------|--------|-------------|-------------|-------------------|
        |   1   |   10   |   -    |   10 + 10   |     30      |        30         |
        |   2   |   10   |   -    |   10 + 10   |     30      |        60         |
        |   2   |   10   |   -    |   10        |     20      |        80         |
        |   2   |   10   |   -    |   -         |     10      |        90         |
        */
        game.roll(10, playerName);
        game.roll(10, playerName);
        game.roll(10, playerName);
        game.roll(10, playerName);

        expect(game.score(playerName)).toBe(90);
    });

    test('should successfully complete a game with all zeros', () => {
        const updatedMockGameConfig: IGameConfig = structuredClone(mockGameConfig);
        updatedMockGameConfig.maxRollsInLastFrame = 2;

        const game: Game = new Game(updatedMockGameConfig, bonusEvaluator);
        const playerName: string = updatedMockGameConfig.players[0].name;

        /*
        | Frame | Roll 1 | Roll 2 | Bonus Rolls | Frame Score | Cumulative Score |
        |-------|--------|--------|-------------|-------------|-------------------|
        |   1   |   0    |   0    |   -         |      0      |         0         |
        |   2   |   0    |   0    |   -         |      0      |         0         |
        */
        game.roll(0, playerName);
        game.roll(0, playerName);
        game.roll(0, playerName);
        game.roll(0, playerName);

        expect(game.score(playerName)).toBe(0);
    });

    test('should correctly calculate score with all spares', () => {
        const updatedMockGameConfig: IGameConfig = structuredClone(mockGameConfig);
        updatedMockGameConfig.maxRollsInLastFrame = 3;

        const game: Game = new Game(updatedMockGameConfig, bonusEvaluator);
        const playerName: string = updatedMockGameConfig.players[0].name;

        /*
        | Frame | Roll 1 | Roll 2 | Frame Score | Cumulative Score |
        |-------|--------|--------|-------------|-------------------|
        |   1   |   5    |   5    |     15      |        15         |
        |   2   |   5    |   5    |     15      |        30         |
        |   2   |   5    |   -    |     5       |        35         |
        */
        game.roll(5, playerName);
        game.roll(5, playerName);
        game.roll(5, playerName);
        game.roll(5, playerName);
        game.roll(5, playerName);

        expect(game.score(playerName)).toBe(35);
    });

    test('should correctly calculate score with a spare bonus in the last frame', () => {
        const updatedMockGameConfig: IGameConfig = structuredClone(mockGameConfig);
        updatedMockGameConfig.maxRollsInLastFrame = 3;

        const game: Game = new Game(updatedMockGameConfig, bonusEvaluator);
        const playerName: string = updatedMockGameConfig.players[0].name;

        /*
        | Frame | Roll 1 | Roll 2 | Frame Score | Cumulative Score |
        |-------|--------|--------|-------------|-------------------|
        |   1   |   10   |   -    |     20      |        20         |
        |   2   |    5   |    5   |     20      |        40         |
        |   2   |   10   |   -    |     10      |        50         |
        */
        game.roll(10, playerName);
        game.roll(5, playerName);
        game.roll(5, playerName);
        game.roll(10, playerName);

        expect(game.score(playerName)).toBe(50);
    });

    test('should correctly calculate score with a strike bonus in the last frame', () => {
        const updatedMockGameConfig: IGameConfig = structuredClone(mockGameConfig);
        updatedMockGameConfig.maxRollsInLastFrame = 3;

        const game: Game = new Game(updatedMockGameConfig, bonusEvaluator);
        const playerName: string = updatedMockGameConfig.players[0].name;

        /*
        | Frame | Roll 1 | Roll 2 | Frame Score | Cumulative Score |
        |-------|--------|--------|-------------|-------------------|
        |   1   |   10   |   -    |   24        |        24         |
        |   2   |   10   |   -    |   18        |        42         |
        |   2   |   4    |   -    |    4        |        46         |
        |   2   |   4    |   -    |    4        |        50         |
        */
        game.roll(10, playerName);
        game.roll(10, playerName);
        game.roll(4, playerName);
        game.roll(4, playerName);

        expect(game.score(playerName)).toBe(50);
    });

    test('should correctly calculate score with no bonus in the last frame', () => {
        const updatedMockGameConfig: IGameConfig = structuredClone(mockGameConfig);
        updatedMockGameConfig.maxRollsInLastFrame = 3;

        const game: Game = new Game(updatedMockGameConfig, bonusEvaluator);
        const playerName: string = updatedMockGameConfig.players[0].name;

        /*
        | Frame | Roll 1 | Roll 2 | Frame Score | Cumulative Score |
        |-------|--------|--------|-------------|-------------------|
        |   1   |   10   |   -    |     19      |        19         |
        |   2   |    5   |    4   |     9       |        28         |
        */
        game.roll(10, playerName);
        game.roll(5, playerName);
        game.roll(4, playerName);

        expect(game.score(playerName)).toBe(28);
    });

    test('should throw exception when knocked pins are greater than maximun rack pins in a frame', () => {
        const game: Game = new Game(mockGameConfig, bonusEvaluator);
        const playerName: string = mockGameConfig.players[0].name;

        expect(() => {
            game.roll(4, playerName);
            game.roll(10, playerName);
        }).toThrow(InvalidKnockedDownPinsCount);
    });

    test('should throw exception when knocked pins are greater maximun rack pins in a frame when bonus is applicable', () => {
        const game: Game = new Game(mockGameConfig, bonusEvaluator);
        const playerName: string = mockGameConfig.players[0].name;

        expect(() => {
            game.roll(10, playerName);
            game.roll(10, playerName);
            game.roll(11, playerName);
        }).toThrow(InvalidKnockedDownPinsCount);
    });

    test('should successfully complete a perfect game for 2 players', () => {
        const updatedMockGameConfig: IGameConfig = structuredClone(mockGameConfig);
        updatedMockGameConfig.maxRollsInLastFrame = 3;
        updatedMockGameConfig.players.push({ name: 'Player2' });

        const game: Game = new Game(updatedMockGameConfig, bonusEvaluator);
        const player1Name: string = updatedMockGameConfig.players[0].name;
        const player2Name: string = updatedMockGameConfig.players[1].name;

        /*
        | Player | Frame | Roll 1 | Roll 2 | Frame Score | Cumulative Score |
        |--------|-------|--------|--------|-------------|-------------------|
        |   1    |   1   |   4    |   3    |     7       |         7         |
        |   1    |   2   |   2    |   1    |     3       |        10         |
        |--------|-------|--------|--------|-------------|-------------------|
        |   2    |   1   |   5    |   2    |     7       |         7         |
        |   2    |   2   |   3    |   4    |     7       |        14         |
        */

        game.roll(4, player1Name);
        game.roll(3, player1Name);
        game.roll(2, player1Name);
        game.roll(1, player1Name);

        game.roll(5, player2Name);
        game.roll(2, player2Name);
        game.roll(3, player2Name);
        game.roll(4, player2Name);

        expect(game.score(player1Name)).toBe(10);
        expect(game.score(player2Name)).toBe(14);
    });
});