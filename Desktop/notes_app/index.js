//including

const express = require('express')
const session = require('express-session');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

//routes icluding

const rendering = require('./routes/rendering')
const auth = require('./routes/auth')
const handling = require('./routes/notes_handling')

//settings

const app = express()
app.set('view engine', 'pug');
app.set('views', './views')

app.use(express.urlencoded({ extended: true }));

const PORT = 8080

//sessions
app.use(session({
    secret: "secret",
    cookie: {maxAge: 1000 * 60 * 60 * 24},
    saveUninitialized: false,
}))

//database connection

mongoose.connect('mongodbUrl',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('poprawnie połączono z bazą danych'))
.catch((err) => console.log(`Błąd połączenia z bazą danych: ${err}`))

const User = require('./models/user')

//including routes

app.use(rendering)
app.use('/auth', auth) 
app.use('/handling', handling)


//listening

app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`)
})
