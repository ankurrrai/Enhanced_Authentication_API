const mongoose=require('mongoose');

const userSchema=new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true, 
            bcrypt: true, //Encryption provided
            rounds: 9
        },
        name:{
            type:String,
            reuired:true
        },
        phone:{
            type:Number,
        },
        bio:{
            type:String,
        },
        avatar:{
            type:String
        },
        token:{
            type:String
        },
        profileView:{
            type:String
        },
        accountType:{
            type:String
        },
    },{
        timestamps:true
    }
)

userSchema.plugin(require('mongoose-bcrypt')) //used for passpword encrytion refer its documnetions for more

const User=mongoose.model('User',userSchema);
module.exports=User