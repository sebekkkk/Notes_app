const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const router = express.Router()

router.post('/register', async (req, res) => {
    const { password, email, username } = req.body

    if (!password || !email || !username) return res.send('brak wszystkich danych')

        try {
            const user_exist = await User.findOne({ email: email });
            if (user_exist) return res.render('user_exist');

            
            const newUser = new User({
                email,
                password: await bcrypt.hash(password, 10),
                username
            });
        
            await newUser.save();
           
            req.session.userId = newUser._id;
            res.redirect('/');
        } catch (error) {
            console.log('Błąd podczas rejestracji:', error);
            res.render('error');
        }
})

router.post('/login', async(req, res) => {
    const {email, password} = req.body

    if(!email || !password) return res.send('Brak wsyztskich informacji')

    try {
        
        const user_exist = await User.findOne({email:email})

        if(!user_exist) return res.render('incorrect_info')

        if (await bcrypt.compare(password, user_exist.password)) {
            req.session.userId = user_exist._id;
            return res.redirect('/')
        } else {
            res.render('incorrect_info')
        }

    } catch (error) {
        res.render('error')
        console.log(error)
    }


})

router.get('/logOut', (req, res) => {

    req.session.destroy((err) => {
        if(err){
            res.render('error')
            return console.log(err)
        }

        res.clearCookie('connect.sid')

        return res.redirect('/')

    })

})

module.exports = router;