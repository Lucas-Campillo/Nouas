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
        response.render('index', { Name : request.session.username , Admin : request.session.admin} )
    }) 
    
    app.post('/', (request, response) =>{
        response.render('index', {test : 'Salut' , Nom : request.body.name })
    })
    
    app.get('/news', (request,response) =>
    {
        console.log(request.session.username)
        console.log(request.session.admin)
        news.all(function(news){
        response.render('news', {News : news, Admin : request.session.admin})
    })
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

    app.get('/login', (request, response) =>{
        response.render('login')
    })
    app.post('/login' , (request,response)=>
    {
        users.verify(request.body.username,request.body.password, function(user){
            request.session.username = user[0].username
            request.session.admin = user[0].admin
            response.redirect('/')
        },function(err){ response.render('login', { Erreur : err})})
    })

    app.get('/signin', (request, response) =>{
        response.render('signin')
    })
    app.post('/signin' , (request,response)=>
    {
        users.create([request.body.username,request.body.password])
        users.verify(request.body.username,request.body.password, function(user){
            request.session.username = user[0].username
            request.session.admin = user[0].admin
            response.redirect('/')
        },function(err){ response.render('login', { Erreur : err})})
    })
    app.get('/logout' , (request,response)=>
    {
        request.session.destroy();
       response.redirect('/login')
    })



app.listen(8080)