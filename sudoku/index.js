//globals
const SIZE = 9;
let attempts, time, table, complexTable, subMatrix;

// shortcuts
const {random, sqrt} = Math;

//utils
const rand = () => random() * SIZE >> 0;


function generate(){
    console.time("generate sudoku");
    [table, subMatrix] = [Array.from(Array(SIZE), row=>Array.from(Array(SIZE))), sqrt(SIZE)];
    let i = 1+random()*20>>0;
    while (i--) {
        let randValue, randRow, randCol;
        // keep generating new pseudorandom rows, columns and values until the new value can be set
        do [randRow, randCol, randValue] = [rand(), rand(), rand()+1];
        while(!test(randRow, randCol, randValue));
        table[randRow][randCol] = randValue;
    }
    console.timeEnd("generate sudoku");
    attempts = 0;
    return printTable(table);
}


function test(row, column, value) {
    let [subRow, subColumn] = [row/subMatrix>>0, column/subMatrix>>0];
    let subMatrixCells = table.slice(subRow * subMatrix, subMatrix + subRow * subMatrix)
        .map(row=>row.slice(subColumn * subMatrix, subMatrix + subColumn * subMatrix))
        .reduce((acc, row)=>acc.concat(row), []);
    return !table[row][column] && //test if value not empty
        !table.map(row=>row[column]).some(cellValue=>cellValue===value) && //test column
        !table[row].map(col=>col).some(cellValue=>cellValue===value) && //test row
        !subMatrixCells.some(cell=>cell===value); //test submatrix
}


function printTable(matrix=table, clear=true) {
    const initTable = document.getElementById("init");
    if (clear){
        initTable.innerHTML = "";
        matrix.forEach(row => {
            let domRow = initTable.insertRow();
            row.forEach(cell=>Object.assign(domRow.insertCell(), {innerHTML: cell || "", className: cell && "red" || ""}));
        });
    } else matrix.forEach((row, i) => row.forEach((cell, j) => initTable.rows[i].cells[j].innerHTML = cell));
    return matrix;
}


function solve() {
    if (attempts >= 100) return console.error("TRIED 100 TIMES AND COULD NOT SOLVE IT");
    else {
        ++attempts;
        time = time || performance.now();
    }
    //create a table where each cell contains an object with value, possibleValues, row and column
    complexTable = table.map((row, i)=>row.map((column, j)=>({
        value: column,
        possibleValues: [],
        row: i,
        column: j
    })));
    let cellList = [];
    complexTable.forEach((row, i)=>row.forEach((cell, j)=>{
        if (!cell.value) {
            cellList.push(cell);
            for (let val=1; val<=SIZE; val++) test(i, j, val) && cell.possibleValues.push(val);
        }
    }));
    if (complexTable.some(row=>row.some(cell=>!cell.value && !cell.possibleValues.length)))
        return console.warn("Impossible Sudoku");
    while(cellList.length){
        cellList.sort((a, b)=>a.possibleValues.length-b.possibleValues.length);
        let bestOption = cellList[0];
        bestOption.value = bestOption.possibleValues[random()*bestOption.possibleValues.length>>0];
        bestOption.possibleValues = [];
        // remove from possible options of all cells in column
        if (complexTable.map(row=>removeFromPossibleOptions(row[bestOption.column], bestOption.value)).some(success=>!success))
            return console.warn("DEAD END") || solve(); //restart
        // remove from possible options of all cells in row
        if (complexTable[bestOption.row].map(cell=>removeFromPossibleOptions(cell, bestOption.value)).some(success=>!success))
            return console.warn("DEAD END") || solve(); //restart
        // remove from possible options of all cells in submatrix
        cellList.shift();
    }
    console.log(`solving time: ${performance.now() - time}ms`);
    console.log("totalAttempts", attempts);
    console.log("resultSudoku", printTable(complexTable.map(row=>row.map(cell=>cell.value)), false));
}

function removeFromPossibleOptions(cell, value) {
    if (!cell.possibleValues.length) return true;
    let index = cell.possibleValues.indexOf(value);
    if (~index) cell.possibleValues.splice(index, 1);
    return Boolean(cell.possibleValues.length);
}
