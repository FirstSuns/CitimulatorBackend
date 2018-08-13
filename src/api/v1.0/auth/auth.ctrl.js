const Joi = require('joi');
const User = require('db/models/User');
exports.localRegister = async(ctx)=>{
    const { body } = ctx.request;
    const schema = Joi.object({
        displayName: Joi.string().regex(/^[a-zA-Z0-9ㄱ-힣]{3,12}$/).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(30)
      });
    const result = Joi.validate(body, schema);
    ctx.body = result;
    // Schema Error
    if(result.error) {
        ctx.status = 400;
        return;
    }    
    const {displayName, email, password} = body;
    try{
        // check email / displayName existancy
        const exists = await User.findExistancy({
            displayName,
            email
        });
        if(exists){
            ctx.status = 409;
            const key = exists.email === email ? 'email' : 'displayName';
            ctx.body = {
                key
            };
            return;
        }
        // creates user account
        const user = await User.localRegister({
            displayName, email, password
        });
        ctx.body = {
            displayName,
            _id: user._id,
            metaInfo: user.metaInfo
        };
        const accessToken = await user.generateToken();
        // configure accessToken to httpOnly cookie
        ctx.cookies.set('access_token', accessToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
        });
    }catch(e){
        ctx.throw(500);
    }

};
exports.localLogin = async(ctx)=>{
    const { body } = ctx.request;
    
};

exports.check = (ctx) => {
    console.log("auth check func");
    ctx.body = 'auth check func';
};
