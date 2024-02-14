const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: String,
    emailId: String,
    password: String,
    role: String,
    isActive: Boolean
});
module.exports = User = mongoose.model('user', UserSchema);