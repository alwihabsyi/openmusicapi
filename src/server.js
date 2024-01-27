require('dotenv').config();
const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const songs = require('./api/songs');
const AlbumsServices = require('./services/postgres/AlbumsServices');
const SongsServices = require('./services/postgres/SongsServices');
const AlbumValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');
const ClientError = require('./exceptions/ClientError');

const init = async () => {
    const albumService = new AlbumsServices();
    const songService = new SongsServices();
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ["*"],
            },
        }
    });

    await server.register([
        {
            plugin: albums,
            options: {
                service: albumService,
                validator: AlbumValidator
            }
        },
        {
            plugin: songs,
            options: {
                service: songService,
                validator: SongsValidator
            }
        }
    ])

    server.ext('onPreResponse', (request, h) => {
        const { response } = request;

        if (response instanceof ClientError) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message,
            });
            newResponse.code(response.statusCode);
            return newResponse;
        }

        return h.continue;
    });

    await server.start();
    console.log(`Server is running at ${server.info.uri}`);
}

init();