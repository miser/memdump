const fs = require('fs');
const path = require('path');
const heapdump = require('heapdump');
const mkdirp = require('mkdirp');
const memwatch = require('node-memwatch');
const getSize = require('get-folder-size');
const util = require('./util');

const defaults = {
  path: './heapsnapshot',
  type: 'all',
  initLog: true,
  cb: null, // fire callback when leak event had been triggered
  maxCount: 3, // exist max count in the directory
  maxSize: 10 // 10M
};

class MemDump {
  constructor(options) {
    this.options = Object.assign({}, defaults, options);
    if (this.options.initLog) {
      this.log();
    }
  }
  get unit() {
    return 1024 * 1024;
  }
  async log() {
    const dirPath = this._checkDir();
    const filePath = path.join(dirPath, `${util.getTimeName()}.heapsnapshot`);
    heapdump.writeSnapshot(filePath);
    return filePath;
  }
  start() {
    memwatch.on('leak', info => {
      const filePath = this.log();
      this.options.cb && this.options.cb(filePath);
    });
  }
  _clearDir(dirPath, hasReadFiles) {
    var files = hasReadFiles || fs.readdirSync(dirPath);
    if (files.length <= this.options.maxSize) {
      return;
    }
    if (!hasReadFiles) {
      files.sort(function(a, b) {
        return (
          fs.statSync(path.join(dirPath, a)).mtime.getTime() -
          fs.statSync(path.join(dirPath, b)).mtime.getTime()
        );
      });
    }
    if (files.length > 0) {
      const fileName = files[0];
      fs.unlinkSync(path.join(dirPath, fileName));
      files.shift();
      this._clearDir(dirPath, files);
    }
  }
  _checkDir() {
    const dirPath = path.join(
      process.cwd(),
      this.options.path,
      this.options.type + '-' + process.pid
    );
    mkdirp.sync(dirPath);
    getSize(dirPath, (err, size) => {
      if (err) {
        reject(err);
        return;
      }
      if (size / this.unit > this.options.maxSize) {
        this._clearDir(dirPath);
      }
    });
    return dirPath;
  }
}

module.exports = MemDump;
