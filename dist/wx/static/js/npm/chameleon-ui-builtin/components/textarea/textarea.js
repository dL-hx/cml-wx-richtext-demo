var __CML__GLOBAL = require("../../../../manifest.js");
__CML__GLOBAL.webpackJsonp([12],{

/***/ "../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/babel-loader/lib/index.js?{\"filename\":\"C:\\\\Users\\\\89705\\\\AppData\\\\Roaming\\\\npm\\\\node_modules\\\\chameleon-tool\\\\chameleon.js\"}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/chameleon-loader/src/selector.js?type=script&index=0&fileType=component&media=dev&cmlType=wx&isInjectBaseStyle=true&check={\"enable\":true,\"enableTypes\":[]}!./node_modules/chameleon-ui-builtin/components/textarea/textarea.wx.cml":
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chameleonRuntime = __webpack_require__("./node_modules/chameleon-runtime/index.js");

var _chameleonRuntime2 = _interopRequireDefault(_chameleonRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
event: cinput cblur cfocus cconfirm
*/
var Textarea = function Textarea() {
  _classCallCheck(this, Textarea);

  this.props = {
    cStyle: {
      type: String,
      default: ''
    },
    cstyle: {
      type: String,
      default: ''
    },
    //textarea的内容
    value: {
      type: String,
      default: ''
    },
    //textarea的placerholder
    placeholder: {
      type: String,
      default: ''
    },
    //是否禁用textarea输入
    disabled: {
      type: Boolean,
      default: false
    },
    //控制textarea是否聚焦
    focus: {
      type: Boolean,
      default: false
    },
    //最大长度
    maxlength: {
      type: Number,
      default: 140
    },
    //右下角返回键类型
    returnKeyType: { //枚举值 done search next go
      type: String,
      default: 'done'
    },
    placerHolderColor: {
      type: String,
      default: '#666'
    },
    rows: {
      type: Number,
      default: 2
    }
  };
  this.data = {};
  this.computed = {
    wxPlaceHolderStyle: function wxPlaceHolderStyle() {
      return 'color: ' + this.placerHolderColor;
    },
    computedStyle: function computedStyle() {
      // props 必须经过计算属性，否则没有经过 cpx 转换
      return this.cStyle || this.cstyle;
    }
  };
  this.watch = {
    focus: function focus(newVal, oldVal) {}
  };
  this.methods = {
    inputEvent: function inputEvent(e) {
      this.$cmlEmit('input', {
        value: e.detail.value || ''
      });
      this.$cmlEmit('inputevent', {
        value: e.detail.value || ''
      });
    },
    blurEvent: function blurEvent(e) {
      this.$cmlEmit('blur', {
        value: e.detail.value || ''
      });
      this.$cmlEmit('blurevent', {
        value: e.detail.value || ''
      });
    },
    focusEvent: function focusEvent(e) {
      this.$cmlEmit('focus', {
        value: e.detail.value || ''
      });
      this.$cmlEmit('focusevent', {
        value: e.detail.value || ''
      });
    },
    confirmEvent: function confirmEvent(e) {
      this.$cmlEmit('confirm', {
        value: e.detail.value || ''
      });
      this.$cmlEmit('confirmevent', {
        value: e.detail.value || ''
      });
    }
  };
};

exports.default = new Textarea();


module.exports = function () {
  _chameleonRuntime2.default.createComponent(exports.default).getOptions();
};

/***/ }),

/***/ "../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/cml-extract-css-webpack-plugin/dist/loader.js?{\"omit\":1,\"remove\":true}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/vue-style-loader/index.js!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/css-loader/index.js?{\"sourceMap\":false}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/chameleon-css-loader/index.js?{\"platform\":\"miniapp\",\"cmlType\":\"wx\"}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/postcss-loader/lib/index.js?{\"sourceMap\":false,\"config\":{\"path\":\"C:\\\\Users\\\\89705\\\\AppData\\\\Roaming\\\\npm\\\\node_modules\\\\chameleon-tool\\\\configs\\\\postcss\\\\wx\\\\.postcssrc.js\"}}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/less-loader/dist/cjs.js?{\"sourceMap\":false}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/chameleon-css-loader/index.js?{\"media\":true,\"cmlType\":\"wx\"}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/chameleon-loader/src/selector.js?type=styles&index=0&fileType=component&media=dev&cmlType=wx&isInjectBaseStyle=true&check={\"enable\":true,\"enableTypes\":[]}!./node_modules/chameleon-ui-builtin/components/textarea/textarea.wx.cml":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "./node_modules/chameleon-ui-builtin/components/textarea/textarea.wx.cml":
/***/ (function(module, exports, __webpack_require__) {

var __cml__style0 = __webpack_require__("../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/cml-extract-css-webpack-plugin/dist/loader.js?{\"omit\":1,\"remove\":true}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/vue-style-loader/index.js!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/css-loader/index.js?{\"sourceMap\":false}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/chameleon-css-loader/index.js?{\"platform\":\"miniapp\",\"cmlType\":\"wx\"}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/postcss-loader/lib/index.js?{\"sourceMap\":false,\"config\":{\"path\":\"C:\\\\Users\\\\89705\\\\AppData\\\\Roaming\\\\npm\\\\node_modules\\\\chameleon-tool\\\\configs\\\\postcss\\\\wx\\\\.postcssrc.js\"}}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/less-loader/dist/cjs.js?{\"sourceMap\":false}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/chameleon-css-loader/index.js?{\"media\":true,\"cmlType\":\"wx\"}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/chameleon-loader/src/selector.js?type=styles&index=0&fileType=component&media=dev&cmlType=wx&isInjectBaseStyle=true&check={\"enable\":true,\"enableTypes\":[]}!./node_modules/chameleon-ui-builtin/components/textarea/textarea.wx.cml");
var __cml__script = __webpack_require__("../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/babel-loader/lib/index.js?{\"filename\":\"C:\\\\Users\\\\89705\\\\AppData\\\\Roaming\\\\npm\\\\node_modules\\\\chameleon-tool\\\\chameleon.js\"}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/chameleon-loader/src/selector.js?type=script&index=0&fileType=component&media=dev&cmlType=wx&isInjectBaseStyle=true&check={\"enable\":true,\"enableTypes\":[]}!./node_modules/chameleon-ui-builtin/components/textarea/textarea.wx.cml");

      __CML__GLOBAL.__CMLCOMPONNETS__['npm/chameleon-ui-builtin/components/textarea/textarea'] = __cml__script;


/***/ })

},["./node_modules/chameleon-ui-builtin/components/textarea/textarea.wx.cml"])
module.exports = __CML__GLOBAL.__CMLCOMPONNETS__['npm/chameleon-ui-builtin/components/textarea/textarea'];