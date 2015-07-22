(function() {
  'use strict';
  var SeXHR, onload, onprogress,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  onload = function(options, e) {
    var response;
    response = {
      e: e,
      text: this.responseText,
      status: this.status,
      headers: (function() {
        var headers;
        headers = {};
        this.getAllResponseHeaders().split('\n').filter(function(header) {
          return header.trim() !== '';
        }).map(function(header) {
          return header.split(':').map(function(headerPart) {
            return headerPart.trim();
          });
        }).forEach(function(headerParts) {
          return headers[headerParts[0]] = headerParts[1];
        });
        return headers;
      }).call(this)
    };
    if (options.json || ((response.headers['Content-type'] != null) && response.headers['Content-type'] === 'application/json')) {
      response.json = JSON.parse(response.text);
    }
    return options.done(null, response);
  };

  onprogress = function(options) {
    return options.progress.call({
      percent: this.loaded / this.total * 100,
      loaded: this.loaded,
      total: this.total,
      timestamp: this.timeStamp,
      e: this
    });
  };

  SeXHR = (function() {
    function SeXHR() {
      this.kill = __bind(this.kill, this);
      this.req = __bind(this.req, this);
    }

    SeXHR.prototype.xhr = new XMLHttpRequest();

    SeXHR.prototype.req = function(args) {
      var key, opts, val, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      opts = {
        url: (_ref = args.url) != null ? _ref : null,
        method: (_ref1 = args.method) != null ? _ref1 : 'GET',
        json: (_ref2 = args.json) != null ? _ref2 : null,
        body: (_ref3 = args.body) != null ? _ref3 : null,
        mime: (_ref4 = args.mime) != null ? _ref4 : null,
        timeout: (_ref5 = args.timeout) != null ? _ref5 : 0,
        headers: (_ref6 = args.headers) != null ? _ref6 : null,
        username: (_ref7 = args.username) != null ? _ref7 : null,
        password: (_ref8 = args.password) != null ? _ref8 : null,
        async: (_ref9 = args.async) != null ? _ref9 : true,
        done: (_ref10 = args.done) != null ? _ref10 : null,
        loadstart: (_ref11 = args.loadstart) != null ? _ref11 : null,
        progress: (_ref12 = args.progress) != null ? _ref12 : null,
        loadend: (_ref13 = args.loadend) != null ? _ref13 : null
      };
      if (typeof opts.done === 'function') {
        this.xhr.addEventListener('load', (function(e) {
          return onload.call(e.target, opts, e);
        }), false);
        this.xhr.addEventListener('timeout', (function(e) {
          return opts.done({
            e: e,
            error: 'timeout'
          }, null);
        }), false);
        this.xhr.addEventListener('abort', (function(e) {
          return opts.done(null, {
            e: e,
            aborted: true
          });
        }), false);
        this.xhr.addEventListener('error', (function(e) {
          return opts.done({
            e: e,
            error: 'XHR error'
          }, null);
        }), false);
        this.xhr.addEventListener('loadstart', (function(e) {
          var _ref14;
          return (_ref14 = opts.loadstart) != null ? _ref14.call(e) : void 0;
        }), false);
        this.xhr.addEventListener('progress', (function(e) {
          if (e.lengthComputable && (opts.progress != null)) {
            return onprogress.call(e, opts);
          }
        }), false);
        this.xhr.addEventListener('loadend', (function(e) {
          var _ref14;
          return (_ref14 = opts.loadend) != null ? _ref14.call(e) : void 0;
        }), false);
        if ((opts.url != null) && typeof opts.url === 'string') {
          if (opts.username && opts.password) {
            this.xhr.open(opts.method, opts.url, opts.async, opts.username, opts.password);
          } else {
            this.xhr.open(opts.method, opts.url, opts.async);
          }
          if (opts.timeout > 0 && opts.async) {
            this.xhr.timeout = opts.timeout;
          }
          if (opts.headers != null) {
            _ref14 = opts.headers;
            for (key in _ref14) {
              val = _ref14[key];
              this.xhr.setRequestHeader(key, val);
            }
          }
          if (opts.mime != null) {
            this.xhr.overrideMimeType(opts.mime);
          }
          return this.xhr.send(opts.body);
        } else {
          throw new Error('[SeXHR] `url` is undefined.');
        }
      } else {
        throw new Error('[SeXHR] `done` handler must be a function.');
      }
    };

    SeXHR.prototype.kill = function() {
      return this.xhr.abort();
    };

    return SeXHR;

  })();

  this.sexhr = SeXHR;

}).call(this);
