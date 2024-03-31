const album = require('../models/album');
const path = require('path');
const catchAsync = require('../helpers/CatchAsync');
const fs = require('fs');
const {rimraf} = require('rimraf');



const createAlbumForm = (req, res) => {
    res.render('new-albums.ejs', { title: 'Nouvel album', errors: req.flash('error')});
}

const createAlbum = async (req, res) => {
    try {
        if (!req.body.albumtitle) {
            req.flash('error', "le titre ne doit pas etre vide");
            res.redirect('/albums/create');
            return
        }
        await album.create({
            title: req.body.albumtitle,
        });
        res.redirect('/');
    } catch (err) {
        req.flash("error", "Erreur lors de la creation");
        res.redirect('/albums/create');
    }
}

const listAlbums = catchAsync(async (req , res)=>{
      const albums = await album.find();
      res.render('albums.ejs' , {title :'liste of albums',titles :albums});
})
const albume =catchAsync(async (req , res)=>{
    try{
        const id = req.params.id
        const albu = await album.findById({_id :id});
        res.render('album.ejs',{ title: `Mon album ${albu.title}`, titles: albu , errors: req.flash('error'),});
    }catch(err){
         console.log(err);
         res.redirect('/404');
    }

})



const addImageToAlbums=catchAsync(async (req,res)=>{
    const idAlbum = req.params.id ;
    const upload = await album.findById(idAlbum);
   
    if(!req?.files?.image){
        req.flash('error','Aucun fichier mis en ligne');
        res.redirect(`/album/${idAlbum}`);
        return;
    }

    const imageName = req.files.image.name ; 
    const image = req.files.image ;
    if(image.mimetype !='image/jpeg' && image.mimetype !='image/png'){
        req.flash('error','Fichiers JPEG ET PNG accepte uniquement');
        res.redirect(`/album/${idAlbum}`);
        return;
    }
    const folderPath = path.join(__dirname,'../public/uploads',idAlbum);
    fs.mkdirSync(folderPath ,{ recursive:true });
    console.log(req.files);
    console.log(upload);
    const localPath = path.join(__dirname ,'../public/uploads', idAlbum, imageName);
    await req.files.image.mv(localPath);

    upload.image.push(imageName);
    upload.save();
    res.redirect(`/album/${idAlbum}`);
})

const deletee= catchAsync(async (req,res)=>{
    const Albumid = req.params.id;
    const al = await album.findById(Albumid);
    const imageIndexe = req.params.indexImage;
    const image = al.image[imageIndexe];

    if(!image){
        res.redirect(`/album/${Albumid}`);
        return;
    }
    
    al.image.splice(imageIndexe, 1);
    await al.save();
    
    const imagePath = path.join(__dirname,'../public/uploads', Albumid, image);
    fs.unlinkSync(imagePath);

    res.redirect(`/album/${Albumid}`);
})

const deleteAlbum =catchAsync(async (req,res)=>{
    const idAlbum = req.params.id  ;
    await album.findByIdAndDelete(idAlbum) ;

    const albumPath = path.join(__dirname ,'../public/uploads', idAlbum);
    rimraf(albumPath,() => { 
            res.redirect('/albums');
    });

})

module.exports = {
    deleteAlbum,
    deletee,
    addImageToAlbums,
    albume,
    listAlbums,
    createAlbumForm,
    createAlbum
}