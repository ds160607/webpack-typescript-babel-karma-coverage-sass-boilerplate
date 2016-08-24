import SymbolRow from './symbol_row';

export default class SymbolComponent {

    private containerId: string;
    private currencies = {
        "CAD": "Canadian Dollar",
        "EUR": "Euro",
        "GBP": "British Pound",
        "JPY": "Japanese Yen",
        "RUB": "Russian Ruble",
        "USD": "US Dollar"
    };

    private table: HTMLTableElement;
    private selectCurrency1: HTMLSelectElement;
    private selectCurrency2: HTMLSelectElement;
    private addNewPairNameButton: HTMLButtonElement;
    private rows: SymbolRow[] = [];
    public onSubscribeHandler: Function;
    public onAddHandler: Function;

    constructor(containerId: string) {
        this.containerId = containerId;
        this.init();
    }

    public addRow(pairName: string) {
        if (this.hasSelectedPairName(pairName)) {
            return;
        }

        this.rows.push(new SymbolRow(pairName));

        let tr = this.table.insertRow(0);
        tr.className = "row";
        let td1 = tr.insertCell(0);
        td1.setAttribute("colspan", "3");
        td1.className = "pair_name";
        td1.innerText = pairName;
        let td2 = tr.insertCell(1);
        td2.innerHTML = `<button id="subscr_pair_btn_${this.containerId}_${pairName}">Add</button>`;

        let subscribeButton = this.getSubscribePairButton(pairName);
        if (this.onAddHandler) {
            this.onAddHandler(pairName);
        }
        subscribeButton.addEventListener('click', () => {
            if (this.onSubscribeHandler) {
                this.onSubscribeHandler(pairName);
            }
        });

        this.invalidate();
    }

    public updateRow(row: SymbolRow) {
        let addButton = this.getSubscribePairButton(row.pairName);
        if (addButton) {
            addButton.disabled = row.subscribed;
        }
    }

    private init() {
        let options = "";
        for (let value in this.currencies) {
            options += this.option(this.currencies[value], value)
        }

        let html = this.body(this.containerId, options);

        let container = document.getElementById(this.containerId);
        container.innerHTML = html;
        this.table = <HTMLTableElement>document.getElementById("sym_" + this.containerId);
        this.selectCurrency1 = <HTMLSelectElement>document.getElementById("cur1_" + this.containerId);
        this.selectCurrency2 = <HTMLSelectElement>document.getElementById("cur2_" + this.containerId);
        this.addNewPairNameButton = <HTMLButtonElement>document.getElementById("add_btn_" + this.containerId);

        this.selectCurrency2.selectedIndex = 1;

        this.selectCurrency1.addEventListener('change', () => { this.invalidate() });
        this.selectCurrency2.addEventListener('change', () => { this.invalidate() });
        this.addNewPairNameButton.addEventListener('click', () => {
            this.addRow(this.getSelectedPairName());

        });

        this.invalidate();
    }

    private invalidate() {
        this.enableAllOptionExcept(this.selectCurrency2, this.selectCurrency1.value);
        this.enableAllOptionExcept(this.selectCurrency1, this.selectCurrency2.value);

        let selectedPairName = this.getSelectedPairName();
        this.addNewPairNameButton.disabled = this.hasSelectedPairName(selectedPairName);
    }

    private enableAllOptionExcept(select: HTMLSelectElement, value: string) {
        let options = select.getElementsByTagName("option");
        for (let i = 0; i < options.length; i++) {
            options[i].disabled = options[i].value === value;
        }
    }

    private getSelectedPairName(): string {
        return this.selectCurrency1.value + this.selectCurrency2.value;
    }

    private hasSelectedPairName(pairName: string): boolean {
        for (let i = 0; i < this.rows.length; i++) {
            if (this.rows[i].pairName == pairName) {
                return true;
            }
        }
        return false;
    }

    private getSubscribePairButton(pairName: string): HTMLButtonElement {
        return <HTMLButtonElement>document.getElementById(`subscr_pair_btn_${this.containerId}_${pairName}`);
    }

    private option(name: string, value: string) {
        return `<option value=${value}>${name}</option>`;
    }

    private body(id: string, options: string) {
        return `<table id="sym_${id}">
        <tbody>
        <tr id="last_row_${id}" class="row currencies-selector">
                <td class="currencies-selector__prefix">
                    <select id="cur1_${id}">
                    ${options}
                    </select>
                </td>
                <td width="10px" class="class="currencies-selector__separator">/</td>
                <td width="1000px" class="currencies-selector__suffix">
                    <select id="cur2_${id}">
                    ${options}
                    </select>
                </td>
                <td class="currencies-selector__button">
                    <button id="add_btn_${id}">Add</button>
                </td>
            </tr></tbody></table>`;
    }
}