const axios = require('axios');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.sendStatus(401);
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.sendStatus(401);
    }
    try {
        const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        req.user = response.data;
        next();
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(401).send('Unauthorized: Unable to authenticate user');
    }
   
}

module.exports = authMiddleware;
