let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let url = require('url')
let session = require('express-session')
let news = require('./models/news.js')
let users = require('./models/users.js')
let categories = require('./models/categories.js')
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
        categories.read(function(categories){
            console.log(categories)
            response.render('index', { Name : request.session.username , Admin : request.session.admin , Categories : categories} )
        })
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
    app.get('/outils_pedagogique/:Category', (request,response) =>
    {
        categories.read(function(categoriess){
            news.readArticles(request.params.Category,function(articles)
            {
                response.render('news', {Category : request.params.Category, Name : request.session.username , Admin : request.session.admin , Categories : categoriess, News:articles} )
            })
        })
    })
    
    app.post('/outils_pedagogique/:Category', (request,response) =>
    {
        news.create([request.body.name,request.body.content,new Date(),request.params.Category])
        response.redirect('/outils_pedagogique/'+request.params.Category)
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
        categories.read(function(categories){
            console.log(categories)
            response.render('login', { Name : request.session.username , Admin : request.session.admin , Categories : categories} )
        })
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
        categories.read(function(categories){
            console.log(categories)
            response.render('signin', { Name : request.session.username , Admin : request.session.admin , Categories : categories} )
        })
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
    app.post('/categories/create', (request,response)=>
    {
        const regex = (/ /gi);
        const regex2 = (/é|è|ê|ê|Ë|Ê|É|È/gi);
        const regex3 = (/à|â|ä|À|Â|Ä/gi);
        let formate = request.body.category.toLowerCase().replace(regex,'_').replace(regex2,'e').replace(regex3,'a')
        categories.create([request.body.category.toUpperCase(),formate])
      response.redirect('/')
    })


app.listen(8080)