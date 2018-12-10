export interface IType {
    name: string;
    type: string;
    structType?: IType[];
}

export interface ISimClientState {
    meta: Record<string, any>;
    values: Record<string, any>;
}
