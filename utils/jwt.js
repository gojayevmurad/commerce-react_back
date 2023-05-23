import jwt from 'jsonwebtoken'

export function authenticateToken(req, res, next) {

    const token = req.headers.authorization

    if (token == null) {
        return res.sendStatus(401)
    }


    jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
        if (err) {
            return res.status(401).json(err)
        }
        req.data = data;

        next();
    })
}

export function refreshToken(req, res, next) {

    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, process.env.REFRESH_KEY, (err, content) => {
        if (err) {
            return res.status(401).json({ message: err.message })
        }

        req.data = content;
        next();
    })

}
