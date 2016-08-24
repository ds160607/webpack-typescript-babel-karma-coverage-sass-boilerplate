export default class SymbolRow {
    public pairName: string;
    public price: number;
    public subscribed: boolean;

    constructor(pairName: string);
    constructor(pairName: string, subscribed: boolean);    
    constructor(pairName: string, subscribed: boolean, price: number);
    constructor(pairName: string, subscribed?: boolean, price?: number) {
        this.pairName = pairName.toUpperCase();
        this.subscribed = !!subscribed;        
        this.price = price;
    }
}