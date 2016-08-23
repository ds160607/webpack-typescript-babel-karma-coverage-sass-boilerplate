import SymbolRow from './symbol_row';

export default class RatesComponent {

    private containerId: string;
    private table: HTMLTableElement;
    private tbody: HTMLTableSectionElement;
    public onRemovePairHandler: Function;

    constructor(containerId: string) {
        this.containerId = containerId;
        this.init();
    }

    public addOrUpdateRow(row: SymbolRow) {
        let tr: HTMLTableRowElement, td: HTMLTableCellElement;

        let rowIndex = this.getRowIndex(row.pairName);

        if (rowIndex >= 0) {
            tr = <HTMLTableRowElement>this.tbody.rows.item(rowIndex);
            td = <HTMLTableCellElement>tr.cells.item(1);
            if (row.price != undefined) {
                td.innerText = row.price.toFixed(5);
            }
        } else {
            tr = this.tbody.insertRow(-1);
            tr.id = `rates_row_${this.containerId}_${row.pairName}`;
            tr.className = "row row_even";
            td = tr.insertCell(0);
            td.className = "pair_name";
            td.innerText = row.pairName;
            td = tr.insertCell(1);
            if (row.price != undefined) {
                td.innerText = row.price.toFixed(5);
            }
            td = tr.insertCell(2);
            td.innerHTML = `<button id="rates_remove_${this.containerId}_${row.pairName}">Remove</button>`;

            let removeButton = <HTMLButtonElement>document.getElementById(`rates_remove_${this.containerId}_${row.pairName}`);
            removeButton.addEventListener("click", () => {
                if (this.onRemovePairHandler) {
                    removeButton.disabled = true;
                    this.onRemovePairHandler(row.pairName);
                    this.removeRow(row.pairName);
                }
            })
        }
    }

    public removeRow(pairName: string) {
        let rowIndex = this.getRowIndex(pairName);
        if (rowIndex >= 0) {
            this.tbody.deleteRow(rowIndex);
        }
    }

    private init() {
        let html = this.body(this.containerId);

        let container = document.getElementById(this.containerId);
        container.innerHTML = html;

        this.table = <HTMLTableElement>document.getElementById("rates_" + this.containerId);
        this.tbody = <HTMLTableSectionElement>document.getElementById("rates_tbody_" + this.containerId);
    }

    private getRowIndex(pairName: string): number {
        for (let i = 0; i < this.tbody.childElementCount; i++) {
            let tr = <HTMLTableRowElement>this.tbody.children.item(i);
            if (tr.id == `rates_row_${this.containerId}_${pairName}`) {
                return i;
            }
        }
        return -1;
    }

    private invalidate() {
    }

    private body(id: string) {
        return `<table id="rates_${id}">
            <thead>
                <tr>
                    <th>Symbol</th>
                    <th>Price</th>
                    <th></th>
                </tr>
            </thead>
            <tbody id="rates_tbody_${id}"></tbody>
        </table>`;
    }
}