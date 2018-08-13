const mongoose = require('mongoose');
const User = require('db/models/User');

const {
    MONGO_URI: mongoURI
  } = process.env;

module.exports = (function(){
    console.log(mongoURI);
    mongoose.Promise = global.Promise;

    return{
        connect(){
            mongoose.connect(mongoURI,{
                //useMongoClient: true
                //useNewUrlParser: true 
            }).then(
                ()=>{
                    console.log('------------Successfully connected to mongodb');
                }
            ).catch(e=>{
                console.error(e);
            });
        }
    };
})();
