const UserModal = require('../models/User');


const register = async (req, res) => {
    const {email} = req.body;
    try {
        const userDoc = await UserModal.create({ email })
        res.json(userDoc);
    } catch (e) {
        res.status(400).json(e);
    }
}

module.exports = {
    register,
  };