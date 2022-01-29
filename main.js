const express = require('express');
const app = express();
const {port, mapLocation} = require('./config');
const {mapCount, getMapFile, mapBatch, mapAvailability} = require('./lib');

const BATCH_PER_PAGE = 10;

// initial params 
var mapLength = 0;
const mapList = {};
var timeElapsed = Date.now();

app.get('/', (req, res) => {
    res.json({
        updateTime: timeElapsed.toString(),
        mapLength: mapLength,
    });
    res.end();
});

app.get('/map_file/:filename', (req, res) => {
    try {
        const file = getMapFile(mapLocation, req.params.filename);
        res.setHeader('Content-Length', file.length);
        res.write(file, 'binary');
    } catch(e) {
        console.log('illegal request', e);
        res.json({
            message: 'illegal request'
        });
    }
    res.end();
});

app.get('/map_list/:batch', (req, res) => {
    const batch = req.params.batch;
    if( batch === undefined || 
        batch > parseInt(mapLength / BATCH_PER_PAGE)) {
        res.json({
            message: 'batch size is too large'
        });
        res.end();
    }

    if(!(batch in mapList)) {
        mapList[batch] = mapBatch(mapLocation, 
                batch * BATCH_PER_PAGE, 
                (batch + 1) * BATCH_PER_PAGE);
    }

    res.send({
        maps: mapList[batch]
    });
    res.end();

});

app.get('/batch_limit', (req, res) => {
    const current = Date.now();
    const diff = current - timeElapsed;
    const diffDays = parseInt(diff / (1000 * 60 * 60 * 24));
    if(diffDays > 1 || mapLength === 0) {
        mapLength = mapCount(mapLocation);
        timeElapsed = current;
    };

    res.json({
        batchLimit: parseInt(mapLength / BATCH_PER_PAGE) + 1
    });
    res.end();
});

app.get('/map_available/:filename', (req, res) => {
    const filename = req.params.filename;
    res.json({
        available: mapAvailability(mapLocation, filename)
    });
    res.end();
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});