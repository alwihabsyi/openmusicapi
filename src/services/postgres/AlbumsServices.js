const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const { mapAlbumDBToModel } = require("../../utils/index")
const InvariantError = require("../../exceptions/InvariantError")
const NotFoundError = require("../../exceptions/NotFoundError")

class AlbumsServices {
    constructor() {
        this._pool = new Pool();
    }

    async addAlbum({ name, year }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, name, year, createdAt, updatedAt]
        };

        const result = await this._pool.query(query);
        if (!result.rows[0].id) {
            throw new InvariantError('Gagal menambahkan album');
        }

        return result.rows[0].id;
    }

    async getAlbumById(id) {
        const query = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id]
        }

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Album tidak ditemukan');
        }

        return result.rows.map(mapAlbumDBToModel)[0];
    }

    async editAlbumById(id, {name, year}) {
        const updatedAt = new Date().toISOString();

        const query = {
            text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 where id = $4 RETURNING id',
            values: [name, year, updatedAt, id]
        }

        const result = await this._pool.query(query)
        if (!result.rowCount) {
            throw new NotFoundError("Gagal memperbarui album. id tidak ditemukan");
        }
    }

    async deleteAlbumById(id) {
        const query = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id]
        }

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError("Gagal menghapus album. id tidak ditemukan");
        }
    }
}

module.exports = AlbumsServices;