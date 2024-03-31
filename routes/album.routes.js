const express = require('express');
const router = express.Router();
const albumcreateform = require('../controllers/album.controller');

router.get('/albums/create',albumcreateform.createAlbumForm);
router.post('/albums/create',albumcreateform.createAlbum);

router.get('/listofAlbum' , albumcreateform.listAlbums);

router.get('/album/:id',albumcreateform.albume);
router.post('/album/:id',albumcreateform.addImageToAlbums);

router.get('/album/:id/delete/:imageIndex',albumcreateform.deletee);
router.get('/album/:id/delete',albumcreateform.deleteAlbum);


module.exports = router; 