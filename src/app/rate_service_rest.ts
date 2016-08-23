/// <reference path="../../typings/money.d.ts" />
/// <reference path="../../typings/jsonp-client.d.ts" />

import EventBus from './event_bus';
import EventData from './event_data';
import EventType from './event_type';
import PairChangeEventData from './pair_change_event_data';
import RatePromiseData from './rate_promise_data';
import CurrencyPair from './currency_pair';
import money = require("money");
import jsonpClient = require("jsonp-client");

class RateServiceRest {
    public BASE_CURRENCY: string = "EUR";

    private refreshPeriod: number;
    private refreshTimer;
    private eventBus = EventBus.getInstance();

    private subscribtions: Set<string> = new Set<string>(); //Pair names
    private rates: Map<string, number> = new Map<string, number>();//currency name: rate to the base currency
    private cachedSymbols: string = "";

    private isUpdating: boolean = false;

    constructor() {
        this.init();
    }

    public setRefreshPeriod(time: string);
    public setRefreshPeriod(time: number);
    public setRefreshPeriod(time: any): boolean {
        let newValue: number = -1;
        if (typeof (time) === 'string') {
            newValue = parseInt(time);
        } else {
            newValue = time;
        }

        if (newValue < 0) {
            return false;
        }

        if (newValue === this.refreshPeriod) {
            return true;
        }

        this.refreshPeriod = newValue;
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
        this.refreshTimer = setInterval(() => { this.fireUpdate(); }, this.refreshPeriod);
        return true;
    }

    public unSubscribe(pairName: string) {

        let value = new CurrencyPair(pairName);

        let rate1ToDelete: boolean = true;
        let rate2ToDelete: boolean = true;

        let item;
        let iterator = this.subscribtions.entries();

        while (!(item = iterator.next()).done) {
            //for ( of this.subscribtions.values()) {
            let subscribtion = item.value;
            if (subscribtion == value.getFullName()) {
                continue;
            }
            if (subscribtion.substring(0, 3) == value.currency1) {
                rate1ToDelete = false;
            }
            if (subscribtion.substring(3) == value.currency2) {
                rate2ToDelete = false;
            }
            if (!rate1ToDelete && !rate2ToDelete) {
                break;
            }
        }

        this.subscribtions.delete(value.getFullName());

        if (rate1ToDelete || rate2ToDelete) {
            let item;
            let iterator = this.rates.keys();
            while (!(item = iterator.next()).done) {
                let pair = item.value;
                if (pair === this.BASE_CURRENCY) {
                    continue;
                }
                if (rate1ToDelete && pair === value.currency1) {
                    this.rates.delete(pair);
                    rate1ToDelete = false;
                }
                if (rate2ToDelete && pair === value.currency2) {
                    this.rates.delete(pair);
                    rate2ToDelete = false;
                }
                if (!rate1ToDelete && !rate2ToDelete) {
                    break;
                }
            }
        }

        this.eventBus.fireEvent(EventType.UNSUBSCRIBE,
            new EventData(EventType.SUBSCRIBE, true, value.getFullName()));
    }

    public subscribe(pairName: string) {

        let pair = new CurrencyPair(pairName);

        this.subscribtions.add(pair.getFullName());
        this._subscribe(pair.currency1);
        this._subscribe(pair.currency2);

        this.eventBus.fireEvent(EventType.SUBSCRIBE,
            new EventData(EventType.SUBSCRIBE, true, pair.getFullName()));

    }

    private _subscribe(currency: string) {
        if (currency !== this.BASE_CURRENCY && !this.rates.has(currency)) {
            this.rates.set(currency, NaN);
        }
    }

    private init() {
        money.base = this.BASE_CURRENCY;
        this.rates.set(this.BASE_CURRENCY, 1);
    }

    //test only//
    public _fireUpdate() { }

    private fireUpdate() {

        this._fireUpdate();

        if (this.isUpdating || this.rates.size < 2) {
            return;
        }

        this.cachedSymbols = "";
        let rate;
        let iterator = this.rates.keys();
        while (!(rate = iterator.next()).done) {
            this.cachedSymbols += rate.value + ","
        }
        this.cachedSymbols = this.cachedSymbols.substring(0, this.cachedSymbols.length - 1);
        let callback = "cb" + (Math.random());
        callback = callback.replace('.', '');

        this.isUpdating = true;
        jsonpClient(
            "http://api.fixer.io/latest?symbols=" + this.cachedSymbols + "&callback=" + callback,
            (err, data) => {
                this.isUpdating = false;
                console.log("JSONP", err, data);
                if (err == null) {
                    money.rates = {};
                    money.rates[this.BASE_CURRENCY] = 1;
                    for (let rate in data.rates) {

                        //Fake fluctuations
                        let _rate = data.rates[rate] * (1 + (0.0005 - Math.random() * 0.001));

                        this.rates.set(rate, _rate);
                        money.rates[rate] = _rate;
                    }

                    this.fireRateUpdates();
                }
            }
        );
    }

    private fireRateUpdates() {
        this.subscribtions.forEach((item) => {
            let currency1 = item.substring(0, 3);
            let currency2 = item.substring(3);
            let rate = money.convert(1, { from: currency1, to: currency2 });
            this.eventBus.fireEvent(
                EventType.PAIR_CHANGE,
                new EventData(EventType.PAIR_CHANGE, true,
                    new PairChangeEventData(item, rate)
                )
            );
        });
    }
}

export const rateServiceRest = new RateServiceRest();