export default class CurrencyPair {

    public currency1: string;
    public currency2: string;
    public rate: number;

    constructor();
    constructor(pairName: string);
    constructor(currency1?: string, currency2?: string) {
        if (currency2 == undefined) {
            if (currency1 != undefined && currency1.length === 6) {
                this.currency1 = currency1.substring(0,3).toUpperCase();
                this.currency2 = currency1.substring(3).toUpperCase();
            }
        } else {
            this.currency1 = (currency1) ? currency1.toUpperCase() : "";
            this.currency2 = (currency2) ? currency2.toUpperCase() : "";
        }
    }

    public getFullName(): string {
        return this.currency1 + this.currency2;
    }
}