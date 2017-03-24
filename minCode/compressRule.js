module.exports = {
  // 过滤规则
  filter:function(filterRules){
    filterRules.forEach(item=>{
      this.rule = this.rule.filter(rule=>{
        return !rule.name || rule.name!== item;
      });
    });
  },
  // 添加规则
  add:function(ruleArray){
    this.rule = this.rule.concat(ruleArray);
  },
  rule:[
    // 去JS注释
    {
      name:"jsnote",
      rule:/(\/\*[\s\S]*?\*\/|\/\/.*)/g,
      fn:function(){
        return " ";
      }
    },
    // 去除HTML中的空格
    {
      rule:/\>\s+\</g,
      fn:function(){
        return "><";
      }
    },
    // 去JS console
    {
      name:"console",
      rule:/console\.\w*\(.*\);?/ig,
      fn:function(){
        return "";
      }
    },
    // 多个空格合并成一个空格，去换行回车符
    {
      rule:/[\n\r\s]+/g,
      fn:function(){
        return " ";
      }
    },
    // 去除；后面的所有空格
    {
      rule:/;\s+/g,
      fn:function(){
        return ";";
      }
    },
    // 去除赋值语句和判断中的所有空格
    {
      rule:/\s*(=|==|===|>|>=|<|<=|!=|!==|\/|\%|\?|\:|\&|\&\&|\+|\-|\+\=|\-\=|\,|\||\|\|)\s*/g,
      fn:function($1,$2){
        return $2;
      }
    },
    // 去除阔号中无用空格
    {
      rule:/\s*(\{)\s*([\s\S]*?)\s*(\})\s*/g,
      fn:function($1,$2,$3,$4){
        return $2 + $3 + $4;
      }
    },
    // 去除标签前后空格
    {
      rule:/(<\w+>)\s+([\s\S]*?)\s*(<\/\w+>)/g,
      fn:function($1,$2,$3,$4){
        return $2 + $3 + $4;
      }
    },
    // 将定于语句后的空格换成顿号
    {
      rule:/\s+(function|var|const|let)/g,
      fn:function($1,$2){
        return ";" + $2;
      }
    },
    // 将小括号后面的空格改成顿号防止JS报错
    {
      rule:/(\))\s+/g,
      fn:function($1,$2){
        return $2 + ";";
      }
    },
    // 去除小括号前后空格
    {
      rule:/\s*(\()\s*([\s\S]*?)\s*(\))\s*/g,
      fn:function($1,$2,$3,$4){
        return $2 + $3 + $4;
      }
    }
  ]
};