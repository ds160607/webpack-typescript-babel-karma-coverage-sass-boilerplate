import EventType from './event_type';


export default class EventData {
    private name: EventType;
    private result: boolean = true;
    private data: any = null;

    constructor(name: EventType);
    constructor(name: EventType, result: boolean);
    constructor(name: EventType, result: boolean, data: any);
    constructor(name: EventType, result?: boolean, data?: any) {
        this.name = name;
        if (result != undefined) {
            this.result = result;
        }
        if (data != undefined) {
            this.data = data;
        }
    }

    public getName(): EventType {
        return this.name;
    }

    public getResult(): boolean {
        return this.data;
    }

    public getData(): any {
        return this.data;
    }
}