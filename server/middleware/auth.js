import jwt from "jsonwebtoken";

// Middleware to verify JWT tokens
export const verifyToken = async (req, res, next) => {
    try {
        // Get the token from the "Authorization" header
        let token = req.header("Authorization");

        // If no token is provided, return a 403 status with an "Access Denied" message
        if (!token) {
            return res.status(403).send("Access Denied");
        }

        // If the token starts with "Bearer ", remove the prefix to get the actual token
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        // Verify the token using the secret key from environment variables
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // Attach the verified user information to the request object
        req.user = verified;
        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        // Handle specific JWT errors
        if (err instanceof jwt.TokenExpiredError) {
            // If the token has expired, return a 401 status with a "Token expired" message
            return res.status(401).send("Token expired");
        } else if (err instanceof jwt.JsonWebTokenError) {
            // If the token is invalid, return a 401 status with an "Invalid token" message
            return res.status(401).send("Invalid token");
        } else {
            // For any other errors, return a 500 status with the error message
            return res.status(500).json({ error: err.message });
        }
    }
};