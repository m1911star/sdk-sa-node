var _saSdkNode = require('../src/index');
var _saSdkNode2 = _interopRequireDefault(_saSdkNode);
// var debug = require('stream-debug');
var logger = require('tracer').console();


function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sa = new _saSdkNode2.default();
sa.submitTo('http://{$service_name}.cloud.sensorsdata.cn:8006/sa?project={$project_name}&token={$project_token}', {mode: 'track'});
sa.profileSetOnce('12345669', { registerTime: new Date().valueOf() });
sa.profileSet('12345669', {
  "$app_version": "1.0.1",
  "$lib_version": "1.4.0",
  "$lib": "node"
});
