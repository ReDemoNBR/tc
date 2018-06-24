const array = [30, 40, 10, 15, 10, 60, 54];
const c = 55;

function subset(p, n, c){
    let t = Array.from(Array(n+1), ()=>new Uint8Array(c+1));
    t.forEach(row=>row[0] = 1);
    for (let b=1; b<=c; b++){
        t[0][b] = 0;
        for (let i=1; i<=n; i++) t[i][b] = !t[i-1][b] && p[i]<=b && t[i-1][b-p[i]] || t[i-1][b];
    }
    console.log("t", t);
    return t;
}

function solve(){
    let t = subset(array, array.length, c);
    let tableElement = document.getElementById("t-matrix");
    t.forEach(row=>{
        let rowElement = tableElement.insertRow();
        row.forEach(value=>rowElement.insertCell().innerHTML = value);
    });
}

window.onload = ()=>document.getElementById("initial-array").innerHTML = array.join(", ");