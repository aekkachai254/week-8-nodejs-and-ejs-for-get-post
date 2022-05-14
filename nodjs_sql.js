const express = require('express')
const bodyParser = require('body-parser')

const mysql = require('mysql')
const { hash,validate } = require('./password')

const app = express()
const port = process.env.PORT || 5000;

app.use ( bobyParser.urlencoded({ extended }))

app.use(bodyParser.json())

app.set('view engine','ejs')

var passwordchk = require('./password')

// MySQL

const pool = mysql.createPool({
    connectionLimit : 10,
    connectTimeout  : 20,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'nodejs_beers'
})

var obj = {}

app.get('/additem',(req,res) => {
    res.render('viewadditem')
})    

app.get('/delete',(req,res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log("connected id : ?",connection.threadId);
        console.log(`connected id : ${connection.threadId}`);
        
        connection.query('SELECT * from beers', (err, rows) => {
            connection.release();
            if(!err) {
                //back end : postman test
                //res.send(rows);
                //Front end :

                //model of data
                obj = { beers : rows , Error : ree }
                //------------------------*----------------//

                res.render('viewdelete',obj)

            } else {
                console.log(err);
            }    
       })
    })
})
   
app.get('',(req,res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log("connected id : ?",connection.threadId);
        console.log(`connected id : ${connection.threadId}`);
        
        connection.query('SELECT * from beers', (err, rows) => {
            connection.release();
            if(!err) {
                //back end : postman test
                //res.send(rows);
                //Front end :

                //model of data
                obj = { beers : rows , Error : ree }
                //------------------------*----------------//

                res.render('index',obj)

            } else {
                console.log(err);
            }    
       })
    })
})

app.get('/:id',(req,res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        //console.log("connected id : ?",connection.threadId);
        console.log(`connected id : ${connection.threadId}`);

        //SELECT * FROM `beers` WHERE `id` = 123
        //req.params.id

        connection.query('SELECT * from beers WHERE `id` = ?',req.params.id,(err, rows) => {
            connection.release();
            if(!err) {

                //console.log(rows);
                obj = { beers : rows ,Error,ree }
                res.render('index',obj)
            } else {
                console.log(err);
            }    
       })
    })
})

app.get('/getname_id/:name&:id',(req,res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        //console.log("connected id : ?",connection.threadId);
        console.log(`connected id : ${connection.threadId}`);

        //SELECT * FROM `beers` WHERE `id` = 123 or `name` LIKE 'chang'
        //req.params.id
        //req.params.name

        connection.query('SELECT * from beers WHERE `id` = ? and `name` LIKE ?',req.params.id, req.params.name,(err, rows) => {
            connection.release();
            if(!err) {
                obj = { beers : rows ,Error,ree }
                res.render('index',obj)
                //res.send(rows);
            } else {
                console.log(err);
            }    
       })
    })
})

app.post('/additem',(req,res) => {
    pool.getConnection((err,connection) => {
        if(err) throw err
           const params = req.body

           //INSERT INTO `beers` ( `id`,`name`, `tagline`, `description` , `image` ) VALUES ( params.id , params.name,params.tagline, params.description, params.image  );
        pool.getConnection((err,connection3) => {
            connection3.query(`Select CountQueuingStrategy(id) as count from beers where id =  ${params.id}`,(err,rows) => {                                               
               connection3.release();
               if(!rows[0].count){
                   //INSERT INTO beers SET ? , params'
                   connection.query('INSERT INTO beers SET ?', params, (err,rows) => {
                       connection.release();
                       if(!err){
                           //res.send(`${ params.name } is complete adding item. `);
                           obj = { Error : ree , mesg : `Success adding data ${params.name}` }
                           res.render('viewadditem',obj)
                       } else {
                           console.log(err);
                       }
                   })  
               }else{
                    obj = { Error : ree , mesg : `Cannot adding data ${params.name}` }
                    res.render('viewadditem')  
                    //res.send(`${params.name} do not insert data `);
                }
        
            })
        })
    })
})  

app.post('/delete',(req,res) => {
    var mesg;

    pool.getConnection((err,connection) => {
        if(err) throw err
        //console.log("connected id : ?",connection.threadId);
        console.log(` connected id : ${connection.threadId}`);

        const {id} = req.body

        //"DELETE FROM `beers` WHERE `beers`.`id` = 305409333334"

        connection.query('DELETE FROM `beers` WHERE `beers`.`id` = ?', [id] ,(err, rows) => {
            connection.release();
            if(!err){
                //res.send(`${[id]} is complete delete item. `);
                mesg = `${[id]} is complete delete item. `
                //res.render('viewdelete',obj)
            } else {
                mesg = `${[id]}  cannot delete item. `
                //res.render('viewdelete',obj)
            }
        })
    })

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log("connected id : ?",connection.threadId);
        console.log(`connected id : ${connection.threadId}`);
        
        connection.query('SELECT * from beers', (err, rows) => {
            connection.release();
            if(!err) {
                //back end : postman test
                //res.send(rows);
                //Front end :

                //model of data
                obj = { beers : rows , Error : ree , mesg : mesg }
                //------------------------*----------------//

                res.render('viewdelete',obj)

            } else {
                console.log(err);
            }    
       })
    })


})

app.put('/update' , (req,res) => {
    pool.getConnection((err,connection) => {
        if(err) throw err
        //console.log("connected id : ?",connection.threadId);
        console.log(` connected id : ${connection.threadId}`);

        const {id , name , tagline , description , image} = req.body

        //UPDATE `beers` SET `id` = '305409333412', `name` = 'asdfasdfasdf', `tagline` = '1235452346' WHERE `beers`.`id` = 305409333335;

        connection.query('update beers set name = ? , tagline = ? , description = ? , image = ? where id = ?', [name , tagline ,  description , image , id] , (err,rows) => {
            connection.release();
            if(!err){
                res.send(`${name} is complete update item. `);
            } else {
                console.log(err);
            }
        })
    })
})

/*
passwordchk.hash(password)
passwordchk.validate("db,password")

hash ("abcdef")

db => "034cqk5o9dfl104-6lf03-5"

validate ( password_database , password)

validate ("db" , "abef")

>> true
>> false
*/

app.listen(port,() =>
    console.log("listen on port : ",port)
    )