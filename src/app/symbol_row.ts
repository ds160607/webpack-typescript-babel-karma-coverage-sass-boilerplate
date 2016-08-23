export default class SymbolRow {
    public pairName: string;
    public price: number;
    public subscribed: boolean;
    public inProgress: boolean;

    constructor(pairName: string);
    constructor(pairName: string, subscribed: boolean, inProgress: boolean);    
    constructor(pairName: string, subscribed: boolean, inProgress: boolean, price: number);
    constructor(pairName: string, subscribed?: boolean, inProgress?: boolean, price?: number) {
        this.pairName = pairName.toUpperCase();
        this.subscribed = !!subscribed;
        this.inProgress = !!inProgress;
        this.price = price;
    }
}