import "core-js/modules/es.array.includes";
import "core-js/modules/es.object.to-string";
import "core-js/modules/es.promise";
var a = new Promise(function (r, rj) {
  r(1);
});
var b = [1, 2, 3].includes(1);
export default a;