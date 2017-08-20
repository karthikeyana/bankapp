'use strict';

const fs = require('fs');

export var Config = JSON.parse(fs.readFileSync('config.json'));