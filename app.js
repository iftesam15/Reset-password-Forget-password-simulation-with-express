const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

let user = {
    id: '2',
    email: 'dhrubo252@gmail.com',
    password: '12345678'
}
const JWT_SECRET = 'jwt-secret';

app.get('/', (req, res) => {
    res.send('Welcome to the API');
})

app.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
})
app.post('/forgot-password', (req, res) => {
    const { email } = req.body;

    if (email !== user.email) {
        res.status(404).send('User not found');
        return;
    }

    //User exists and now create a one time link valid for 15 minutes
    const secret = JWT_SECRET + user.password
    const payload = {
        email: user.email,
        id: user.id
    }
    const token = jwt.sign(payload, secret, { expiresIn: '15m' });
    const link = `http://localhost:3000/reset-password/${user.id}/${token}`;
    console.log(link);
    res.send('Password reset link has been sent successfully');


})
app.get('/reset-password/:id/:token', (req, res) => {
    const { id, token } = req.params;
    // res.send(req.params);
    //check if this id exists in database
    if (id !== user.id) {
        res.status(404).send('User not found');
        return;
    }
    //we have a valid id ,and we have a valid user with this id
    const secret = JWT_SECRET + user.password;
    try {
        const payload = jwt.verify(token, secret)
        res.render('reset-password', { email: user.email })
    } catch (error) {
        console.log(error.message);
        res.send(error.message);

    }

})
app.post('/reset-password/:id/:token', (req, res) => {
    // const { email } = req.body;
    // res.send(email);
    const { id, token } = req.params;
    const { password, password2 } = req.body;
    if (id !== user.id) {
        res.status(404).send('User not found');
        return;
    }
    const secret = JWT_SECRET + user.password;
    try {
        const payload = jwt.verify(token, secret);
        user.password = password
        res.send(user)

    } catch (error) {
        console.log(error.message);
        res.send(error.message);

    }
})


app.listen(3000, () => console.log('server running ....'));
