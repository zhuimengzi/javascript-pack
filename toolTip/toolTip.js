;(function(window,document){
  function ToolTip(){
    if(ToolTip.instance)return ToolTip.instance;
    this.fixedDom = this.boxDom = this.content = this.callback = null;
    this.prompt = {
      content:"",
      ok:"确定",
      close:"取消"
    };
    ToolTip.instance = this;
  }
  ToolTip.prototype = {
    constructor:ToolTip,
    __init:function(){
      this.__initDom();
    },
    __initDom:function(){
      this.boxDom = $("<div id='tip-alert'></div>");
      this.content = $("<h2></h2>");
      this.boxDom.append(this.content);
      $(document.body).append(this.boxDom);
      this.__initStyle();
      this.__openFixedDom();
    },
    __initStyle:function(){
      this.boxDom.css({
        "position": "fixed",
        "left": "0",
        "right": "0",
        "top": "40%",
        "width": "80%",
        "margin": "auto",
        "border-radius": "6px",
        "box-shadow":" 0 0 10px #474f51, 0 0 10px 500px rgba(0,0,0,.3)",
        "background-color": "#fff",
        "z-index":"99999"
      });

      this.content.css({
        "text-align": "center",
        "line-height": "1.5",
        "font-size": "15px",
        "color": "#131313",
        "border-bottom": "1px solid #d0d0d0",
        "padding": "12px",
        "margin": "0"
      });
    },
    __openFixedDom:function(){
      this.fixedDom = $("<div></div>").css({
        "position":"fixed",
        "top":0,
        "left":0,
        "width":"100%",
        "height":"100%",
        "z-index":5
      });
      this.boxDom.before(this.fixedDom);
    },
    __closeFixedDom:function(){
      this.fixedDom.hide();
    },
    open:function(){
      this.boxDom.show();
    },
    close:function(){
      this.boxDom.hide();
      this.__closeFixedDom();
    },
    alert:function(content,callback,ok){
      var _this = this,
          div = $("<div><a href='javascript:;'></a></div>");
      this.__init();
      div.children().css({
        "display": "block",
        "width": "100%",
        "text-align": "center",
        "font-size": "15px",
        "color": "#007aff",
        "text-decoration": "none",
        "padding": "10px 0"
      });
      this.alert = function(content,callback,ok){
        div.find("a").html(ok || _this.prompt.ok);
        _this.content.html(content || _this.prompt.content);
        div.one("click",function(){
          _this.close();
          callback&&callback(true,event.target);
        });
        _this.open();
      };
      this.alert.apply(this,arguments);
      this.boxDom.append(div);
    },
    confirm:function(content,callback,options){
      var _this = this,
          div = $("<div><a href='javascript:;'></a><a href='javascript:;'></a></div>");
      this.__init();
      div.children().css({
        "float": "left",
        "width": "50%",
        "text-align": "center",
        "font-size": "15px",
        "color": "#007aff",
        "text-decoration": "none",
        "padding": "10px 0"
      });
      div.children().eq(1).css({
        "border-left": "1px solid #d0d0d0",
        "box-sizing": "border-box"
      });
      this.confirm = function(content,callback,options){
        options = options || {};
        div.children().eq(0).html(options.close || _this.prompt.close).end().eq(1).html(options.ok || _this.prompt.ok);
        _this.content.html(content || _this.prompt.content);
        div.one("click",function(event){
          _this.close();
          callback&&callback($(event.target).index()===1,event.target);
        });
        _this.open();
      };
      this.confirm.apply(this,arguments);
      this.boxDom.append(div);
    }
  };
  window.ToolTip = ToolTip;
})(window,document);
