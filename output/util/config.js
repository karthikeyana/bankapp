'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var fs = require('fs');

var Config = exports.Config = JSON.parse(fs.readFileSync('config.json'));