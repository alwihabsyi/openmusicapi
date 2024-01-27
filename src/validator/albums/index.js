const InvariantError = require("../../exceptions/InvariantError");
const { AlbumPayloadSchema } = require("./schema");

const AlbumPostValidator = {
    validateAlbumPayload: (payload) => {
        const validationResult = AlbumPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    }
}

module.exports = AlbumPostValidator;