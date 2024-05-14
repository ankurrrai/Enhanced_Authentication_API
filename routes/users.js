
const express=require('express');
const router=express.Router();
const passport=require('passport')
const userApi=require('../controllers/api/users')


// users routes
router.post('/add-user',userApi.create)
router.post('/update',passport.authenticate('jwt',{session:false}),userApi.update)
router.post('/destroy',passport.authenticate('jwt',{session:false}),userApi.destroy_session)
router.post('/profile',passport.authenticate('jwt',{session:false}),userApi.profileDetails)
router.post('/toggle_profile-view',passport.authenticate('jwt',{session:false}),userApi.toggle_profileView)
router.post('/all-users',passport.authenticate('jwt',{session:false}),userApi.allUsers)
router.post('/cred-update',passport.authenticate('jwt',{session:false}),userApi.updatePassword)

router.post('/create-session',userApi.createSession);
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}))  //according to need take the details and access from google
router.get('/auth/google/callback',passport.authenticate(
    'google',
    {failureRedirect:'/'}
),userApi.createSession2)




// admin routes
router.post('/admin/add-user',userApi.create)
router.post('/admin/update',passport.authenticate('jwt',{session:false}),userApi.update)
router.post('/admin/destroy',passport.authenticate('jwt',{session:false}),userApi.destroy_session)
router.post('/admin/profile',passport.authenticate('jwt',{session:false}),userApi.profileDetails)
router.post('/admin/all-users',passport.authenticate('jwt',{session:false}),userApi.allUsers_admin)
router.post('/admin/cred-update',passport.authenticate('jwt',{session:false}),userApi.updatePassword)

router.post('/admin/create-session',userApi.createSession_Admin);
router.get('/admin/auth/google',passport.authenticate('google',{scope:['profile','email']}))  //according to need take the details and access from google
router.get('/admin/auth/google/callback',passport.authenticate(
    'google',
    {failureRedirect:'/'}
),userApi.createSession2_Admin)




module.exports=router;