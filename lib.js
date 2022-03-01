async function vague_search(knex, name) {
    return await knex('maps').where('map_name', 'like', '%' + name + '%')
        .select('id', 'map_name', 'map_filename', 'minimap_filename', 'map_hash');
}

async function batch_filter(knex, batch) {
    return await knex('maps').limit(30).offset(batch * 30)
    .select('id', 'map_name', 'map_filename', 'minimap_filename', 'map_hash')
}

async function exists(knex, id) {
    return (await knex('maps').where('id', id).select('id')).length > 0;
}

function check_ligal(str) {
    if(typeof(str) !== 'string') return false;

    const allowed = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
    for(let i=0; i<str.length; i++) {
        if(!allowed.includes(str[i])) {
            return false;
        }
    }
    return true;
}

module.exports = {
    vague_search,
    batch_filter,
    check_ligal,
    exists
}
