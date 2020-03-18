let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let url = require('url')
let news = require('./models/news.js')
let users = require('./models/users.js')
let session = require('express-session')
// EJS
app.set('view engine','ejs')

// Middlewares
app.use(bodyParser.urlencoded({ extended:false}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'aerrageargrf',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

// Routes

app.get('/', (request, response) =>{
    response.render('index', {test: 'Salut'} )
}) 

app.post('/', (request, response) =>{
    console.log(url.parse(request.url).name)
    response.render('index', {test : 'Salut' , Nom : request.body.name })
})

app.get('/news', (request,response) =>
{
    console.log(request.session.user)
    console.log(request.session.admin)
    news.all(function(news){
        response.render('news', {News : news})
})
})

app.get('/logIn' , (request,response)=>
{
    response.render('logIn')
})

app.post('/login' , (request,response)=>
{
    users.verify(request.body.username,request.body.password, function(user){
    console.log(user[0].admin)

        request.session.user = user[0].username
        request.session.admin = user[0].admin

        response.render('index', { User : user})
    },function(err){ response.render('login', { Erreur : err})})
})


app.post('/news/create' , (request, response) =>
{
    news.create([request.body.name,request.body.content,new Date()])
    response.redirect('/news')
})

app.get('/news/delete/:Id' , (request , response ) =>{
    news.delete(request.params.Id)
    response.redirect('/news')
})

app.post('/news/update/:Id', (request , response ) =>{
    news.update([request.body.name,request.body.content,new Date()],request.params.Id)
    response.redirect('/news')
})

app.listen(8080)