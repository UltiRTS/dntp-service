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

    const allowed = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.';
    for(let i=0; i<str.length; i++) {
        if(!allowed.includes(str[i])) {
            return false;
        }
    }
    return true;
}

async function get_map_by_id(knex, id) {
    const allowed = '0123456789';
    for(let i=0; i<id.length; i++) {
        if(!allowed.includes(id[i])) {
            return "";
        }
    }

    const res = (await knex('maps').where('id', '=', id)
    .select('id', 'map_name', 'map_filename', 'minimap_filename', 'map_hash'));
    if(res.length === 0) return "";

    return res[0];
}

async function get_archive(knex) {
    const res = (await knex('archives')
    .select('id', 'zip_name','extract_to', 'zip_hash', 'ipfs_addr'));

    return res;
}

async function get_archive_file(knex, filename) {
    const res = (await knex('archives')
    .where('zip_name', '=', filename)
    .select('id', 'zip_name','extract_to', 'zip_hash', 'ipfs_addr'));

    return res[0];
}

module.exports = {
    vague_search,
    batch_filter,
    check_ligal,
    exists,
    get_map_by_id,
    get_archive,
    get_archive_file
}
