export function stringEquals(a, b) {
    return typeof a === 'string' && typeof b === 'string' && a.toLowerCase() === b.toLowerCase();
}


export function isEmpty(str){
    return (!str || /^\s*$/.test(str));
}