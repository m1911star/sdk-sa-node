/**
 * Created by m1911 on 16/7/28.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug2.default)('sa:TaskQueue');

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var regeneratorRuntime = _regenerator2.default;

var NOP = function NOP() {};

var TaskQueue = function () {
  function TaskQueue() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var consumeData = _ref.consumeData;
    var _ref$onSucceeded = _ref.onSucceeded;
    var onSucceeded = _ref$onSucceeded === undefined ? NOP : _ref$onSucceeded;
    var _ref$onError = _ref.onError;
    var onError = _ref$onError === undefined ? NOP : _ref$onError;

    _classCallCheck(this, TaskQueue);

    this.head = null;
    this.tail = null;

    this.consumeData = consumeData;
    this.onSucceeded = onSucceeded;
    this.onError = onError;

    this.executing = false;
  }

  _createClass(TaskQueue, [{
    key: 'enqueue',
    value: function enqueue(data) {
      debug('Eneque: %o', data);

      var node = {
        data: data,
        next: null
      };

      if (this.tail == null) {
        this.tail = node;
        this.head = node;
      } else {
        this.tail.next = node;
        this.tail = node;
      }
    }
  }, {
    key: 'dequeue',
    value: function dequeue() {
      debug('Dequeue');
      var result = this.head;

      if (result == null) {
        return null;
      }

      this.head = result.next;
      if (this.head == null) {
        this.tail = null;
      }

      return result.data;
    }
  }, {
    key: 'executeTask',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var data, result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                debug('Execute Task...');

                if (this.hasData) {
                  _context.next = 5;
                  break;
                }

                this.executing = false;
                debug('Queue is empty, stop...');
                return _context.abrupt('return', null);

              case 5:

                this.executing = true;
                data = this.dequeue();
                _context.prev = 7;

                debug('Consume data: %o', data);
                _context.next = 11;
                return this.consumeData(data);

              case 11:
                result = _context.sent;

                debug('Succeeded');
                if (this.onSucceeded != null) {
                  this.onSucceeded(result);
                }
                _context.next = 20;
                break;

              case 16:
                _context.prev = 16;
                _context.t0 = _context['catch'](7);

                debug('Failed: %s', _context.t0);
                if (this.onError != null) {
                  this.onError(_context.t0);
                }

              case 20:
                return _context.abrupt('return', this.executeTask());

              case 21:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[7, 16]]);
      }));

      function executeTask() {
        return ref.apply(this, arguments);
      }

      return executeTask;
    }()
  }, {
    key: 'start',
    // No await to flattern cascaded promises
    value: function start() {
      debug('Start task...');
      if (this.consumeData == null) {
        debug('consumeData is not given');
        throw new Error('consumeData is not given');
      }

      if (this.executing) {
        debug('Already running');
        return null;
      }

      return this.executeTask();
    }
  }, {
    key: 'enqueueAndStart',
    value: function enqueueAndStart(data) {
      this.enqueue(data);
      return this.start();
    }
  }, {
    key: 'hasData',
    get: function get() {
      return this.head != null;
    }
  }]);

  return TaskQueue;
}();

exports.default = TaskQueue;