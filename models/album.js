const mongoose=require('mongoose');

const albumSchema = new mongoose.Schema({
    title : {type: String , required :true},
    image : [String]
}, {timestamps : true});

module.exports = mongoose.model('album',albumSchema);