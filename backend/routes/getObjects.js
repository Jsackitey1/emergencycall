const User = require('../models/User');
const mongoose = require('mongoose');

// Get all the users
const getUsers = async (req, res) => {
    const users = await User.find({}).sort({createdAt: -1}); // sort by createdAt in descending order
    res.status(200).json(users);
}
module.exports = getUsers;