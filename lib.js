const fs = require('fs');
const path = require('path');

const mapCount = (loc) => {
    const list = fs.readdirSync(loc).filter(file => {
        return file.endsWith('.sd7') || file.endsWith('.sdz');
    });

    return list.length;
}

const mapBatch = (loc, start, end) => {
    const list = fs.readdirSync(loc).filter(file => {
        return file.endsWith('.sd7') ||  file.endsWith('.sdz');
    });

    return list.slice(start, end); 
};


// use try catch in case of error
const getMapFile = (loc, filename) => {
    var file = fs.readFileSync(path.join(loc, filename));
    return file;
};

module.exports = {
    mapCount,
    getMapFile,
    mapBatch
}