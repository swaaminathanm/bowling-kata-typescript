export interface IGame {
    roll(pinsKnockedDown: number, player: string): void;
  
    score(player: string): number;
  }