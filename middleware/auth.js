import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            return res.status(401).json({ msg: "Invalid Authentication" });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(401).json({ msg: "Invalid Authentication" });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};