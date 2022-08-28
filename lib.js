async function latest_lobby(knex, type) {
    return (await knex('lobby_info').where('_type','=', type).orderBy('id').limit(1)
        .select('id', 'version', 'lobby_name', 'lobby_hash', '_type'))[0];
}

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

async function max_batch(knex) {
    const res = await knex('maps').count('id as count');
    return Math.floor(res[0].count / 30);
}

function check_ligal(str) {
    if(typeof(str) !== 'string') return false;

    const allowed = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_. ';
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
    .select('id', 'zip_name','extract_to', 'zip_hash'));

    return res;
}

async function get_archive_file(knex, filename) {
    const res = (await knex('archives')
    .where('zip_name', '=', filename)
    .select('id', 'zip_name','extract_to', 'zip_hash'));

    return res[0];
}

async function get_mods(knex) {
    const res = (await knex('mods')
        .select('id', 'name', 'archive', 'version'));
    
    return res;
}

async function get_archive_by_id(knex, id) {
    const res = (await knex('archives')
        .where('id', '=', id)
        .select('id', 'zip_name','extract_to', 'zip_hash'));
    
    return res[0];
}

async function get_latest_systemconf(knex, type) {

    const query = (await knex('system_config').where('_type', '=', type).orderBy('id').limit(1))[0];

    const res = {
        id: query.id,
        config_name: query.config_name,
        engine_archive_id: query.engine,
        mod_archive_id: query.mod,
        engine_essentials_hash: query.engine_essentials_hash,
        mod_essentials_hash: query.mod_essentials_hash,
        _type: query._type
    }

    return res;
}

module.exports = {
    vague_search,
    batch_filter,
    check_ligal,
    exists,
    get_map_by_id,
    get_archive,
    get_archive_file,
    max_batch,
    get_latest_systemconf,
    get_archive_by_id,
    latest_lobby,
    get_mods
}
