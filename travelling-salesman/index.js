// shortcuts
const {random} = Math;
Array.prototype.pickRandom = function() {
    return this.length && this.splice(random()*this.length>>0, 1)[0] || [];
};
// constants
const MAX = 1000;

const nodes = Array.from(Array(5), (value, index)=>({label: String.fromCharCode(65+index), costs: []})); //create nodes with labels from a-z
nodes.forEach(node=>{
    node.costs = nodes.reduce((list, _node)=>{
        if (node.label===_node.label) return list;
        let link = _node.costs.find(link=>link.to==node.label);
        let cost = link && link.cost || random()*MAX>>0 || 1;
        list.push({to: _node.label, cost});
        return list;
    }, []);
});

console.log("all nodes", nodes);

window.onload = ()=>{
    let costMatrix = document.getElementById("cost-matrix");
    let headerRow = costMatrix.insertRow();
    headerRow.insertCell();
    nodes.forEach(node=>{
        let list = [{to: node.label, cost: 0, linked: false}].concat(node.costs).sort((a,b)=>a.to<b.to && -1 || 1);
        let costRow = costMatrix.insertRow();
        costRow.insertCell().innerHTML = headerRow.insertCell().innerHTML = node.label;
        list.forEach(cost=>costRow.insertCell().innerHTML = cost.cost || "-");
    });
};


function closestNeighbor() {
    console.time("closestNeighbor");
    const closestList = [];
    function findLesserCost(itemList){
        let filtered = itemList.filter(item=>closestList.every(closest=>closest.label!==item.to));
        return filtered.reduce((lesser, item)=>item.cost<lesser.cost && item || lesser);
    }
    //add the first one
    let nextCost = findLesserCost(nodes[0].costs);
    closestList.push({label: nodes[0].label, costToNext: nextCost.cost});
    //add the rest
    let nextNode = nodes.find(node=>node.label===nextCost.to);
    while(closestList.length+1<nodes.length) {
        nextCost = findLesserCost(nextNode.costs);
        closestList.push({label: nextNode.label, costToNext: nextCost.cost});
        nextNode = nodes.find(node=>node.label===nextCost.to);
    }
    //add the last
    closestList.push({
        label: nextNode.label,
        costToNext: nodes.find(node=>node.label===nextNode.label).costs.find(cost=>cost.to===nodes[0].label).cost
    });
    console.timeEnd("closestNeighbor");
    console.table(closestList);
    document.getElementById("closest-neighbor-solution").innerText = `${closestList.map(item=>`${item.label} (${item.costToNext})`).join(", ")
    } - Total: ${closestList.reduce((sum, item)=>sum+item.costToNext, 0)}`;
    console.log("total cost", closestList.reduce((acc, item)=>acc+item.costToNext, 0));
}

function closestInsertion() {
    /*let nodeList = JSON.parse(JSON.stringify(nodes));
    let list = [nodeList.pickRandom(), nodeList.pickRandom()];
    // list.push(nodeList.pickRandom());
    list[0] = Object.assign(list[0], {to: list[1], toLabel: list[1].label, cost: list[0].costs.find(cost=>cost.to===list[1].label).cost});
    while (nodeList.length) {
        let listLabels = list.map(item=>item.label);
        console.log("list", list);
        console.log("listLabels", listLabels);
        let closestOutsiderNode = nodeList.find(node=>node.label===list.reduce((closest, item)=>{
            let out = item.costs.filter(cost=>!listLabels.includes(cost.to));
            console.log("out", out);
            let lesser = out.reduce((acc, cost)=>cost.cost<acc.cost && cost || acc);
            return closest.cost<lesser.cost && closest || lesser;
        }, false).to);
        console.log("_closest", closestOutsiderNode);
        let costs = closestOutsiderNode.costs.filter(cost=>listLabels.includes(cost.to)).sort((a, b)=>a.cost-b.cost);
        console.log("costs", JSON.parse(JSON.stringify(costs)));
        let from = costs.shift();
        let to = costs.reduce((acc, cost)=>{
            let delta = from.cost+cost.cost-from.find(fromCost=>fromCost.to===cost.to);
            if (!acc || acc.delta < delta) return {delta, label: cost.to};
            return acc;
        }, false);
        console.log("from", from);
        console.log("to", to);
        return;
    }*/
}