export interface Bonus {
    eval(): boolean;

    calculate(): number;

    get bonusRolls(): number
}