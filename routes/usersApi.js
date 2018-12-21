var express = require('express');
var router = express.Router();
var db = require('./queries');

router.get('/progressionusers', db.getAllUsers)
router.post('/progressionusers', db.signIn)
router.post('/progressionusers/new', db.createUser)


// router.post('/users/favorites/new', db.addFavorite)
// router.get('/users/:id/favorites', db.getAllFavorites)
// router.delete('/users/:id/favorites/:movie_id', db.deleteFavorite)

module.exports = router;
