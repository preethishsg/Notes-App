const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema ({
        name: { type: String, requred: true},
        email: { type: String, requred: true, unique : true},
        // password: { type: String },
        hash: String,
        salt: String
    }, 
    { 
        timestamps: true 
    });

userSchema.methods.setPassword = function(password) {
    const salt = bcrypt.genSaltSync(10);
    this.salt = salt;
    this.hash = bcrypt.hashSync(password, salt);
    return this.save();
};
    
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.hash);
};

module.exports = mongoose.model('User', userSchema);
