(function(){

class DragDropPivot extends HTMLElement
{

constructor()
{
    super();

    this._shadowRoot = this.attachShadow({mode:"open"});

}

connectedCallback()
{

    this.loadUI();

}

loadUI()
{

    const dimensions =
    this.getAttribute("dimensions") ||
    "GL_ACCOUNT,COMPANY,COSTCENTER,DATE";

    const dimArray = dimensions.split(",");

    const list =
    this.shadowRoot.getElementById("dimensionList");

    dimArray.forEach(dim =>
    {

        const div =
        document.createElement("div");

        div.innerText = dim;

        div.className = "dimension";

        div.draggable = true;

        div.dataset.dimension = dim;

        div.addEventListener("dragstart",
        e =>
        {

            e.dataTransfer.setData(
            "dimension",
            dim
            );

        });

        list.appendChild(div);

    });

    this.setupDropZone("rowZone","ROWS");

    this.setupDropZone("colZone","COLUMNS");

}

setupDropZone(zoneId,axis)
{

    const zone =
    this.shadowRoot.getElementById(zoneId);

    zone.addEventListener("dragover",
    e => e.preventDefault());

    zone.addEventListener("drop",
    e =>
    {

        e.preventDefault();

        const dimension =
        e.dataTransfer.getData("dimension");

        this.dispatchEvent(
        new CustomEvent(
        "onDrop",
        {
            detail:
            {
                dimension:dimension,
                axis:axis
            }
        }));

    });

}

}

customElements.define(
"com-madhav-dragdroppivot",
DragDropPivot);

})();
