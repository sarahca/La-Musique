'use strict';

exports.joinChannel = function (req, res) {
  console.log('joining channel in chat/api');
  var channel = req.body.channel;
  req.session.channel = channel;
  res.send(200, {message: 'you are on channel ' + channel});
}

exports.getChannel = function (req, res) {
  console.log('getting previous channel');
  var channel = req.session.channel;
  if ( channel )
    res.send(200, {channel: channel});
  else
    res.send(404, {message: 'you were not on this channel'});
}