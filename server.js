const express = require('express')
const morgan = require('morgan')
const database = require('./config/database')
const userModel = require('./models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT

app.set('view engine', 'ejs')
app.use(morgan('dev'))
app.use(express.urlencoded({ extented: true }))
app.use(express.static('public'))
app.use(express.json())

app.get('/', (req, res) => {
    res.render('register')
})
app.get('/register', (req, res) => {
    res.render('register')
})
app.get('/signin', (req, res) => {
    res.render('signin')
})

app.post('/register-in', async (req, res) => {
    try {

        const { username, email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        res.render('signin')
    } catch (err) {
        res.send('Error in Registration')
    }
})

app.post('/signin', async (req, res) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email: email })
    try {
        if (!user) {
            return res.send('User no found')
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            res.render('home')
        } else {
            res.render('signin')
        }

    } catch (err) {
        res.send('Error in sign in')
    }

    const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
    res.cookie("token", token, { httpOnly: true })

});

app.get('/logout', (req, res) => {
    res.render('register')
})



app.listen(`${PORT}`, () => {
    console.log('The server is runnong in http://localhost:3000/');

})
