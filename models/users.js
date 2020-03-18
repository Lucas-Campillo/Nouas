let DB = require('../config/db')

class Users{

    constructor (row)
    {
        this.row = row
    }
    get id()
    {
        return this.row.id
    }
    get username()
    {
        return this.row.username
    }
    get password()
    {
        return this.row.password
    }
    get admin()
    {
        return this.row.admin
    }

    static create(data)
    {
        let sql = "INSERT INTO users (username,password) VALUES (?)"
        DB.query(sql,[data], function (err, result) {
            if (err) throw err
            console.log("Insert done")
            
          })
    }

    static verify(user, pass, cb , error)
    {
        let sql = "SELECT * FROM users WHERE username = ? AND password = ?"
        DB.query(sql,[user,pass],function (err, result) {
            if (err) throw err
            if(result.length > 0 )
            {
                cb(result.map((row) => new Users(row)))// Renvoie OK
            }
            else
            {
                error("Mauvais nom d'utilisateur ou mot de passe")// Renvoie ERREUR
            }
        })
    }
}

module.exports = Users