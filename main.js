const express = require('express');
const app = express();
const Knex = require('knex');
const {port, mysql_dbname, mysql_username, mysql_password, service_prefix} = require('./config');
const {vague_search, batch_filter, check_ligal, exists, get_map_by_id, get_archive, get_archive_file} = require('./lib');

var knex = Knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: mysql_username,
        password: mysql_password,
        database: mysql_dbname
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
            client: 'mysql',
            connection: {
                host: '127.0.0.1',
                port: 3306,
                user: mysql_username,
                password: mysql_password,
                database: mysql_dbname
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
        return;
    }

    try {
        const maps = await vague_search(knex, name);
        const toClient = {
            prefix: service_prefix+ '/maps/',
            maps
        };
        res.send(JSON.stringify(toClient));
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
            success: false,
            error: 'emtpy batch is not allowed'
        });
        res.end();
        return;
    }

    try {
        const maps = await batch_filter(knex, batch);
        const toClient = {
            success: true,
            prefix: service_prefix + '/maps/',
            maps
        }
        res.send(JSON.stringify(toClient));
        res.end();
    } catch(e) {
        res.send(JSON.stringify({
            success: false,
            error: 'batch request error'
        }));
        res.end();
    }
});

app.get('/exists/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const existance = await exists(knex, id);
        res.send(JSON.stringify({
            success: true,
            existance
        }));
        res.end();
    } catch(e) {
        res.send(JSON.stringify({
            success: false,
            error: 'exists request error'
        }));
        res.end();
    }
});

app.get('/maps/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const map = await get_map_by_id(knex, id);
        res.send(JSON.stringify({
            success: true,
            prefix: service_prefix + '/maps/',
            map
        }));
        res.end();
    } catch(e) {
        res.send(JSON.stringify({
            success: false,
            error: 'get map by id request error'
        }));
        res.end();
    }   
});

app.get('/archive/:filename', async (req, res) => {
    const filename = req.params.filename;
    try {
        if(!check_ligal(filename)) throw new Error('illegal filename');
        const file = await get_archive_file(knex, filename);
        res.send(JSON.stringify({
            success: true,
            prefix: service_prefix + '/archives/',
            file
        }));
        res.end();
    } catch(e) {
        res.send(JSON.stringify({
            success: false,
            error: 'get archive file request error'
        }));
        res.end();
    }
})

app.get('/archives', async (req, res) => {
    try {
        const files = await get_archive(knex);
        res.send(JSON.stringify({
            success: true,
            prefix: service_prefix + '/archives/',
            files
        }));
        res.end();
    } catch(e) {
        console.log(e);
        res.send(JSON.stringify({
            success: false,
            prefix: service_prefix + '/archives/',
            error: 'get archive request error'
        }));
        res.end();
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
