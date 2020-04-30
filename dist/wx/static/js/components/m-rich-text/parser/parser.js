var __CML__GLOBAL = require("../../../manifest.js");
__CML__GLOBAL.webpackJsonp([2],{

/***/ "../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/babel-loader/lib/index.js?{\"filename\":\"C:\\\\Users\\\\89705\\\\AppData\\\\Roaming\\\\npm\\\\node_modules\\\\chameleon-tool\\\\chameleon.js\"}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/chameleon-loader/src/cml-compile/wxml-selector.js?type=script!./src/components/m-rich-text/parser/parser.wxml":
/***/ (function(module, exports, __webpack_require__) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
  parser 主组件
  github：https://github.com/jin-yufeng/Parser
  docs：https://jin-yufeng.github.io/Parser
  author：JinYufeng
  update：2020/04/25
*/
var cache = {},
    Parser = __webpack_require__("./src/components/m-rich-text/parser/libs/MpHtmlParser.js"),
    fs = wx.getFileSystemManager && wx.getFileSystemManager();
try {
  var dom = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./libs/document.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
} catch (e) {}
// 计算 cache 的 key
function hash(str) {
  for (var i = str.length, val = 5381; i--;) {
    val += (val << 5) + str.charCodeAt(i);
  }return val;
}
Component({
  options: {
    pureDataPattern: /^[acdgtux]|W/
  },
  properties: {
    'html': {
      type: null,
      observer: function observer(html) {
        if (this._refresh) this._refresh = false;else this.setContent(html, false, true);
      }
    },
    'autosetTitle': {
      type: Boolean,
      value: true
    },
    'autopause': {
      type: Boolean,
      value: true
    },
    'compress': Number,
    'domain': String,
    'gestureZoom': Boolean,
    'lazyLoad': Boolean,
    'selectable': Boolean,
    'tagStyle': Object,
    'showWithAnimation': Boolean,
    'useAnchor': Boolean,
    'useCache': Boolean,
    'xml': Boolean
  },
  relations: {
    '../parser-group/parser-group': {
      type: 'ancestor'
    }
  },
  created: function created() {
    // 图片数组
    this.imgList = [];
    this.imgList.setItem = function (i, src) {
      var _this = this;

      if (!i || !src) return;
      // 去重
      if (src.indexOf('http') == 0 && this.includes(src)) {
        var newSrc = '';
        for (var j = 0, c; c = src[j]; j++) {
          if (c == '/' && src[j - 1] != '/' && src[j + 1] != '/') break;
          newSrc += Math.random() > 0.5 ? c.toUpperCase() : c;
        }
        newSrc += src.substr(j);
        return this[i] = newSrc;
      }
      this[i] = src;
      // 暂存 data src
      if (src.includes('data:image')) {
        var info = src.match(/data:image\/(\S+?);(\S+?),(.+)/);
        if (!info) return;
        var filePath = wx.env.USER_DATA_PATH + '/' + Date.now() + '.' + info[1];
        fs && fs.writeFile({
          filePath: filePath,
          data: info[3],
          encoding: info[2],
          success: function success() {
            return _this[i] = filePath;
          }
        });
      }
    };
    this.imgList.each = function (f) {
      for (var i = 0, len = this.length; i < len; i++) {
        this.setItem(i, f(this[i], i, this));
      }
    };
    if (dom) this.document = new dom(this);
  },
  detached: function detached() {
    // 删除暂存
    this.imgList.each(function (src) {
      if (src && src.includes(wx.env.USER_DATA_PATH) && fs) fs.unlink({
        filePath: src
      });
    });
    clearInterval(this._timer);
  },

  methods: {
    // 锚点跳转
    navigateTo: function navigateTo(obj) {
      var _this2 = this;

      if (!this.data.useAnchor) return obj.fail && obj.fail({
        errMsg: 'Anchor is disabled'
      });
      this.createSelectorQuery().select('.top' + (obj.id ? '>>>#' + obj.id : '')).boundingClientRect().selectViewport().scrollOffset().exec(function (res) {
        if (!res[0]) return _this2.group ? _this2.group.navigateTo(_this2.i, obj) : obj.fail && obj.fail({
          errMsg: 'Label not found'
        });
        obj.scrollTop = res[1].scrollTop + res[0].top + (obj.offset || 0);
        wx.pageScrollTo(obj);
      });
    },

    // 获取文本
    getText: function getText() {
      var ns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.data.html;

      var txt = '';
      for (var i = 0, n; n = ns[i++];) {
        if (n.type == 'text') txt += n.text.replace(/&nbsp;/g, '\xA0').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');else if (n.type == 'br') txt += '\n';else {
          // 块级标签前后加换行
          var br = n.name == 'p' || n.name == 'div' || n.name == 'tr' || n.name == 'li' || n.name[0] == 'h' && n.name[1] > '0' && n.name[1] < '7';
          if (br && txt && txt[txt.length - 1] != '\n') txt += '\n';
          if (n.children) txt += this.getText(n.children);
          if (br && txt[txt.length - 1] != '\n') txt += '\n';else if (n.name == 'td' || n.name == 'th') txt += '\t';
        }
      }
      return txt;
    },

    // 获取视频 context
    getVideoContext: function getVideoContext(id) {
      if (!id) return this.videoContexts;
      for (var i = this.videoContexts.length; i--;) {
        if (this.videoContexts[i].id == id) return this.videoContexts[i];
      }
    },

    // 渲染富文本
    setContent: function setContent(html, append, _watch) {
      var _this3 = this;

      var data = {};
      if (!html) {
        if (_watch || append) return;
        data.html = '';
      } else if (typeof html == 'string') {
        var parser = new Parser(html, this.data);
        // 缓存读取
        if (this.data.useCache) {
          var hashVal = hash(html);
          if (cache[hashVal]) data.html = cache[hashVal];else {
            data.html = parser.parse();
            cache[hashVal] = data.html;
          }
        } else data.html = parser.parse();
        this._refresh = true;
        this.triggerEvent('parse', data.html);
      } else if (html.constructor == Array) {
        // 转换不符合格式的 array
        if (html.length && html[0].PoweredBy != 'Parser') {
          var _parser = new Parser('', this.data);
          (function f(ns) {
            for (var i = 0, n; n = ns[i]; i++) {
              if (n.type == 'text') continue;
              n.attrs = n.attrs || {};
              for (var key in n.attrs) {
                if (typeof n.attrs[key] != 'string') n.attrs[key] = n.attrs[key].toString();
              }_parser.matchAttr(n);
              if (n.children) {
                _parser.STACK.push(n);
                f(n.children);
                _parser.popNode(_parser.STACK.pop());
              }
            }
          })(html);
          data.html = html;
        }
        if (!_watch) data.html = html;
      } else if ((typeof html === 'undefined' ? 'undefined' : _typeof(html)) == 'object' && html.nodes) {
        data.html = html.nodes;
        console.warn('错误的 html 类型：object 类型已废弃');
      } else return console.warn('错误的 html 类型：' + (typeof html === 'undefined' ? 'undefined' : _typeof(html)));
      if (append) {
        this._refresh = true;
        data.html = (this.data.html || []).concat(data.html);
      } else if (this.data.showWithAnimation) data.showAm = 'animation: show .5s';
      if (data.html || data.showAm) this.setData(data);
      // 设置标题
      if (this.data.html.length && this.data.html[0].title && this.data.autosetTitle) wx.setNavigationBarTitle({
        title: this.data.html[0].title
      });
      this.imgList.length = 0;
      this.videoContexts = [];
      var ns = this.selectAllComponents('.top,.top>>>._node');
      for (var i = 0, n; n = ns[i++];) {
        n.top = this;
        for (var j = 0, item; item = n.data.nodes[j++];) {
          if (item.c) continue;
          // 获取图片列表
          if (item.name == 'img') this.imgList.setItem(item.attrs.i, item.attrs.src);
          // 音视频控制
          else if (item.name == 'video' || item.name == 'audio') {
              var ctx;
              if (item.name == 'video') ctx = wx.createVideoContext(item.attrs.id, n);else ctx = n.selectComponent('#' + item.attrs.id);
              if (ctx) {
                ctx.id = item.attrs.id;
                this.videoContexts.push(ctx);
              }
            }
        }
      }
      (wx.nextTick || setTimeout)(function () {
        return _this3.triggerEvent('load');
      }, 50);
      var height;
      clearInterval(this._timer);
      this._timer = setInterval(function () {
        _this3.createSelectorQuery().select('.top').boundingClientRect(function (res) {
          _this3.rect = res;
          if (res.height == height) {
            _this3.triggerEvent('ready', res);
            clearInterval(_this3._timer);
          }
          height = res.height;
        }).exec();
      }, 350);
    },

    // 预加载
    preLoad: function preLoad(html, num) {
      if (typeof html == 'string') {
        var id = hash(html);
        html = new Parser(html, this.data).parse();
        cache[id] = html;
      }
      var imgs,
          wait = [];
      (function f(ns) {
        for (var i = 0, n; n = ns[i++];) {
          if (n.name == 'img' && n.attrs.src && !wait.includes(n.attrs.src)) wait.push(n.attrs.src);
          f(n.children || []);
        }
      })(html);
      if (num) wait = wait.slice(0, num);
      this._wait = (this._wait || []).concat(wait);
      if (!this.data.imgs) imgs = this._wait.splice(0, 15);else if (this.data.imgs.length < 15) imgs = this.data.imgs.concat(this._wait.splice(0, 15 - this.data.imgs.length));
      imgs && this.setData({
        imgs: imgs
      });
    },
    _load: function _load(e) {
      if (this._wait.length) this.setData(_defineProperty({}, 'imgs[' + e.target.id + ']', this._wait.shift()));
    },

    // 事件处理
    _tap: function _tap(e) {
      if (this.data.gestureZoom && e.timeStamp - this._lastT < 300) {
        var initY = e.detail.y - e.currentTarget.offsetTop;
        if (this._zoom) {
          this._scaleAm.translateX(0).scale(1).step();
          wx.pageScrollTo({
            scrollTop: (initY + this._initY) / 2 - e.touches[0].clientY,
            duration: 400
          });
        } else {
          var initX = e.detail.x - e.currentTarget.offsetLeft;
          this._initY = initY;
          this._scaleAm = wx.createAnimation({
            transformOrigin: initX + 'px ' + this._initY + 'px 0',
            timingFunction: 'ease-in-out'
          });
          this._scaleAm.scale(2).step();
          this._tMax = initX / 2;
          this._tMin = (initX - this.rect.width) / 2;
          this._tX = 0;
        }
        this._zoom = !this._zoom;
        this.setData({
          scaleAm: this._scaleAm.export()
        });
      }
      this._lastT = e.timeStamp;
    },
    _touchstart: function _touchstart(e) {
      if (e.touches.length == 1) this._initX = this._lastX = e.touches[0].pageX;
    },
    _touchmove: function _touchmove(e) {
      var diff = e.touches[0].pageX - this._lastX;
      if (this._zoom && e.touches.length == 1 && Math.abs(diff) > 20) {
        this._lastX = e.touches[0].pageX;
        if (this._tX <= this._tMin && diff < 0 || this._tX >= this._tMax && diff > 0) return;
        this._tX += diff * Math.abs(this._lastX - this._initX) * 0.05;
        if (this._tX < this._tMin) this._tX = this._tMin;
        if (this._tX > this._tMax) this._tX = this._tMax;
        this._scaleAm.translateX(this._tX).step();
        this.setData({
          scaleAm: this._scaleAm.export()
        });
      }
    }
  }
});
module.exports = function () {};

/***/ }),

/***/ "../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/cml-extract-css-webpack-plugin/dist/loader.js?{\"omit\":1,\"remove\":true}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/vue-style-loader/index.js!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/css-loader/index.js?{\"sourceMap\":false}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/chameleon-css-loader/index.js?{\"platform\":\"miniapp\",\"cmlType\":\"wx\"}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/postcss-loader/lib/index.js?{\"sourceMap\":false,\"config\":{\"path\":\"C:\\\\Users\\\\89705\\\\AppData\\\\Roaming\\\\npm\\\\node_modules\\\\chameleon-tool\\\\configs\\\\postcss\\\\wx\\\\.postcssrc.js\"}}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/less-loader/dist/cjs.js?{\"sourceMap\":false}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/chameleon-css-loader/index.js?{\"media\":true,\"cmlType\":\"wx\"}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/chameleon-loader/src/cml-compile/wxml-selector.js?type=styles!./src/components/m-rich-text/parser/parser.wxml":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "./src/components/m-rich-text/parser/libs/CssHandler.js":
/***/ (function(module, exports, __webpack_require__) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
  解析和匹配 Css 的选择器
  github：https://github.com/jin-yufeng/Parser
  docs：https://jin-yufeng.github.io/Parser
  author：JinYufeng
  update：2020/03/15
*/
var cfg = __webpack_require__("./src/components/m-rich-text/parser/libs/config.js");

var CssHandler = function () {
  function CssHandler(tagStyle) {
    var _this = this;

    _classCallCheck(this, CssHandler);

    this.getStyle = function (data) {
      return _this.styles = new CssParser(data, _this.styles).parse();
    };

    var styles = Object.assign({}, cfg.userAgentStyles);
    for (var item in tagStyle) {
      styles[item] = (styles[item] ? styles[item] + ';' : '') + tagStyle[item];
    }this.styles = styles;
  }

  _createClass(CssHandler, [{
    key: 'match',
    value: function match(name, attrs) {
      var tmp,
          matched = (tmp = this.styles[name]) ? tmp + ';' : '';
      if (attrs.class) {
        var items = attrs.class.split(' ');
        for (var i = 0, item; item = items[i]; i++) {
          if (tmp = this.styles['.' + item]) matched += tmp + ';';
        }
      }
      if (tmp = this.styles['#' + attrs.id]) matched += tmp + ';';
      return matched;
    }
  }]);

  return CssHandler;
}();

module.exports = CssHandler;

var CssParser = function () {
  function CssParser(data, init) {
    var _this2 = this;

    _classCallCheck(this, CssParser);

    this.section = function () {
      return _this2.data.substring(_this2.start, _this2.i);
    };

    this.isLetter = function (c) {
      return c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z';
    };

    this.data = data;
    this.floor = 0;
    this.i = 0;
    this.list = [];
    this.res = init;
    this.state = this.Space;
  }

  _createClass(CssParser, [{
    key: 'parse',
    value: function parse() {
      for (var c; c = this.data[this.i]; this.i++) {
        this.state(c);
      }return this.res;
    }
  }, {
    key: 'Space',

    // 状态机
    value: function Space(c) {
      if (c == '.' || c == '#' || this.isLetter(c)) {
        this.start = this.i;
        this.state = this.Name;
      } else if (c == '/' && this.data[this.i + 1] == '*') this.Comment();else if (!cfg.blankChar[c] && c != ';') this.state = this.Ignore;
    }
  }, {
    key: 'Comment',
    value: function Comment() {
      this.i = this.data.indexOf('*/', this.i) + 1;
      if (!this.i) this.i = this.data.length;
      this.state = this.Space;
    }
  }, {
    key: 'Ignore',
    value: function Ignore(c) {
      if (c == '{') this.floor++;else if (c == '}' && ! --this.floor) this.state = this.Space;
    }
  }, {
    key: 'Name',
    value: function Name(c) {
      if (cfg.blankChar[c]) {
        this.list.push(this.section());
        this.state = this.NameSpace;
      } else if (c == '{') {
        this.list.push(this.section());
        this.Content();
      } else if (c == ',') {
        this.list.push(this.section());
        this.Comma();
      } else if (!this.isLetter(c) && (c < '0' || c > '9') && c != '-' && c != '_') this.state = this.Ignore;
    }
  }, {
    key: 'NameSpace',
    value: function NameSpace(c) {
      if (c == '{') this.Content();else if (c == ',') this.Comma();else if (!cfg.blankChar[c]) this.state = this.Ignore;
    }
  }, {
    key: 'Comma',
    value: function Comma() {
      while (cfg.blankChar[this.data[++this.i]]) {}
      if (this.data[this.i] == '{') this.Content();else {
        this.start = this.i--;
        this.state = this.Name;
      }
    }
  }, {
    key: 'Content',
    value: function Content() {
      this.start = ++this.i;
      if ((this.i = this.data.indexOf('}', this.i)) == -1) this.i = this.data.length;
      var content = this.section();
      for (var i = 0, item; item = this.list[i++];) {
        if (this.res[item]) this.res[item] += ';' + content;else this.res[item] = content;
      }this.list = [];
      this.state = this.Space;
    }
  }]);

  return CssParser;
}();

/***/ }),

/***/ "./src/components/m-rich-text/parser/libs/MpHtmlParser.js":
/***/ (function(module, exports, __webpack_require__) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
  将 html 解析为适用于小程序 rich-text 的 DOM 结构
  github：https://github.com/jin-yufeng/Parser
  docs：https://jin-yufeng.github.io/Parser
  author：JinYufeng
  update：2020/04/26
*/
var cfg = __webpack_require__("./src/components/m-rich-text/parser/libs/config.js"),
    blankChar = cfg.blankChar,
    CssHandler = __webpack_require__("./src/components/m-rich-text/parser/libs/CssHandler.js"),
    screenWidth = wx.getSystemInfoSync().screenWidth;
try {
  var emoji = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./emoji.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
} catch (e) {}

var MpHtmlParser = function () {
  function MpHtmlParser(data) {
    var _this = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, MpHtmlParser);

    this.getName = function (val) {
      return _this.xml ? val : val.toLowerCase();
    };

    this.isClose = function () {
      return _this.data[_this.i] == '>' || _this.data[_this.i] == '/' && _this.data[_this.i + 1] == '>';
    };

    this.section = function () {
      return _this.data.substring(_this.start, _this.i);
    };

    this.parent = function () {
      return _this.STACK[_this.STACK.length - 1];
    };

    this.siblings = function () {
      return _this.STACK.length ? _this.parent().children : _this.DOM;
    };

    this.attrs = {};
    this.compress = options.compress;
    this.CssHandler = new CssHandler(options.tagStyle, screenWidth);
    this.data = data;
    this.domain = options.domain;
    this.DOM = [];
    this.i = this.start = this.audioNum = this.imgNum = this.videoNum = 0;
    this.protocol = this.domain && this.domain.includes('://') ? this.domain.split('://')[0] : 'http';
    this.state = this.Text;
    this.STACK = [];
    this.useAnchor = options.useAnchor;
    this.xml = options.xml;
  }

  _createClass(MpHtmlParser, [{
    key: 'parse',
    value: function parse() {
      if (emoji) this.data = emoji.parseEmoji(this.data);
      for (var c; c = this.data[this.i]; this.i++) {
        this.state(c);
      }if (this.state == this.Text) this.setText();
      while (this.STACK.length) {
        this.popNode(this.STACK.pop());
      }if (this.DOM.length) {
        this.DOM[0].PoweredBy = 'Parser';
        if (this.title) this.DOM[0].title = this.title;
      }
      return this.DOM;
    }
    // 设置属性

  }, {
    key: 'setAttr',
    value: function setAttr() {
      var name = this.getName(this.attrName);
      if (cfg.trustAttrs[name]) {
        var val = this.attrVal;
        if (val) {
          if (name == 'src') this.attrs[name] = this.getUrl(this.decode(val, 'amp'));else if (name == 'href' || name == 'style') this.attrs[name] = this.decode(val, 'amp');else this.attrs[name] = val;
        } else if (cfg.boolAttrs[name]) this.attrs[name] = 'T';
      }
      this.attrVal = '';
      while (blankChar[this.data[this.i]]) {
        this.i++;
      }if (this.isClose()) this.setNode();else {
        this.start = this.i;
        this.state = this.AttrName;
      }
    }
    // 设置文本节点

  }, {
    key: 'setText',
    value: function setText() {
      var back,
          text = this.section();
      if (!text) return;
      text = cfg.onText && cfg.onText(text, function () {
        return back = true;
      }) || text;
      if (back) {
        this.data = this.data.substr(0, this.start) + text + this.data.substr(this.i);
        var j = this.start + text.length;
        for (this.i = this.start; this.i < j; this.i++) {
          this.state(this.data[this.i]);
        }return;
      }
      if (!this.pre) {
        // 合并空白符
        var tmp = [];
        for (var i = text.length, c; c = text[--i];) {
          if (!blankChar[c] || !blankChar[tmp[0]] && (c = ' ')) tmp.unshift(c);
        }text = tmp.join('');
        if (text == ' ') return;
      }
      this.siblings().push({
        type: 'text',
        text: this.decode(text)
      });
    }
    // 设置元素节点

  }, {
    key: 'setNode',
    value: function setNode() {
      var node = {
        name: this.getName(this.tagName),
        attrs: this.attrs
      },
          close = cfg.selfClosingTags[node.name] || this.xml && this.data[this.i] == '/';
      this.attrs = {};
      if (!cfg.ignoreTags[node.name]) {
        this.matchAttr(node);
        if (!close) {
          node.children = [];
          if (node.name == 'pre' && cfg.highlight) {
            this.remove(node);
            this.pre = node.pre = true;
          }
          this.siblings().push(node);
          this.STACK.push(node);
        } else if (!cfg.filter || cfg.filter(node, this) != false) this.siblings().push(node);
      } else {
        if (!close) this.remove(node);else if (node.name == 'source') {
          var parent = this.parent(),
              attrs = node.attrs;
          if (parent && attrs.src) if (parent.name == 'video' || parent.name == 'audio') parent.attrs.source.push(attrs.src);else {
            var i,
                media = attrs.media;
            if (parent.name == 'picture' && !parent.attrs.src && (!media || media.includes('px') && ((i = media.indexOf('min-width')) != -1 && (i = media.indexOf(':', i + 8)) != -1 && screenWidth > parseInt(media.substr(i + 1)) || (i = media.indexOf('max-width')) != -1 && (i = media.indexOf(':', i + 8)) != -1 && screenWidth < parseInt(media.substr(i + 1))))) parent.attrs.src = attrs.src;
          }
        } else if (node.name == 'base' && !this.domain) this.domain = node.attrs.href;
      }
      if (this.data[this.i] == '/') this.i++;
      this.start = this.i + 1;
      this.state = this.Text;
    }
    // 移除标签

  }, {
    key: 'remove',
    value: function remove(node) {
      var name = node.name,
          j = this.i;
      while (1) {
        if ((this.i = this.data.indexOf('</', this.i + 1)) == -1) {
          if (name == 'pre' || name == 'svg') this.i = j;else this.i = this.data.length;
          return;
        }
        this.start = this.i += 2;
        while (!blankChar[this.data[this.i]] && !this.isClose()) {
          this.i++;
        }if (this.getName(this.section()) == name) {
          // 代码块高亮
          if (name == 'pre') {
            this.data = this.data.substr(0, j + 1) + cfg.highlight(this.data.substring(j + 1, this.i - 5), node.attrs) + this.data.substr(this.i - 5);
            return this.i = j;
          } else if (name == 'style') this.CssHandler.getStyle(this.data.substring(j + 1, this.i - 7));else if (name == 'title') this.title = this.data.substring(j + 1, this.i - 7);
          if ((this.i = this.data.indexOf('>', this.i)) == -1) this.i = this.data.length;
          // 处理 svg
          if (name == 'svg') {
            var src = this.data.substring(j, this.i + 1);
            if (!node.attrs.xmlns) src = ' xmlns="http://www.w3.org/2000/svg"' + src;
            var i = j;
            while (this.data[j] != '<') {
              j--;
            }src = this.data.substring(j, i) + src;
            var parent = this.parent();
            if (node.attrs.width == '100%' && parent && (parent.attrs.style || '').includes('inline')) parent.attrs.style = 'width:300px;max-width:100%;' + parent.attrs.style;
            this.siblings().push({
              name: 'img',
              attrs: {
                src: 'data:image/svg+xml;utf8,' + src.replace(/#/g, '%23'),
                ignore: 'T'
              }
            });
          }
          return;
        }
      }
    }
    // 处理属性

  }, {
    key: 'matchAttr',
    value: function matchAttr(node) {
      var attrs = node.attrs,
          style = this.CssHandler.match(node.name, attrs, node) + (attrs.style || ''),
          styleObj = {};
      if (attrs.id) {
        if (this.compress & 1) attrs.id = void 0;else if (this.useAnchor) this.bubble();
      }
      if (this.compress & 2 && attrs.class) attrs.class = void 0;
      switch (node.name) {
        case 'a':
        case 'ad':
          this.bubble();
          break;
        case 'font':
          if (attrs.color) {
            styleObj['color'] = attrs.color;
            attrs.color = void 0;
          }
          if (attrs.face) {
            styleObj['font-family'] = attrs.face;
            attrs.face = void 0;
          }
          if (attrs.size) {
            var size = parseInt(attrs.size);
            if (size < 1) size = 1;else if (size > 7) size = 7;
            var map = ['xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large'];
            styleObj['font-size'] = map[size - 1];
            attrs.size = void 0;
          }
          break;
        case 'video':
        case 'audio':
          if (!attrs.id) attrs.id = node.name + ++this[node.name + 'Num'];else this[node.name + 'Num']++;
          if (node.name == 'video') {
            if (this.videoNum > 3) node.lazyLoad = 1;
            if (attrs.width) {
              styleObj.width = parseFloat(attrs.width) + (attrs.width.includes('%') ? '%' : 'px');
              attrs.width = void 0;
            }
            if (attrs.height) {
              styleObj.height = parseFloat(attrs.height) + (attrs.height.includes('%') ? '%' : 'px');
              attrs.height = void 0;
            }
          }
          attrs.source = [];
          if (attrs.src) attrs.source.push(attrs.src);
          if (!attrs.controls && !attrs.autoplay) console.warn('\u5B58\u5728\u6CA1\u6709 controls \u5C5E\u6027\u7684 ' + node.name + ' \u6807\u7B7E\uFF0C\u53EF\u80FD\u5BFC\u81F4\u65E0\u6CD5\u64AD\u653E', node);
          this.bubble();
          break;
        case 'td':
        case 'th':
          if (attrs.colspan || attrs.rowspan) for (var k = this.STACK.length, item; item = this.STACK[--k];) {
            if (item.name == 'table') {
              item.c = void 0;
              break;
            }
          }}
      if (attrs.align) {
        styleObj['text-align'] = attrs.align;
        attrs.align = void 0;
      }
      // 压缩 style
      var styles = style.split(';');
      style = '';
      for (var i = 0, len = styles.length; i < len; i++) {
        var info = styles[i].split(':');
        if (info.length < 2) continue;
        var _key = info[0].trim().toLowerCase(),
            _value = info.slice(1).join(':').trim();
        if (_value.includes('-webkit') || _value.includes('-moz') || _value.includes('-ms') || _value.includes('-o') || _value.includes('safe')) style += ';' + _key + ':' + _value;else if (!styleObj[_key] || _value.includes('import') || !styleObj[_key].includes('import')) styleObj[_key] = _value;
      }
      if (node.name == 'img' || node.name == 'picture') {
        if (attrs['data-src']) {
          attrs.src = attrs.src || attrs['data-src'];
          attrs['data-src'] = void 0;
        }
        if ((attrs.src || node.name == 'picture') && !attrs.ignore) {
          if (this.bubble()) attrs.i = (this.imgNum++).toString();else attrs.ignore = 'T';
        }
        if (attrs.ignore) styleObj['max-width'] = '100%';
        var width;
        if (styleObj.width) width = styleObj.width;else if (attrs.width) width = attrs.width.includes('%') ? attrs.width : attrs.width + 'px';
        if (width) {
          styleObj.width = width;
          attrs.width = '100%';
          if (parseInt(width) > screenWidth) {
            styleObj.height = '';
            if (attrs.height) attrs.height = void 0;
          }
        }
        if (styleObj.height) {
          attrs.height = styleObj.height;
          styleObj.height = '';
        } else if (attrs.height && !attrs.height.includes('%')) attrs.height += 'px';
      }
      for (var key in styleObj) {
        var value = styleObj[key];
        if (key.includes('flex') || key == 'order' || key == 'self-align') node.c = 1;
        // 填充链接
        if (value.includes('url')) {
          var j = value.indexOf('(');
          if (j++ != -1) {
            while (value[j] == '"' || value[j] == "'" || blankChar[value[j]]) {
              j++;
            }value = value.substr(0, j) + this.getUrl(value.substr(j));
          }
        }
        // 转换 rpx
        else if (value.includes('rpx')) value = value.replace(/[0-9.]+\s*rpx/g, function ($) {
            return parseFloat($) * screenWidth / 750 + 'px';
          });else if (key == 'white-space' && value.includes('pre')) this.pre = node.pre = true;
        style += ';' + key + ':' + value;
      }
      style = style.substr(1);
      if (style) attrs.style = style;
    }
    // 节点出栈处理

  }, {
    key: 'popNode',
    value: function popNode(node) {
      // 空白符处理
      if (node.pre) {
        node.pre = this.pre = void 0;
        for (var i = this.STACK.length; i--;) {
          if (this.STACK[i].pre) this.pre = true;
        }
      }
      if (node.name == 'head' || cfg.filter && cfg.filter(node, this) == false) return this.siblings().pop();
      var attrs = node.attrs;
      // 替换一些标签名
      if (node.name == 'picture') {
        node.name = 'img';
        if (!attrs.src && (node.children[0] || '').name == 'img') attrs.src = node.children[0].attrs.src;
        return node.children = void 0;
      }
      if (cfg.blockTags[node.name]) node.name = 'div';else if (!cfg.trustTags[node.name]) node.name = 'span';
      // 处理列表
      if (node.c && (node.name == 'ul' || node.name == 'ol')) {
        if ((node.attrs.style || '').includes('list-style:none')) {
          for (var _i = 0, child; child = node.children[_i++];) {
            if (child.name == 'li') child.name = 'div';
          }
        } else if (node.name == 'ul') {
          var floor = 1;
          for (var _i2 = this.STACK.length; _i2--;) {
            if (this.STACK[_i2].name == 'ul') floor++;
          }if (floor != 1) for (var _i3 = node.children.length; _i3--;) {
            node.children[_i3].floor = floor;
          }
        } else {
          for (var _i4 = 0, num = 1, _child; _child = node.children[_i4++];) {
            if (_child.name == 'li') {
              _child.type = 'ol';
              _child.num = function (num, type) {
                if (type == 'a') return String.fromCharCode(97 + (num - 1) % 26);
                if (type == 'A') return String.fromCharCode(65 + (num - 1) % 26);
                if (type == 'i' || type == 'I') {
                  num = (num - 1) % 99 + 1;
                  var one = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'],
                      ten = ['X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'],
                      res = (ten[Math.floor(num / 10) - 1] || '') + (one[num % 10 - 1] || '');
                  if (type == 'i') return res.toLowerCase();
                  return res;
                }
                return num;
              }(num++, attrs.type) + '.';
            }
          }
        }
      }
      // 处理表格的边框
      if (node.name == 'table') {
        var padding = attrs.cellpadding,
            spacing = attrs.cellspacing,
            border = attrs.border;
        if (node.c) {
          this.bubble();
          attrs.style = (attrs.style || '') + ';display:table';
          if (!padding) padding = 2;
          if (!spacing) spacing = 2;
        }
        if (border) attrs.style = 'border:' + border + 'px solid gray;' + (attrs.style || '');
        if (spacing) attrs.style = 'border-spacing:' + spacing + 'px;' + (attrs.style || '');
        if (border || padding || node.c) (function f(ns) {
          for (var i = 0, n; n = ns[i]; i++) {
            if (n.type == 'text') continue;
            var style = n.attrs.style || '';
            if (node.c && n.name[0] == 't') {
              n.c = 1;
              style += ';display:table-' + (n.name == 'th' || n.name == 'td' ? 'cell' : n.name == 'tr' ? 'row' : 'row-group');
            }
            if (n.name == 'th' || n.name == 'td') {
              if (border) style = 'border:' + border + 'px solid gray;' + style;
              if (padding) style = 'padding:' + padding + 'px;' + style;
            } else f(n.children || []);
            if (style) n.attrs.style = style;
          }
        })(node.children);
      }
      this.CssHandler.pop && this.CssHandler.pop(node);
      // 自动压缩
      if (node.name == 'div' && !Object.keys(attrs).length) {
        var siblings = this.siblings();
        if (node.children.length == 1 && node.children[0].name == 'div') siblings[siblings.length - 1] = node.children[0];
      }
    }
    // 工具函数

  }, {
    key: 'bubble',
    value: function bubble() {
      for (var i = this.STACK.length, item; item = this.STACK[--i];) {
        if (cfg.richOnlyTags[item.name]) {
          if (item.name == 'table' && !Object.hasOwnProperty.call(item, 'c')) item.c = 1;
          return false;
        }
        item.c = 1;
      }
      return true;
    }
  }, {
    key: 'decode',
    value: function decode(val, amp) {
      var i = -1,
          j,
          en;
      while (1) {
        if ((i = val.indexOf('&', i + 1)) == -1) break;
        if ((j = val.indexOf(';', i + 2)) == -1) break;
        if (val[i + 1] == '#') {
          en = parseInt((val[i + 2] == 'x' ? '0' : '') + val.substring(i + 2, j));
          if (!isNaN(en)) val = val.substr(0, i) + String.fromCharCode(en) + val.substr(j + 1);
        } else {
          en = val.substring(i + 1, j);
          if (cfg.entities[en] || en == amp) val = val.substr(0, i) + (cfg.entities[en] || '&') + val.substr(j + 1);
        }
      }
      return val;
    }
  }, {
    key: 'getUrl',
    value: function getUrl(url) {
      if (url[0] == '/') {
        if (url[1] == '/') url = this.protocol + ':' + url;else if (this.domain) url = this.domain + url;
      } else if (this.domain && url.indexOf('data:') != 0 && !url.includes('://')) url = this.domain + '/' + url;
      return url;
    }
  }, {
    key: 'Text',

    // 状态机
    value: function Text(c) {
      if (c == '<') {
        var next = this.data[this.i + 1],
            isLetter = function isLetter(c) {
          return c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z';
        };
        if (isLetter(next)) {
          this.setText();
          this.start = this.i + 1;
          this.state = this.TagName;
        } else if (next == '/') {
          this.setText();
          if (isLetter(this.data[++this.i + 1])) {
            this.start = this.i + 1;
            this.state = this.EndTag;
          } else this.Comment();
        } else if (next == '!') {
          this.setText();
          this.Comment();
        }
      }
    }
  }, {
    key: 'Comment',
    value: function Comment() {
      var key;
      if (this.data.substring(this.i + 2, this.i + 4) == '--') key = '-->';else if (this.data.substring(this.i + 2, this.i + 9) == '[CDATA[') key = ']]>';else key = '>';
      if ((this.i = this.data.indexOf(key, this.i + 2)) == -1) this.i = this.data.length;else this.i += key.length - 1;
      this.start = this.i + 1;
      this.state = this.Text;
    }
  }, {
    key: 'TagName',
    value: function TagName(c) {
      if (blankChar[c]) {
        this.tagName = this.section();
        while (blankChar[this.data[this.i]]) {
          this.i++;
        }if (this.isClose()) this.setNode();else {
          this.start = this.i;
          this.state = this.AttrName;
        }
      } else if (this.isClose()) {
        this.tagName = this.section();
        this.setNode();
      }
    }
  }, {
    key: 'AttrName',
    value: function AttrName(c) {
      var blank = blankChar[c];
      if (blank) {
        this.attrName = this.section();
        c = this.data[this.i];
      }
      if (c == '=') {
        if (!blank) this.attrName = this.section();
        while (blankChar[this.data[++this.i]]) {}
        this.start = this.i--;
        this.state = this.AttrValue;
      } else if (blank) this.setAttr();else if (this.isClose()) {
        this.attrName = this.section();
        this.setAttr();
      }
    }
  }, {
    key: 'AttrValue',
    value: function AttrValue(c) {
      if (c == '"' || c == "'") {
        this.start++;
        if ((this.i = this.data.indexOf(c, this.i + 1)) == -1) return this.i = this.data.length;
        this.attrVal = this.section();
        this.i++;
      } else {
        for (; !blankChar[this.data[this.i]] && !this.isClose(); this.i++) {}
        this.attrVal = this.section();
      }
      this.setAttr();
    }
  }, {
    key: 'EndTag',
    value: function EndTag(c) {
      if (blankChar[c] || c == '>' || c == '/') {
        var name = this.getName(this.section());
        for (var i = this.STACK.length; i--;) {
          if (this.STACK[i].name == name) break;
        }if (i != -1) {
          var node;
          while ((node = this.STACK.pop()).name != name) {}
          this.popNode(node);
        } else if (name == 'p' || name == 'br') this.siblings().push({
          name: name,
          attrs: {}
        });
        this.i = this.data.indexOf('>', this.i);
        this.start = this.i + 1;
        if (this.i == -1) this.i = this.data.length;else this.state = this.Text;
      }
    }
  }]);

  return MpHtmlParser;
}();

module.exports = MpHtmlParser;

/***/ }),

/***/ "./src/components/m-rich-text/parser/parser.wxml":
/***/ (function(module, exports, __webpack_require__) {

var __cml__style = __webpack_require__("../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/cml-extract-css-webpack-plugin/dist/loader.js?{\"omit\":1,\"remove\":true}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/vue-style-loader/index.js!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/css-loader/index.js?{\"sourceMap\":false}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/chameleon-css-loader/index.js?{\"platform\":\"miniapp\",\"cmlType\":\"wx\"}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/postcss-loader/lib/index.js?{\"sourceMap\":false,\"config\":{\"path\":\"C:\\\\Users\\\\89705\\\\AppData\\\\Roaming\\\\npm\\\\node_modules\\\\chameleon-tool\\\\configs\\\\postcss\\\\wx\\\\.postcssrc.js\"}}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/less-loader/dist/cjs.js?{\"sourceMap\":false}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/chameleon-css-loader/index.js?{\"media\":true,\"cmlType\":\"wx\"}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/chameleon-loader/src/cml-compile/wxml-selector.js?type=styles!./src/components/m-rich-text/parser/parser.wxml");
var __cml__script = __webpack_require__("../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/babel-loader/lib/index.js?{\"filename\":\"C:\\\\Users\\\\89705\\\\AppData\\\\Roaming\\\\npm\\\\node_modules\\\\chameleon-tool\\\\chameleon.js\"}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/chameleon-loader/src/cml-compile/wxml-selector.js?type=script!./src/components/m-rich-text/parser/parser.wxml");

      __CML__GLOBAL.__CMLCOMPONNETS__['components/m-rich-text/parser/parser'] = __cml__script;


/***/ })

},["./src/components/m-rich-text/parser/parser.wxml"])
module.exports = __CML__GLOBAL.__CMLCOMPONNETS__['components/m-rich-text/parser/parser'];