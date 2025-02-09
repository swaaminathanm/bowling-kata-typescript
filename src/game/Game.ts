import { IGame } from "./IGame";
import { Player } from "../Player";
import { IGameConfig } from '../config/IGameConfig';
import { IFrame } from "../frame/IFrame";
import { Roll } from "../Roll";
import { PlayerNotFoundError } from "../error/PlayerNotFoundError";
import { FrameFactory } from "../frame/FrameFactory";
import { FrameNotAvailableError } from "../error/FrameNotAvailableError";
import { IBonusEvaluator } from "../bonus/IBonusEvaulator";

export class Game implements IGame {
    private _players: Player[] = [];
    private _bonusEvaluator: IBonusEvaluator;

    constructor(gameConfig: IGameConfig, bonusEvaluator: IBonusEvaluator) {
        this._bonusEvaluator = bonusEvaluator;
        this.init(gameConfig);
    }

    roll(pinsKnockedDown: number, playerName: string): void {
        const player: Player | null = this.getPlayerFromName(playerName);
        if (!player) {
            throw new PlayerNotFoundError(playerName);
        }

        const frame: IFrame | null = this.getNextOpenFrame(player);
        if (!frame) {
            throw new FrameNotAvailableError(playerName);
        }

        frame.roll(pinsKnockedDown);
    }

    score(playerName: string): number {
        const player: Player | null = this.getPlayerFromName(playerName);
        if (!player) {
            throw new PlayerNotFoundError(playerName);
        }

        return player.frames.reduce((sum, frame) => sum + frame.calculateScore(), 0);
    }

    private getNextOpenFrame(player: Player): IFrame | null {
        const nextFrame: IFrame[] = player.frames.filter(frame => !frame.isComplete());
        return nextFrame.length > 0 ? nextFrame[0] : null;
    }

    private init(gameConfig: IGameConfig): void {
        this.initPlayers(gameConfig);
    }

    private initPlayers(gameConfig: IGameConfig): void {
        this._players = gameConfig.players.map((playerConfig) => {
            const player: Player = new Player(playerConfig.name);
            this.initPlayerFrames(player, gameConfig);
            return player;
        });
    }

    private initPlayerFrames(player: Player, gameConfig: IGameConfig): void {
        Array.from({ length: gameConfig.totalFrames }, (_, index) => {
            const isLastFrame: boolean = (index + 1 === gameConfig.totalFrames)
            const frame: IFrame = FrameFactory.createFrame(gameConfig, player, isLastFrame, this._bonusEvaluator);

            player.addFrame(frame);
        });
    }

    private getPlayerFromName(name: string): Player | null {
        const filteredPlayers = this._players.filter((player) => player.name === name);
        return filteredPlayers.length > 0 ? filteredPlayers[0] : null
    }

}