var express = require('express');
var router = express.Router();
var thinky = require('thinky');
var r = thinky.r;
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var Chat = require('../models/Chat.js');
var promise = thinky.dbReady;
server.listen(4000);

// socket io
io.on('connection', function (socket) {
  console.log('User connected');
  socket.on('disconnect', function () {
    console.log('User disconnected');
  });
  socket.on('save-message', function (data) {
    console.log(data);
    io.emit('new-message', {message: data});
  });
});

/* GET ALL CHATS */
router.get('/:room', function (req, res, next) {
  Chat.filter({room: req.params.room}).orderBy('updated_at').run().then(chats => {
    res.json(chats);
  }).catch(err => {
    res.error(err);
  })
});

/* GET SINGLE CHAT BY ID */
router.get('/:id', function (req, res, next) {
  Chat.getAll(req.params.room).run().then(function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE CHAT */
router.post('/', function (req, res, next) {
  Chat.save(req.body).run().then(function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* UPDATE CHAT */
router.put('/:id', function (req, res, next) {
  Chat.getAll(req.params.id).run().then(function (err, post) {
    post.merge(req.body);
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE CHAT */
router.delete('/:id', function (req, res, next) {
  Chat.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
