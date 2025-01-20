const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/user')
const router = express.Router()

router.get('/', (req, res) => {
    if(req.session.userId){
        res.redirect('/dashboard')
    }else{
        res.render('logorreg')
    }
})

router.get('/dashboard', async(req, res) => {
    
    if(!req.session.userId) return res.redirect('/')

    try {
        
        const user = await User.findOne({_id:req.session.userId})
     
        res.render('dashboard', {
            username: user.username,
            notes: user.notes
        })


    } catch (error) {
        res.render('error')
    }


})

router.get('/addNote', (req, res) => {
    if(req.session.userId){
        res.render('addnote')
    }else{
        res.redirect('/')
    }
})

router.get('/register', (req, res) => {
    if(req.session.userId) return res.redirect('/')
    else res.render('register')
})

router.get('/login', (req, res) => {
    if(req.session.userId) return res.redirect('/')
    else res.render('login')
})


module.exports = router;