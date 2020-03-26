if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const user = require('./models/users')
const categories = require('./models/categories.js')
const jdb = require('./models/jdb.js')
const news = require('./models/news.js')
let event_data = {"events": [] }

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []

app.set('view-engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

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

    // Index | Jdb

    app.get('/', checkAuthenticated, (req, res) => {
      categories.readAll(function(categories)
      {
        jdb.readJdbUser(req.user.id, function(Jdbs)
        { 
          for(Jdb of Jdbs){
                let event =
                {   "content": Jdb.content,
                    "category": Jdb.category,
                    "id": Jdb.id,
                    "year": Number(Jdb.date.format("Y")),
                    "month": Number(Jdb.date.format("M")),
                    "day": Number(Jdb.date.format("D"))}

                event_data["events"].push(event);
          }
          res.render('index.ejs', { eventJdb : event_data ,name : req.user.name , Categories : categories, Admin : req.user} )
          event_data = {"events": [] }
        })

      })
    })

app.post('/', (req, res) =>{
  jdb.create([req.user.id,req.body.category,req.body.content, new Date(req.body.DateJdb)])
  res.redirect('/')  
})

// Outils pédagogiques
app.get('/outils_pedagogiques/:Category',checkAuthenticated, (request,response) =>
{
    categories.readAll(function(Allcategories){
        news.readArticles(request.params.Category,function(articles)
        {
            categories.read(request.params.Category,function(ActualCategory){
                response.render('news.ejs', {ActualCategory:ActualCategory[0].name,Category : request.params.Category, Name : request.session.username , Admin : request.user.admin , Categories : Allcategories, News:articles} )
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
// LOGIN | REGISTER | LOGOUT
app.get('/login', checkNotAuthenticated, (req, res) => {
  categories.readAll(function(categories){
    res.render('login.ejs', { Categories : categories} )
})
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  categories.readAll(function(categories){
    res.render('register.ejs', { Categories : categories} )
})
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    user.create([req.body.name, req.body.email,hashedPassword])
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.get('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.listen(3000)