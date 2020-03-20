let DB = require('../config/db')
let moment = require('../config/moment')


class Jdb{

    constructor (row)
    {
        this.row = row
    }
    get id()
    {
        return this.row.id
    }
    get id_user()
    {
        return this.row.id_user
    }
    get category()
    {
        return this.row.category
    }
    get content()
    {
        return this.row.content
    }
    get date()
    {
        return moment(this.row.date)
    }

    static readJdbUser(id,cb)
    {
        let sql = "SELECT * FROM jdb WHERE id_user = ?"
        DB.query(sql,[id], function (err,result){
            if (err) throw err
            cb(result.map((row) => new Jdb(row)))
        })
    }

    static create(data)
    {
        let sql = "INSERT INTO jdb (id_user,category,content,date) VALUES (?)"
        DB.query(sql,[data], function (err, result) {
            if (err) throw err
            console.log("Insert new jdb done")
            
          })
    }
    
}

module.exports = Jdb