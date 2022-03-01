const {vague_search, batch_filter} = require('../lib');
const {dntpWorkDir}=  require('../config');
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: dntpWorkDir + '/info.db'
    }
})

const main = async () => {
    let res = await vague_search(knex, 'star');
    console.log(res);
    res = await batch_filter(knex, 0);
    console.log(res);
    
    knex.destroy();
}

main();