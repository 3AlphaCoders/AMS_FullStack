const CustomAPIError = require('./CustomAPIError')
const BadRequestError = require('./BadRequestError')
const NotFoundError = require('./NotFoundError')
const UnauthenticatedError = require('./UnauthenticatedError')
const UnauthorizedError = require('./UnauthorizedError')

module.exports = {
    CustomAPIError,
    BadRequestError,
    NotFoundError,
    UnauthenticatedError,
    UnauthorizedError
}