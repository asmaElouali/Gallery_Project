const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const route = require('./routes/album.routes');
const session=require('express-session');
const flash=require('connect-flash');
const fileUpload = require('express-fileupload');
const app = express();

mongoose.connect('mongodb://localhost:27017/phototheque');

app.use(express.urlencoded({ extended :false }));
app.use(express.json());
app.use(fileUpload());

app.set('views engine','ejs');

app.set(__dirname,path.join('views'));
app.use(express.static('public'));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))
app.use(flash());
/*app.get('/',(req,res)=>{
     res.render('album.ejs' ,{title: 'Albums'})
});*/

//app.get('/album/create',(req,res)=>{
   // res.render('new-albums.ejs',{title:'Nouvel Album'});
//});

app.use('/',route);

app.use((req,res)=>{
    res.status(404);
    res.send('Page non trouvee');
});

app.use((err,req,res,next)=>{
    console.log(err);
    res.status(500);
    res.send('Error intern de serveur');
});

app.listen(3000,()=>{
    console.log(`l application lance sur le server en port 3000`);
})