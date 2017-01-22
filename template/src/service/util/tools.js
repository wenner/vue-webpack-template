export function objClone(o) {
    let obj={};
    for(let i in o){
        obj[i]=o[i];
    }
    return obj;
}
