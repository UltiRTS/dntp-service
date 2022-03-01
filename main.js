const express = require('express');
const app = express();
const Knex = require('knex');
const {port, dntpWorkDir} = require('./config');
const {vague_search, batch_filter, check_ligal} = require('./lib');

var knex = Knex({
    client: 'sqlite3',
    connection: {
        filename: dntpWorkDir + '/info.db'
    }
})
console.log('==============================');
console.log('initialized knex');
console.log('==============================');

var updateTime = Date.now();


// update knex connection every 24 hours if there is new request
function middleWare(req, res, next) {
    const now = Date.now();
    if(now - updateTime > 1000 * 60 * 60 * 8) { 
        updateTime = now;
        knex.destroy();
        knex = Knex({
            client: 'sqlite3',
            connection: {
                filename: dntpWorkDir + '/info.db'
            }
        })
    }
    next();
}

app.use(middleWare);

app.get('/', (req, res) => {
    res.json({
        updateTime: new Date(updateTime).toLocaleString(),
    });
    res.end();
});

app.get('/vague_search/:name', async (req, res) => {
    const name = req.params.name;
    if(!check_ligal(name)) {
        res.send(JSON.stringify({
            error: 'illegal name'
        }))
        res.end();
    }

    try {
        const maps = await vague_search(knex, name);
        const toClient = {
            prefix: 'http://ulti-repo.eterea.uk/dNTPDl/tmpMap/',
            maps
        };
        res.send(toClient);
    } catch(e) {
        res.send(JSON.stringify({
            error: 'vague request error' 
        }));
    }
    res.end();
});

app.get('/map_list/:batch', async (req, res) => {
    const batch = parseInt(req.params.batch);
    if( batch === undefined) {
        res.json({
            error: 'emtpy batch is not allowed'
        });
        res.end();
    }

    try {
        const maps = await batch_filter(knex, batch);
        const toClient = {
            prefix: 'http://ulti-repo.eterea.uk/dNTPDl/tmpMap/',
            maps
        }
        res.send(toClient);
        res.end();
    } catch(e) {
        res.send(JSON.stringify({
            error: 'batch request error'
        }));
        res.end();
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});