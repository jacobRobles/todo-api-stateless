//jacob robles
//april 23

const express = require('express')
const path = require('path');
const db = require('./data') 

const app = express()
const port = 3000;

app.use(express.json( ));
app.use(express.static('public'))

app.get('/todos', (req, res)=>{
db.all('SELECT * FROM todos',(err, rows)=>{
  if(err){
      res.status(500).json({message:'Database error'})
  } else {
      res.json(rows)
  }
})
})

app.get('/todos/:id', (req,res)=>{
    let id = req.params.id

    db.get('SELECT * FROM todos WHERE id = ?', [id],(err,row)=>{
        if(err){
            res.status(500).json({message:'Database error'})
        } else {
            if (!row){
                res.status(404).json({message:'Todo not found'})
            } else{
                res.json(row)
            }
        }
    })
})
//posting
app.post('/todos',(req,res)=>{
  const { name, priority = 'low', isFun = true } = req.body

  if(!name){
    res.status(400).json({message:'Name is required'})
    return
  }

  db.run(`INSERT INTO todos (name, priority, isComplete, isFun)
          VALUES (?, ?, ?, ?)`,
    [name, priority, false, isFun], function(err){
      if(err){
        res.status(500).json({message:'Database insert error'})

      } else {
        res.status(201).json({
          id: this.lastID,
          name:  name ,
          priority,
          isComplete: false,
          isFun
        })
      }
    })
})
//delteing
 app.delete('/todos/:id', (req,res)=>{
    const id=req.params.id;

    db.run('DELETE FROM todos WHERE id = ?', [id], function(err){
        if(err){
            res.status(500).json({message:'Database delete error'})

        } else {
            if(this.changes===0){

                res.status(404).json({message:'Todo is not found'})

            } else{
                res.json({message: `Todo item ${id} deleted.`})
            }
        }
    })
 })

app.listen(port,()=>{
  console.log('Server is running at http://localhost:' + port)
})
