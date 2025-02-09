export class Roll {
    private _pinsKnockedDown: number;
    private _completed: boolean;
    private _id: string;

    constructor(id: string, pinsKnockedDown: number = 0, completed: boolean = false) {
        this._pinsKnockedDown = pinsKnockedDown;
        this._completed = completed;
        this._id = id;
    }

    public get pinsKnockedDown(): number {
        return this._pinsKnockedDown;
    }

    public set pinsKnockedDown(value: number) {
        this._pinsKnockedDown = value;
    }

    public get completed(): boolean {
        return this._completed;
    }

    public set completed(value: boolean) {
        this._completed = value;
    }
}