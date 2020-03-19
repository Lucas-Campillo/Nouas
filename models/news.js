let DB = require('../config/db')
let moment = require('../config/moment')

class News{

    constructor (row)
    {
        this.row = row
    }
    get id()
    {
        return this.row.id
    }
    get title()
    {
        return this.row.title
    }
    get content()
    {
        return this.row.content
    }
    get created_at()
    {
        return moment(this.row.created_at)
    }

    static all(cb)
    {
        let sql= "SELECT * FROM nouas"
        DB.query(sql,function (err, result) {
            if (err) throw err
            console.log("read done")
            cb(result.map((row) => new News(row)))
          })

    }
    static readArticles(category,cb)
    {
        let sql = "SELECT * FROM articles WHERE category = ?"
        DB.query(sql,[category], function (err,result){
            if (err) throw err
            cb(result.map((row) => new News(row)))
        })
    }
    static create(data)
    {
        let sql = "INSERT INTO nouas (title,content,created_at) VALUES (?)"
        DB.query(sql,[data], function (err, result) {
            if (err) throw err
            console.log("Insert done")
          })
    }
    static delete(id)
    {
        let sql = "DELETE FROM nouas WHERE id = ?"
        DB.query(sql,[id] , function(err, result) {
            if (err) throw err
            console.log("Delete done")})
    }
    static update(data,id)
    {
        let sql = "UPDATE nouas SET title=?, content=?, updated_at=? WHERE id = ?"
        DB.query(sql,[data[0],data[1],data[2],id] , function(err, result) {
            if (err) throw err
            console.log("Update done")})
    }

}

module.exports = News