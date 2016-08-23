require ("./styles/main.sass");

import "babel-polyfill";

//import {rateServiceRest} from './app/rate_service_rest'
//import RateServiceRest from "./rate_service_rest";
import EventBus from './app/event_bus';
import EventType from './app/event_type';
import EventData from './app/event_data';
import SymbolComponent from './app/symbols_component';
import RatesComponent from './app/rates_component';
import SymbolRow from './app/symbol_row';
import CurrencyPair from './app/currency_pair';
import PairChangeEventData from './app/pair_change_event_data';

let selectedRates: Set<string> = new Set<string>();
let subscribedRates: Set<string> = new Set<string>();
let refreshPeriod = 1000;

let eventBus = EventBus.getInstance();

let symbols = new SymbolComponent("symbols");
let rates = new RatesComponent("rates");

//let rateService = RateServiceRest.getInstance();
//let rateService = rateServiceRest;

let refreshPeriodSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById("refresh_period");
refreshPeriodSelect.onchange = (event) => {
    refreshPeriod = parseInt(refreshPeriodSelect.value);
    //rateService.setRefreshPeriod(refreshPeriod);
    updateHash();
}

symbols.onAddHandler = (pairName) => {
    selectedRates.add(pairName);
    updateHash();
};

symbols.onSubscribeHandler = (pairName) => {
    symbols.updateRow(new SymbolRow(pairName, false, true));
    //rateService.subscribe(pairName);
};

rates.onRemovePairHandler = (pairName: string) => {
    //rateService.unSubscribe(pairName);
}

eventBus.addListener(EventType.SUBSCRIBE, (data: EventData) => {
    let sym = new SymbolRow(data.getData(), true, false);
    symbols.updateRow(sym);
    rates.addOrUpdateRow(sym);
    subscribedRates.add(sym.pairName);
    updateHash();
});

eventBus.addListener(EventType.UNSUBSCRIBE, (data: EventData) => {
    let sym = new SymbolRow(data.getData(), false, false);
    symbols.updateRow(sym);
    rates.removeRow(sym.pairName);
    subscribedRates.delete(sym.pairName);
    updateHash();
});

eventBus.addListener(EventType.PAIR_CHANGE, (data: EventData) => {
    let sym = new SymbolRow(
        (<PairChangeEventData>data.getData()).pairName,
        true,
        false,
        (<CurrencyPair>data.getData()).rate
    );
    rates.addOrUpdateRow(sym);
});

//restore state from url
let hash = window.top.location.hash;
if (hash.length > 0 && hash[0] === "#") {
    hash = hash.substr(1);
}
let parts = hash.split("|");
if (parts.length == 3) {

    refreshPeriodSelect.value = parts[2];
    if (refreshPeriodSelect.selectedIndex == -1) {
        refreshPeriodSelect.value = refreshPeriod.toString();
    } else {
        refreshPeriod = parseInt(refreshPeriodSelect.value);
    }

    if (parts[0].length > 0) {
        selectedRates = new Set(parts[0].toUpperCase().split(","));
    }
    if (parts[1].length > 0) {
        subscribedRates = new Set(parts[1].toUpperCase().split(","));
    }
}

//rateService.setRefreshPeriod(refreshPeriod);

//Preselected pairs
selectedRates.add("EURUSD");
selectedRates.add("EURGBP");
selectedRates.add("EURRUB");

/*for (let pairName of selectedRates) {
    if (pairName) {
        symbols.addRow(pairName);
    }
}

for (let pairName of subscribedRates) {
    if (pairName) {
        symbols.addRow(pairName);
        rateService.subscribe(pairName);
    }
}*/

updateHash();



function updateHash() {
    let hash = Array.from(selectedRates).join(",") + "|" + Array.from(subscribedRates).join(",") + "|" + refreshPeriod;
    window.top.location.hash = hash;
}
