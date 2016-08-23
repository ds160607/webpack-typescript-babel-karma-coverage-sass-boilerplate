export default class PairChangeEventData {
    pairName: string;
    rate: number;

    constructor();
    constructor(pairName: string, rate: number);
    constructor(pairName?: string, rate?: number) {
        if (pairName != undefined) {
            this.pairName = pairName;
        }
        if (rate != undefined) {
            this.rate = rate;
        }
    }
}