import EventType from './event_type';

export default class EventBus {

    private static _instance: EventBus = new EventBus();

    private handlers = {}

    constructor() {
        if (EventBus._instance) {
            throw new Error("Error: Instantiation failed: Use EventBus.getInstance() instead of new.");
        }
        EventBus._instance = this;
    }

    public static getInstance(): EventBus {
        return EventBus._instance;
    }

    public addListener(eventType: EventType, handler: Function) {
        if (!(eventType in this.handlers)) {
            this.handlers[eventType] = [];
        }

        this.handlers[eventType].push(handler);
    }

    public fireEvent(eventType: EventType, ...args: any[]) {
        if (eventType in this.handlers) {
            for (let i = 0; i < this.handlers[eventType].length; i++) {
                this.handlers[eventType][i](...args);
            }
        }
    }
}