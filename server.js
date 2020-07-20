const express = require('express');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const app = express();
const cors = require('cors');
const knex = require('knex');
app.use(bodyParser.json())
app.use(cors());


const db = knex({
  client: 'pg',
  connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
                rejectUnauthorized: false,
}
}
});




app.get('/', (req, res)=>{
	 db.select('*').from ('users').then(user=>{
      res.send(user);
    })

})


app.post('/create', (req, res) => {
   let {email, name, nation, title, linkedin, github} = req.body;
   if (!email || !name|| !nation ){
     return res.status(400).json('incorrect form submission ')
   }
   if (title ===''){
      title = 'None'
   }

   if (linkedin ===''){
      linkedin = 'None'
   }

   if (github ===''){
      github = 'None'
   }

   db('users')
   .returning('*')
   .insert({
      email: email,
      name: name,
      nation: nation,
      title: title,
      linkedin: linkedin,
      github: github,
      joined: new Date()
   })

   .then(user=>{
      res.json(user[0]);
   })
   .catch(err=> res.status(400).json('failed to create robofriends'))
})




app.listen(process.env.PORT || 3000, ()=>{
  console.log(`app is running on port ${process.env.PORT}`)
}) 