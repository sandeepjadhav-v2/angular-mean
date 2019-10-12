// require modules
var fs = require('fs'),
  mkdirp = require('mkdirp');

module.exports.rename = function (path1, path2) {
  return new Promise(function (resolve, reject) {
    fs.rename(path1, path2, function (err) {
      if (err) reject(err);
      fs.stat(path2, function (err, stats) {
        if (err) reject(err);

        resolve(stats);
      });
    });
  });
};

module.exports.copyFile = function (source, target) {
  console.log(source, target);
  var rd = fs.createReadStream(source);
  var wr = fs.createWriteStream(target);
  return new Promise(function(resolve, reject) {
    rd.on('error', reject);
    wr.on('error', reject);
    wr.on('finish', resolve);
    rd.pipe(wr);
  }).catch(function(error) {
    rd.destroy();
    wr.end();
    throw error;
  });
};

module.exports.createDirectory = function (dirPath) {
  return new Promise(function (resolve, reject) {
    mkdirp(dirPath, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(dirPath);
      }
    });
  });
};
