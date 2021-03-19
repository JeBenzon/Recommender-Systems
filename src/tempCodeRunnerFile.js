
app.get('', (req, res) => {
    res.render('loginpage', {
        title: 'Login',
    })
})