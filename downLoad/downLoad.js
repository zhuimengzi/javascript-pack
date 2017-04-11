 /**
 * 下拉加载
 * @constructor
 * @param {String} url 要请求的url地址
 * @param {Function} callback 回调函数，返回data数据
 * @param {Object} options 可选参数，默认参数{data:{skip:0},distance:20,promptBox:null}
 * @return {Object} 返回DownLoad对象
 */
function DownLoad(url,callback,options){
  this.options = $.extend({
    data:{skip:0},
    distance:20,
    promptBox:null,
    loading:true
  },options);

  // 节流
  this.throttle = false;
  this.url = url;
  this.callback = callback;
  this.data = this.options.data;
  // 是否请求数据
  this.isRequest = true;
  // 上一次请求的路径
  this.pathUrl = null;
  /**
   * 数据状态
   * @param state {number}
   */
  this.state = null;
  // 加载中
  this.loaded = false;
  // 加载提示
  this.__loading = {
    el:null,
    init:function(){
      this.el = $("<img src='data:image/gif;base64,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'>");
      this.el.css({
        "position": "absolute",
        "top": "50%",
        "left": "50%",
        "z-index":"999",
        "transform": "translate(-50%,-50%)"
      }).appendTo(document.body);
    },
    show:function(){
      this.el.show();
    },
    hide:function(){
      this.el.hide();
    }
  };
  // 数据状态提示
  this.__prompt = {
    no:{
      el:$('<div><i class="iconfont icon-warning"></i><p>未检索到任何信息</p></div>'),
      isInit:false,
      init:function(){
        this.el.css({
          "text-align":"center",
          "margin":"50px 0 20px"
        }).find("i").css({
          "color":"#d6d6d6",
          "font-size":"35px"
        }).end().find("p").css({
          "color":"#333",
          "font-size":"14px",
          "line-height":"2em"
        }).end().appendTo(document.body);
        this.isInit = true;
      },
      show:function(){
        this.el.show();
      },
      hide:function(){
        this.el.hide();
      }
    },
    noMore:{
      el:$('<p>没有更多数据了</p>'),
      isInit:false,
      init:function(){
        this.el.css({
          "margin-top":"10px",
          "font-size": "14px",
          "color": "#999",
          "text-align": "center"
        }).appendTo(document.body);
        this.isInit = true;
      },
      show:function(){
        this.el.show();
      },
      hide:function(){
        this.el.hide();
      }
    }
  };
  this.__init();
}
DownLoad.prototype = {
  constructor:this,
  __init:function(){
    var _this = this;
    //判断是否加载loading
    this.options.loading&&this.__loading.init();

    this.getData();
    $(window).on("scroll resize",function(){
      if(!_this.throttle&&_this.isRequest){
        _this.__isBottom();
      }
    });
  },
  __isBottom:function(){
    var innerHeight = $(document).innerHeight();
    var scrollTop = $(window).scrollTop();
    var screenHeight = $(window).height();

    if(scrollTop != 0 && (screenHeight + scrollTop + this.options.distance >= innerHeight)) {
        this.getData();
    }
  },
  __resetRequest:function(){
    this.data.skip = 0;
    this.isRequest = true;
    this.state = null;

    if(this.options.promptBox){
      this.__prompt.no.isInit&&this.__prompt.no.hide();
      this.__prompt.noMore.isInit&&this.__prompt.noMore.hide();
    }

    this.options.loading&&this.__loading.show();
  },
  __noData:function(){
    this.isRequest = false;
    // 判断是否加载提示
    if(this.options.promptBox){
      var prompt = this.__prompt;
      if(this.state === 0){
        if(!prompt.no.isInit){
          prompt.no.init();
        }else{
          prompt.no.show();
        }
      }
      if(this.state === 2){
        if(!prompt.noMore.isInit){
          prompt.noMore.init();
        }else{
          prompt.noMore.show();
        }
      }
    }
  },
  /**
   * 获取数据
   * @return {Object} 返回获取到的数据，除了下拉时会主动执行这个方法外，也可以主动执行这个方法
   */
  getData:function(){
    this.throttle = true;
    var pathUrl = JSON.stringify(this.data) + this.url;
    if(pathUrl===this.pathUrl) {
      this.throttle = false;
      this.__loading.hide();
      return;
    }

    var _this = this;
    this.loaded = true;
    $.post(_this.url,_this.data,function(result){
      if(!result.data||result.data.length===0){
        if(_this.state===null){
          _this.state = 0;
        }else{
          _this.state = 2;
        }
        _this.__noData();
      }else{
        _this.state = 1;
      }
      _this.callback(result.data);
      _this.throttle = false;
      _this.loaded = false;

      _this.options.loading&&_this.__loading.hide();
    },"json");

    this.pathUrl = pathUrl;
  },
  /**
   * 设置请求地址
   * @param {String} url 当需改变之前的请求地址时，可以使用此方法，注意此方法会重新初始化skip和请求数据
   */
  setUrl:function(url){
    this.url = url;

    this.data = {};
    this.__resetRequest();
  },
  /**
   * 设置请求数据
   * @param {Object} data 改变请求数据，注意此方法会重新初始化skip和请求数据
   */
  setData:function(data){
    this.data = data;

    this.__resetRequest();
  },
  /**
   * 当前要请求第几条
   * @param {Number} skip 设置当前要请求第几条
   */
  setSkip:function(skip){
    this.data.skip = skip;
  },
  /**
   * 正在请求第几条数据
   * @return {Number} 获取当前正在请求第几条数据
   */
  getSkip:function(){
    return this.data.skip;
  },
  /**
   * 回调函数
   * @param {Function} fn 重设回调函数
   */
  setCallback:function(fn){
    this.callback = fn;
  },
  /**
   * 距离底部的位置
   * @param {Number} number 距离底部多远加载数据
   */
  setDistance:function(number){
    this.options.distance = number;
  }
};
