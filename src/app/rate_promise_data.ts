export default class RatePromiseData{
    public pairName: string;
    public resolve: Function;
    public reject: Function;

    constructor(pairName: string, resolve: Function, reject: Function) {
        this.pairName = pairName;
        this.resolve = resolve;
        this.reject = reject;
    }
}