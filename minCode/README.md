#### 简介

HTML,JS代码压缩工具。

- 去注释
- 去空格
- 去console

#### 扩展

- 新增规则

```
rule.add([
  {
    rule:正则,
    fn:function(){
      return 替换的内容
    }
  },
  ...
])
```

- 取消某个规则

```
rule.filter([
  // 规则name
  "console",
  ...
]);
```

#### 使用

node init.js 需压缩的文件名路径或文件夹 输出路径，不填默认当前文件路径
