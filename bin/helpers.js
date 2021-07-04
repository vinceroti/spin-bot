"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function timeout(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}
async function sleep(fn, ms) {
  await timeout(ms);
  return fn();
}

exports.sleep = sleep;