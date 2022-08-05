const {vague_search, batch_filter, get_map_by_id, get_archive, latest_lobby} = require('../lib');
const Knex = require('knex');
const {mysql_dbname, mysql_username, mysql_password} = require('../config');
const knex = Knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: mysql_username,
        password: mysql_password,
        database: mysql_dbname
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

    console.log('==============================');
    res = await latest_lobby(knex);
    console.log(res);
    
    knex.destroy();
}

main();