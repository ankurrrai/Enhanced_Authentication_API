const User=require('../../models/users')
const fs=require('fs');
const path=require('path');
const jwt=require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// Action to update the user details
module.exports.update=async function(req,res){
    try {
        
        let user=await User.findById(req.user.id);

        if (!user.token){
            return res.status(200).json({
                message:'Token is invalid'
            })
        }

        if (user.name!=req.body.name && req.body.name!='' && req.body.name!=undefined){user.name=req.body.name;}
        if (user.email!=req.body.email && req.body.email!='' && req.body.email!=undefined){user.name=req.body.email;}
        if (user.phone!=req.body.phone && req.body.phone!='' && req.body.phone!=undefined){user.phone=req.body.phone;}
        if (user.bio!=req.body.bio && req.body.bio!='' && req.body.bio!=undefined){user.bio=req.body.bio;}
        if (user.avatar!=req.body.avatar && req.body.avatar!='' && req.body.avatar!=undefined){user.avatar=req.body.avatar;}
        user.save();
        
        return res.status(200).json({
            message:'success',
            data:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                bio:user.bio,
                avatar:user.avatar,
            }
        })
        
        
    } catch (err) {
        console.log(`Error in user_controller -> update`)
        console.log(`Error Description ${err}`)
        return res.status(401).json({
            message:'Error',
            description:{
                err:err
            }
        })
    }
    
}





// Action to create new user
module.exports.create=async function(req,res){


    try {
        if (req.body.password != req.body.confirm_password){
            console.log('Password is not same!')
            return res.redirect('back');
        };


        let user=await User.findOne({email:req.body.email})
        if (!user){
            let newUser=await User.create(req.body);
            return res.status(200).json({
                message:'Succcess',
                description:{
                err:'User Added Successfully'
            }
            })
            
        } else{
            return res.status(200).json({
                message:'Succcess',
                description:{
                err:'User Already added'
            }
            })
        }
        
        
    } catch (err) {
        console.log(`Error in user_controller -> create`)
        console.log(`Error Description ${err}`)
        return res.status(401).json({
            message:'Error',
            description:{
                err:err
            }
        })
    }
    

};
// ***************************For users Start***************************

// Create Session
module.exports.createSession=async function(req,res){
    try {
        let user=await User.findOne({email:req.body.email})
        console.log(user)
        if (!user || !user.verifyPasswordSync(req.body.password)){
            return res.status(422).json({
                message:'Inavlid user name or password!',
            })
        }
        
        let token=jwt.sign(user.toJSON(),'AnkurRai',{expiresIn:'100000'})
        user.accountType='user'
        profileView='public'
        user.token=token
        user.save()

        return res.status(200).json({
            message:'success',
            data:{
                token:token
            }
        })

    } catch (err) {
        return res.status(500).json({
            message:'Error : ' + err
        })
    }
}

// Create session with google
module.exports.createSession2=async function(req,res){
    
    
    let user=await User.findById(res.locals.user.id)
    let token=jwt.sign({id:user.id}.toJSON(),'AnkurRai',{expiresIn:'100000'})
    user.token=token
    user.accountType='user'
    profileView='public'
    user.save()

    return res.status(200).json({
        message:'success',
        data:{
            token:token
        }
    })
    
}


// populate all the public users
module.exports.allUsers=async function(req,res){
    try {
        let user=await User.find({profileView:'public',accountType:'user'}).populate({select:'-password'})
        return res.status(200).json({
            message:'success',
            data:{
                data:user
            }
        })
    } catch (err) {
        return res.status(500).json({
            message:'Error : ' + err
        })
    }
}


// Change the profile state
module.exports.toggle_profileView=async function(req,res){
    try {
        let user=await User.findOne({_id:req.user.id})
        user.profileView=req.query.profileView
        user.save()
        return res.status(200).json({
            message:'successfully Chnaged to '+req.query.profileView,
            data:{
                data:user
            }
        })
    } catch (err) {
        return res.status(500).json({
            message:'Error : ' + err
        })
    }
}

// *****************************admin controllers start*********************

//create session for admin
module.exports.createSession_Admin=async function(req,res){
    try {
        let user=await User.findOne({email:req.body.email})
        console.log(user)
        if (!user || !user.verifyPasswordSync(req.body.password)){
            return res.status(422).json({
                message:'Inavlid user name or password!',
            })
        }
        
        let token=jwt.sign(user.toJSON(),'AnkurRai',{expiresIn:'100000'})
        user.accountType='admin'
        profileView='private'
        user.token=token
        user.save()

        return res.status(200).json({
            message:'success',
            data:{
                token:token
            }
        })

    } catch (err) {
        return res.status(500).json({
            message:'Error : ' + err
        })
    }
}

// create session with google for admin
module.exports.createSession2_Admin=async function(req,res){
    
    
    let user=await User.findById(res.locals.user.id)
    let token=jwt.sign({id:user.id}.toJSON(),'AnkurRai',{expiresIn:'100000'})
    user.token=token
    user.accountType='admin'
    profileView='private'
    user.save()

    return res.status(200).json({
        message:'success',
        data:{
            token:token
        }
    })
    
}

// populate all the users with admin access
module.exports.allUsers_admin=async function(req,res){
    try {
        let user=await User.findOne({_id:req.user.id})
        if (user.accountType!='admin'){
            return res.status(500).json({
                message:'This account has not permission for admin view'
            })
        }
        user=await User.find({}).populate({select:'-password'})
        return res.status(200).json({
            message:'success',
            data:{
                data:user
            }
        })
    } catch (err) {
        return res.status(500).json({
            message:'Error : ' + err
        })
    }
}

// *********************Common Controllers start*********************

module.exports.destroy_session=async function (req,res){
    
    let user=await User.findOne({_id:req.user.id})
    if (!user.token){
        return res.status(200).json({
            message:'Token is invalid'
        })
    }
    user.token=undefined
    user.save();
    return res.status(200).json({
        message:'success',
        data:{
            description:'Session Logout!'
        }
    })
    
}

// to check the profile details
module.exports.profileDetails= async function(req,res) {
    try {
        let id=req.user.id
        let user=await User.findOne({_id:id}).populate({ select:'-password'})
        return res.status(200).json({
            message:'success',
            data:{
                data:user
            }
        })
    } catch (err) {
        return res.status(500).json({
            message:'Error : ' + err
        })
    }
}

// Update the password
module.exports.updatePassword= async function(req,res) {
    try {
        let id=req.user.id
        let user=await User.findByIdAndUpdate(id,{password:req.body.new_password});
        return res.status(200).json({
            message:'success',
            data:{
                data:user
            }
        })
    } catch (err) {
        return res.status(500).json({
            message:'Error : ' + err
        })
    }
}