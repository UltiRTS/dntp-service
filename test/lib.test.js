const {vague_search, batch_filter, get_map_by_id, get_archive} = require('../lib');
const {dntpWorkDir}=  require('../config');
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: dntpWorkDir + '/info.db'
    }
})

const main = async () => {
    let res = await vague_search(knex, 'star');
    console.log('==============================');
    console.log(res);
    res = await batch_filter(knex, 0);
    console.log('==============================');
    console.log(res);

    res = await get_map_by_id(knex, '7718');
    console.log('==============================');
    console.log(res);

    console.log(typeof get_archive);
    res = await get_archive(knex);
    console.log('==============================');
    console.log(res);
    
    knex.destroy();
}

main();