// shortcuts
const {random} = Math;
// constants
const MAX = 1000;

const nodes = Array.from(Array(26), (value, index)=>({label: String.fromCharCode(65+index), costs: []})); //create nodes with labels from a-z
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
    console.log("total cost", closestList.reduce((acc, item)=>acc+item.costToNext, 0));
}
