const express=require('express');
const router=express.Router();

homeController=require('../controllers/home')
router.get('',homeController.home)
router.use('/users',require('./users'))

module.exports=router;