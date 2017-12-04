module.exports = (req, res, next) => {
  var send = res.send;
  res.send = function (string) {
    var body = string instanceof Buffer ? string.toString() : string;
    let obj = JSON.parse(string);
    if (obj.length === 1) {
      body = JSON.stringify(obj[0]);
    }
    send.call(this, body);
  }
  next();
}
