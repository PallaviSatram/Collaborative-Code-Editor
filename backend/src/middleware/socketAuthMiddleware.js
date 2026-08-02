const jwt = require("jsonwebtoken");

function socketAuthMiddleware(socket, next) {

    try {

        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error("Authentication failed. Token missing."));
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        socket.user = decoded;
        next();

    } catch (error) {
        return next(new Error("Authentication failed. Invalid token."));
    }
}

module.exports = socketAuthMiddleware;