var __CML__GLOBAL = require("../../../../manifest.js");
__CML__GLOBAL.webpackJsonp([28],{

/***/ "../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/babel-loader/lib/index.js?{\"filename\":\"C:\\\\Users\\\\89705\\\\AppData\\\\Roaming\\\\npm\\\\node_modules\\\\chameleon-tool\\\\chameleon.js\"}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/chameleon-loader/src/cml-compile/wxml-selector.js?type=script!./src/components/m-rich-text/parser/trees/trees.wxml":
/***/ (function(module, exports, __webpack_require__) {

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
  trees 递归子组件
  github：https://github.com/jin-yufeng/Parser
  docs：https://jin-yufeng.github.io/Parser
  author：JinYufeng
  update：2020/04/25
*/
Component({
  data: {
    canIUse: !!wx.chooseMessageFile,
    placeholder: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='225'/>",
    inlineTags: __webpack_require__("./src/components/m-rich-text/parser/libs/config.js").inlineTags
  },
  properties: {
    nodes: Array,
    lazyLoad: Boolean
  },
  methods: {
    // 视频播放事件
    play: function play(e) {
      this.top.group && this.top.group.pause(this.top.i);
      if (this.top.videoContexts.length > 1 && this.top.data.autopause) for (var i = this.top.videoContexts.length; i--;) {
        if (this.top.videoContexts[i].id != e.currentTarget.id) this.top.videoContexts[i].pause();
      }
    },

    // 图片事件
    imgtap: function imgtap(e) {
      var attrs = e.currentTarget.dataset.attrs;
      if (!attrs.ignore) {
        var preview = true;
        this.top.triggerEvent('imgtap', {
          id: e.currentTarget.id,
          src: attrs.src,
          ignore: function ignore() {
            return preview = false;
          }
        });
        if (preview) {
          if (this.top.group) return this.top.group.preview(this.top.i, attrs.i);
          var urls = this.top.imgList,
              current = urls[attrs.i] ? urls[attrs.i] : (urls = [attrs.src], attrs.src);
          wx.previewImage({
            current: current,
            urls: urls
          });
        }
      }
    },
    loadImg: function loadImg(e) {
      var i = e.target.dataset.i;
      if (this.data.lazyLoad && !this.data.nodes[i].load) this.setData(_defineProperty({}, 'nodes[' + i + '].load', true));
    },

    // 链接点击事件
    linkpress: function linkpress(e) {
      var jump = true,
          attrs = e.currentTarget.dataset.attrs;
      attrs.ignore = function () {
        return jump = false;
      };
      this.top.triggerEvent('linkpress', attrs);
      if (jump) {
        if (attrs['app-id']) wx.navigateToMiniProgram({
          appId: attrs['app-id'],
          path: attrs.path
        });else if (attrs.href) {
          if (attrs.href[0] == '#') this.top.navigateTo({
            id: attrs.href.substring(1)
          });
          /**
           * =======================================
           */
          else if (attrs.href.indexOf('http') == 0 || attrs.href.indexOf('//') == 0) {
              var array = attrs.href.match(/(\.(\w+)\?)|(\.(\w+)$)/);
              console.log(array[0]);
              if (array[0] != '.jpg' && array[0] != '.png' && array[0] != '.gif') {
                wx.downloadFile({
                  url: attrs.href,
                  success: function success(res) {
                    // console.log(res)
                    //保存到本地
                    wx.saveFile({
                      tempFilePath: res.tempFilePath,
                      success: function success(res) {
                        var savedFilePath = res.savedFilePath;
                        // 打开文件
                        wx.openDocument({
                          filePath: savedFilePath,
                          success: function success(res) {
                            console.log('打开文档成功');
                          }
                        });
                      },
                      fail: function fail(err) {
                        console.log('保存失败：', err);
                      }
                    });
                  }
                });

                // wx.setClipboardData({
                //   data: attrs.href,
                //   success: () =>
                //     wx.showToast({
                //       title: '链接已复制'
                //     })
                // })
              }
            } else wx.navigateTo({
              url: attrs.href
            });
        }
      }
    },

    // 错误事件
    error: function error(e) {
      var _this = this;

      var context,
          source = e.target.dataset.source,
          i = e.target.dataset.i,
          node = this.data.nodes[i];
      if (source == 'video' || source == 'audio') {
        // 加载其他 source
        var index = (node.i || 0) + 1;
        if (index < node.attrs.source.length) return this.setData(_defineProperty({}, 'nodes[' + i + '].i', index));
        if (this.top) context = this.top.getVideoContext(e.target.id);
      } else if (source == 'img') context = {
        setSrc: function setSrc(src) {
          _this.setData(_defineProperty({}, 'nodes[' + i + '].attrs.src', src));
        }
      };
      this.top && this.top.triggerEvent('error', _extends({
        source: source,
        target: e.target,
        context: context
      }, e.detail));
    },

    // 加载视频
    loadVideo: function loadVideo(e) {
      var _setData3;

      var i = e.target.dataset.i;
      this.setData((_setData3 = {}, _defineProperty(_setData3, 'nodes[' + i + '].lazyLoad', false), _defineProperty(_setData3, 'nodes[' + i + '].attrs.autoplay', true), _setData3));
    }
  }
});
module.exports = function () {};

/***/ }),

/***/ "../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/cml-extract-css-webpack-plugin/dist/loader.js?{\"omit\":1,\"remove\":true}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/vue-style-loader/index.js!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/css-loader/index.js?{\"sourceMap\":false}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/chameleon-css-loader/index.js?{\"platform\":\"miniapp\",\"cmlType\":\"wx\"}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/postcss-loader/lib/index.js?{\"sourceMap\":false,\"config\":{\"path\":\"C:\\\\Users\\\\89705\\\\AppData\\\\Roaming\\\\npm\\\\node_modules\\\\chameleon-tool\\\\configs\\\\postcss\\\\wx\\\\.postcssrc.js\"}}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/less-loader/dist/cjs.js?{\"sourceMap\":false}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/chameleon-css-loader/index.js?{\"media\":true,\"cmlType\":\"wx\"}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/chameleon-loader/src/cml-compile/wxml-selector.js?type=styles!./src/components/m-rich-text/parser/trees/trees.wxml":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "./src/components/m-rich-text/parser/trees/trees.wxml":
/***/ (function(module, exports, __webpack_require__) {

var __cml__style = __webpack_require__("../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/cml-extract-css-webpack-plugin/dist/loader.js?{\"omit\":1,\"remove\":true}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/vue-style-loader/index.js!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/css-loader/index.js?{\"sourceMap\":false}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/chameleon-css-loader/index.js?{\"platform\":\"miniapp\",\"cmlType\":\"wx\"}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/postcss-loader/lib/index.js?{\"sourceMap\":false,\"config\":{\"path\":\"C:\\\\Users\\\\89705\\\\AppData\\\\Roaming\\\\npm\\\\node_modules\\\\chameleon-tool\\\\configs\\\\postcss\\\\wx\\\\.postcssrc.js\"}}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/less-loader/dist/cjs.js?{\"sourceMap\":false}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/chameleon-css-loader/index.js?{\"media\":true,\"cmlType\":\"wx\"}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/chameleon-loader/src/cml-compile/wxml-selector.js?type=styles!./src/components/m-rich-text/parser/trees/trees.wxml");
var __cml__script = __webpack_require__("../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/babel-loader/lib/index.js?{\"filename\":\"C:\\\\Users\\\\89705\\\\AppData\\\\Roaming\\\\npm\\\\node_modules\\\\chameleon-tool\\\\chameleon.js\"}!../../AppData/Roaming/npm/node_modules/chameleon-tool/node_modules/chameleon-loader/src/cml-compile/wxml-selector.js?type=script!./src/components/m-rich-text/parser/trees/trees.wxml");

      __CML__GLOBAL.__CMLCOMPONNETS__['components/m-rich-text/parser/trees/trees'] = __cml__script;


/***/ })

},["./src/components/m-rich-text/parser/trees/trees.wxml"])
module.exports = __CML__GLOBAL.__CMLCOMPONNETS__['components/m-rich-text/parser/trees/trees'];