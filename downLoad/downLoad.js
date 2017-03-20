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
    promptBox:null
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

  this.__init();
}
DownLoad.prototype = {
  constructor:this,
  __init:function(){
    var _this = this;
    this.getData();
    this.throttle = true;
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
        this.throttle = true;
    }
  },
  __resetRequest:function(){
    this.data.skip = 0;
    this.isRequest = true;
    this.state = null;

    if(this.options.promptBox){
      $(".warning").remove();
      $(".warning2").remove();
    }
  },
  __noData:function(){
    this.isRequest = false;
    // 判断是否加载提示
    if(this.options.promptBox){
      this.__prompt(this.options.promptBox);
    }
  },
  __prompt:function(box){
    if(this.state===0&&$(box).find("warning").length==0){
      $('<style class="warning"></style>').html(".warning {text-align: center;margin: 50px 0 20px}.warning .weui_icon_warn.weui_icon_msg:before {color: #d6d6d6;font-size: 30px;}.warning p {color: #333;font-size: 14px;line-height: 2em}").appendTo(document.body);
      $('<div class="warning"><i class="weui_icon_msg weui_icon_warn"></i><p>未检索到任何信息</p></div>').appendTo($(box));
    }else if(this.state===2&&$(box).find("warning2").length==0){
      $('<p class="warning2">没有更多数据了</p>').css({
        "font-size": "14px",
        "color": "#999",
        "text-align": "center"
      }).appendTo($(box));
    }
  },
  /**
   * 获取数据
   * @return {Object} 返回获取到的数据，除了下拉时会主动执行这个方法外，也可以主动执行这个方法
   */
  getData:function(){
    var pathUrl = JSON.stringify(this.data) + this.url;
    if(pathUrl===this.pathUrl)return;

    var _this = this;
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
