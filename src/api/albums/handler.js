class AlbumsHandler {
    constructor(service, validator) {
        this._service = service
        this._validator = validator

        this.postAlbumHandler = this.postAlbumHandler.bind(this);
        this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
        this.putAlbumHandler = this.putAlbumHandler.bind(this);
        this.deleteAlbumHandler = this.deleteAlbumHandler.bind(this);
    }

    async postAlbumHandler(request, h) {
        this._validator.validateAlbumPayload(request.payload);
        const {name, year} = request.payload;

        const albumId = await this._service.addAlbum({ name, year });
        const response = h.response({
            status: 'success',
            message: 'Album berhasil ditambahkan',
            data: {
                albumId
            }
        });
        response.code(201);
        return response;
    }

    async getAlbumByIdHandler(request) {
        const { id } = request.params;
        const album = await this._service.getAlbumById(id);
        return {
            status: 'success',
            data: {
                album,
            },
        };
    }

    async putAlbumHandler(request, h) {
        this._validator.validateAlbumPayload(request.payload);

        const { id } = request.params;
        await this._service.editAlbumById(id, request.payload);
        
        return h.response({
            status: 'success',
            message: 'Album berhasil diperbarui'
        });
    }

    async deleteAlbumHandler(request, h) {
        const { id } = request.params;

        await this._service.deleteAlbumById(id);
        const response = h.response({
            status: 'success',
            message: 'Album berhasil dihapus',
        });

        return response;
    }
}

module.exports = AlbumsHandler;