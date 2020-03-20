let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let url = require('url')
let session = require('express-session')
let news = require('./models/news.js')
let users = require('./models/users.js')
let categories = require('./models/categories.js')
let jdb = require('./models/jdb.js')
let event_data = {"events": [] }
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

  // Header
    app.post('/categories/create', (request,response)=>
    {
        const regex = (/ /gi);
        const regex2 = (/é|è|ê|ê|Ë|Ê|É|È/gi);
        const regex3 = (/à|â|ä|À|Â|Ä/gi);
        let formate = request.body.category.toLowerCase().replace(regex,'_').replace(regex2,'e').replace(regex3,'a')
        categories.create([request.body.category.toUpperCase(),formate])
        response.redirect('/')
    })

    app.get('/categories/delete/:Category', (request,response)=>
    {
        categories.delete([request.params.Category])
        response.redirect('/')
    })

  // Index
    app.get('/', (request, response) =>{
        categories.readAll(function(categories){
            jdb.readJdbUser(request.session.Id, function(Jdbs)
            { 
                for(Jdb of Jdbs){
                        let event =
                        {   "occasion": Jdb.content,
                            "category": Jdb.category,
                            "year": Number(Jdb.date.format("Y")),
                            "month": Number(Jdb.date.format("M")),
                            "day": Number(Jdb.date.format("D"))}

                        event_data["events"].push(event);
                 }
                response.render('index', { eventJdb : event_data,Name : request.session.username , Admin : request.session.admin , Categories : categories} )
                event_data = {"events": [] }
            })

        })
    }) 
    app.post('/', (request, response) =>{
        jdb.create([request.session.Id,request.body.category,request.body.content, new Date(request.body.DateJdb)])
        response.redirect('/')  
    })
  // Outils pédagogiques
    app.get('/outils_pedagogiques/:Category', (request,response) =>
    {
        categories.readAll(function(Allcategories){
            news.readArticles(request.params.Category,function(articles)
            {
                categories.read(request.params.Category,function(ActualCategory){
                    response.render('news', {ActualCategory:ActualCategory[0].name,Category : request.params.Category, Name : request.session.username , Admin : request.session.admin , Categories : Allcategories, News:articles} )
                })
                
            })
        })
    })
    
    app.post('/outils_pedagogiques/create/:Category', (request,response) =>
    {
        news.create([request.body.name,request.body.content,new Date(),request.params.Category])
        response.redirect('/outils_pedagogiques/'+request.params.Category)
    })

    app.get('/outils_pedagogiques/delete/:Category/:Id', (request,response) =>
    {
        news.delete(request.params.Id)
        response.redirect('/outils_pedagogiques/'+request.params.Category)
    })

    app.post('/outils_pedagogiques/update/:Category/:Id', (request,response) =>
    {
        console.log(request.params.Category)
        news.update([request.body.name,request.body.content,new Date(),request.params.Category],request.params.Id)
        response.redirect('/outils_pedagogiques/'+request.params.Category)
    })
  // LogIn SignIn LogOut
    app.get('/login', (request, response) =>{
        categories.readAll(function(categories){
            response.render('login', { Name : request.session.username , Admin : request.session.admin , Categories : categories} )
        })
    })

    app.post('/login' , (request,response)=>
    {
        users.verify(request.body.username,request.body.password, function(user){
            request.session.username = user[0].username
            request.session.Id = user[0].id
            request.session.admin = user[0].admin
            response.redirect('/')
        },function(err){ response.render('login', { Erreur : err})})
    })

    app.get('/signin', (request, response) =>{
        categories.readAll(function(categories){
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
        },function(err){ response.render('signin', { Erreur : err})})
    })
    app.get('/logout' , (request,response)=>
    {
        request.session.destroy();
        response.redirect('/login')
    })
  


app.listen(8080)