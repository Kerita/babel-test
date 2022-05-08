"use strict";

require("core-js/modules/es.array.includes.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

var fn = function fn() {
  var a = [];
  a.includes(1);
  var b = "";
  b.replaceAll();
};

new Promise(fn);
