'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);
    if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);
        if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;
        if (getter === undefined) {
            return undefined;
        }
        return getter.call(receiver);
    }
};

var _createClass = function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _rx = require('rx');

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

require('es6-shim');

var nodefetch = require('node-fetch');

var _zlib = require('mz/zlib');

var _zlib2 = _interopRequireDefault(_zlib);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var regeneratorRuntime = _regenerator2.default;

if (typeof Object.assign != 'function') {
    Object.assign = function(target) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source != null) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };
}

var Promise = require('bluebird');

var _formUrlencoded = require('form-urlencoded');

var _formUrlencoded2 = _interopRequireDefault(_formUrlencoded);

var logger = require('tracer').colorConsole();

var _TaskQueue = require('./TaskQueue');

var _TaskQueue2 = _interopRequireDefault(_TaskQueue);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

function _asyncToGenerator(fn) {
    return function() {
        var gen = fn.apply(this, arguments);
        return new Promise(function(resolve, reject) {
            function step(key, arg) {
                try {
                    var info = gen[key](arg);
                    var value = info.value;
                } catch (error) {
                    reject(error);
                    return;
                }
                if (info.done) {
                    resolve(value);
                } else {
                    return Promise.resolve(value).then(function(value) {
                        return step("next", value);
                    }, function(err) {
                        return step("throw", err);
                    });
                }
            }
            return step("next");
        });
    };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var DEFAULT_TIMEOUT = 10000;
var MODES = {
    track: {
        debug: false,
        dryRun: false
    },
    debug: {
        debug: true,
        dryRun: false
    },
    dryRun: {
        debug: true,
        dryRun: true
    }
};

var Submitter = function(_Subject) {
    _inherits(Submitter, _Subject);

    _createClass(Submitter, null, [{
        key: 'composeDebugUrl',
        value: function composeDebugUrl(url) {
            return _url2.default.format(_ramda2.default.merge(_url2.default.parse(url), {
                pathname: '/debug'
            }));
        }
    }]);

    function Submitter(_ref) {
        // console.log('dewdwe' + _ref);
        var url = _ref.url;
        var _ref$gzip = _ref.gzip;
        var gzip = _ref$gzip === undefined ? true : _ref$gzip;
        var _ref$mode = _ref.mode;
        var mode = _ref$mode === undefined ? 'track' : _ref$mode;
        var _ref$timeout = _ref.timeout;
        var timeout = _ref$timeout === undefined ? DEFAULT_TIMEOUT : _ref$timeout;

        _classCallCheck(this, Submitter);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Submitter).call(this));

        if (typeof arguments[0] === 'string') {
            // eslint-disable-line prefer-rest-params
            url = arguments[0]; // eslint-disable-line no-param-reassign, prefer-rest-params
        }

        if (url == null) {
            throw new Error('Url is not provided');
        }

        if (MODES[mode] == null) {
            throw new Error('Unknown mode: ' + mode);
        }

        Object.assign(_this, {
            url: url,
            gzip: gzip,
            timeout: timeout
        }, MODES[mode]);

        if (_this.logger) {
            _this.url = Submitter.composeDebugUrl(url);
        }

        logger.debug('Config: %o', _this);
        _this.dataQueue = new _TaskQueue2.default({
          consumeData: _this.submit.bind(_this),
          onSucceeded: function onSucceeded() {
            _get(Object.getPrototypeOf(Submitter.prototype), 'next', _this).call(_this, null);
          },
          onError: _this.onError.bind(_this)
        });
        return _this;
    }

    _createClass(Submitter, [{
        key: 'catch',
        value: function _catch(callback) {
            this.subscribe(_ramda2.default.identity, callback, _ramda2.default.identity);
        }
    }, {
        key: 'onNext',
        value: function(data) {
          logger.debug('onNext(%o)', data);

          if (data == null) {
            debug('Skiped due to empty data');
            return;
          }

          var messages = Array.isArray(data) ? data : [data];

          if (messages.length === 0) {
            debug('Skiped due to empty batch data');
            return;
          }

          this.dataQueue.enqueueAndStart(messages);
        }
    }, {
        key: 'submit',
        value: function(messages) {
          var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(messages) {
            var payloadText, dataListBuffer, body, headers, response, errorMessage;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    logger.debug('submit(%j)', messages);
                    payloadText = new Buffer(JSON.stringify(messages), 'utf8');
                    _context.next = 4;
                    return this.gzip ? _zlib2.default.gzip(payloadText) : payloadText;

                  case 4:
                    dataListBuffer = _context.sent;
                    body = (0, _formUrlencoded2.default)({
                      data_list: dataListBuffer.toString('base64'),
                      gzip: this.gzip ? 1 : 0
                    });
                    headers = {
                      'User-Agent': 'SensorsAnalytics Node SDK',
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'Dry-Run': this.dryRun ? 'true' : undefined
                    };


                    logger.debug('Post to %s', this.url);
                    logger.debug('Headers: %o', headers);
                    logger.debug('Body: %o', body);

                    logger.debug('Posting...');
                    _context.next = 13;
                    return nodefetch(this.url, { method: 'POST', headers: headers, body: body, timeout: this.timeout });

                  case 13:
                    response = _context.sent;

                    debug('Post complete');

                    if (!response.ok) {
                      _context.next = 18;
                      break;
                    }

                    debug('Suceeded: %d', response.status);
                    return _context.abrupt('return');

                  case 18:

                    debug('Error: %s', response.status);

                    if (!(this.debug && messages.count > 1 && response.status === 400)) {
                      _context.next = 22;
                      break;
                    }

                    debug('Batch mode is not supported in debug');
                    throw new Error('Batch mode is not supported in Debug');

                  case 22:
                    _context.next = 24;
                    return response.text();

                  case 24:
                    errorMessage = _context.sent;
                    throw new Error(errorMessage);

                  case 26:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, this);
            }));

            function submit(_x2) {
                return ref.apply(this, arguments);
            }

            return submit;
        }()
    }]);

    return Submitter;
}(_rx.Subject);

exports.default = Submitter;
