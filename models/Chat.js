var thinky = require('thinky')();
var r = thinky.r;
var type = thinky.type;

// Create a model - the table is automatically created
var Chat = thinky.createModel("Chat", {
  room: type.string(),
  nickname: type.string(),
  message: type.string(),
  updated_at: type.date().default(r.now())
});

module.exports = Chat;
