'use strict';

/**
 * Module dependencies
 */

exports.base64Encode = function(value) {
  return new Buffer(value).toString('base64');
};

exports.base64Decode = function(value) {
  return Buffer.from(value, 'base64').toString('ascii');
};

