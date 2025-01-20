const express = require('express')
const User = require('../models/user')
const mongoose = require('mongoose')
const router = express.Router()

router.post('/createNote', async(req, res) => {

    const {title, body} = req.body

    if (!req.session.userId) {
        return res.redirect('/'); 
    }

    if(!title || !body){
        return res.send('Brak wsyztskich informacji')
    }


    try {
        const userId = req.session.userId

        const note = {
            title: title,
            body: body
        };

        await User.findByIdAndUpdate(
            userId,
            { $push: { notes: note } }
        );

        res.redirect('/dashboard')

    } catch (error) { 
        console.log("Błąd przy odawaniu notatki", error)
        res.render('error')
    }

})

router.get('/deleteNote/:noteId', async (req, res) => {
    const noteId = req.params.noteId;
    const userId = req.session.userId;

    if (!userId || !noteId) {
        return res.redirect('/');
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.render('error');
        }

        const note = user.notes.id(noteId);

        if (!note) {
            return res.render('error');
        }

        const result = await User.updateOne(
            { _id: userId },
            { $pull: { notes: { _id: noteId } } }
        );

        if (result.modifiedCount > 0) {
            return res.redirect('/');
        } else {
            return res.render('error');
        }

    } catch (error) {
        console.error(error);
        return res.render('error');
    }
});


router.get('/viewNote/:noteId', async(req, res) => {

    const noteId = req.params.noteId;
    const userId = req.session.userId;

    if (!userId || !noteId) {
        return res.redirect('/'); 
    }

    try {
        const user = await User.findOne({ _id: userId });

        const note = user.notes.id(noteId);
    
        if(!note) return res.render('error')


        const creation_date = note.creationDate.toISOString().split('T')[0];

        return res.render('note_render', {
            title:note.title,
            content:note.body,
            creationDate:creation_date
        })
        
    } catch (error) {
        res.render('error')
    }


})



module.exports = router