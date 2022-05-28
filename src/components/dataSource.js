const { Keccak } = require('sha3');

const checkData = (...theArgs) => {
    const requiredApprovals = 3;

    const hashedDataArray = [];
    theArgs.map( (el) => {
        const hash = new Keccak(256);
        hash.update(JSON.stringify(el))
        const result = hash.digest('hex');
        // console.log(typeof result)
        hashedDataArray.push(result);
    }) 

    const counterOfApproval = {
        [hashedDataArray[0]]: 0,
        [hashedDataArray[1]]: 0,
        [hashedDataArray[2]]: 0,
        [hashedDataArray[3]]: 0
    }
    hashedDataArray.map( (el) => {
        counterOfApproval[el] += 1;
    })
    // console.log(hashedDataArray)
    // console.log(JSON.stringify(counterOfApproval))
    let maxApproved = 0;
    for (const dataSource in counterOfApproval) {
        if(counterOfApproval[dataSource] > maxApproved) {
            maxApproved = counterOfApproval[dataSource]; 
        }
    }
    if (maxApproved >= requiredApprovals) {
        const value = hashedDataArray.find( (el) => counterOfApproval[el] === maxApproved);
        return [true, value]
    }
    return [false];
}

console.log(checkData({"name":"pepe"}, {"name":"pepe"}, {"name":"pepe"}, {"name":"pepe"}));
console.log(checkData({"name":"pepe"}, {"name":"pepe"}, {"name":"pepe"}, {"name":"juan"}));
console.log(checkData({"name":"pepe"}, {"name":"pepe"}, {"name":"juan"}, {"name":"juan"}));
console.log(checkData({"name":"pepe"}, {"name":"juan"}, {"name":"juan"}, {"name":"juan"}));