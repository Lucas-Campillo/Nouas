let DB = require('../config/db')

class Categories{

    constructor (row)
    {
        this.row = row
    }
    get id()
    {
        return this.row.id
    }
    get name()
    {
        return this.row.name
    }
    get link_name()
    {
        return this.row.link_name
    }

    static read(category, cb)
    {
        let sql = "SELECT name FROM categories WHERE link_name=?"
        DB.query(sql,[category], function (err,result){
            if (err) throw err
            cb(result)
        })
    }

    static readAll(cb)
    {
        let sql = "SELECT * FROM categories"
        DB.query(sql, function (err,result){
            if (err) throw err
            cb(result)
        })
    }
    
    static create(data)
    {
        let sql = "INSERT INTO categories (name,link_name) VALUES (?)"
        DB.query(sql,[data], function (err, result) {
            if (err) throw err
            console.log("Insert new category done")
            
          })
    }
    static delete(data)
    {
        let sql ="DELETE FROM categories WHERE link_name = ?"
        DB.query(sql,[data], function (err, result) {
            if (err) throw err
            console.log("Delete category done")
            
          })
    }
}

module.exports = Categories