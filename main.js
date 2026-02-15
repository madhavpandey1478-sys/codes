(function(){

class PivotPanel extends HTMLElement
{

constructor()
{
    super();

    this.layout =
    {
        columns: [],
        measures: [],
        available: [],
        rows: []
    };

}

connectedCallback()
{
    this.init();
}

init()
{

    const dims =
    this.getAttribute("dimensions") || "";

    const meas =
    this.getAttribute("measures") || "";

    if(dims !== "")
    this.layout.available = dims.split(",");

    if(meas !== "")
    this.layout.measures = meas.split(",");

    this.render();

    this.setupDropZones();

}

render()
{

    this.renderZone("columns");
    this.renderZone("measures");
    this.renderZone("available");
    this.renderZone("rows");

}

renderZone(zone)
{

    const container =
    document.getElementById(zone);

    container.innerHTML = "";

    this.layout[zone].forEach(item =>
    {

        const div =
        document.createElement("div");

        div.className = "item";

        div.innerText = item;

        div.draggable = true;

        div.dataset.value = item;
        div.dataset.zone = zone;

        div.addEventListener("dragstart",
        e =>
        {

            e.dataTransfer.setData(
            "value",
            item);

            e.dataTransfer.setData(
            "from",
            zone);

        });

        container.appendChild(div);

    });

}

setupDropZones()
{

    ["columns","measures","available","rows"]
    .forEach(zone =>
    {

        const element =
        document.getElementById(zone);

        element.addEventListener("dragover",
        e => e.preventDefault());

        element.addEventListener("drop",
        e =>
        {

            e.preventDefault();

            const value =
            e.dataTransfer.getData("value");

            const from =
            e.dataTransfer.getData("from");

            this.moveItem(value, from, zone);

        });

    });

}

moveItem(value, from, to)
{

    if(from === to) return;

    const fromArr = this.layout[from];
    const toArr = this.layout[to];

    const index = fromArr.indexOf(value);

    if(index > -1)
    fromArr.splice(index,1);

    if(toArr.indexOf(value) === -1)
    toArr.push(value);

    this.render();

    this.dispatchEvent(
    new CustomEvent(
    "onLayoutChange",
    {
        detail: this.layout
    }));

}

}

customElements.define(
"com-madhav-pivotpanel",
PivotPanel);

})();
