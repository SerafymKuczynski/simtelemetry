import { IType, ISimClientState } from "./type";

export default abstract class SimClient {

    public abstract readonly game: string;
    public abstract state: ISimClientState;
    public isRunning = false;
    public gameIsActive = false;
    public status = "";

    public abstract get fields(): {
        meta: IType[];
        values: IType[];
    };

    protected options: any;

    constructor(options?: any) {
        this.options = options;
    }

    public abstract start(): void;
    public abstract stop(): void;

}
