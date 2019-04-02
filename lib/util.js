function getTimeName() {
  var date = new Date();
  var res = '' + date.getFullYear();
  var data = [
    '' + (date.getMonth() + 1),
    '' + date.getDate(),
    '' + date.getHours(),
    '' + date.getMinutes(),
    '' + date.getSeconds()
  ];
  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    if (item.length === 1) {
      item = '0' + item;
    }
    res += item;
  }
  return res;
}

module.exports = { getTimeName };
