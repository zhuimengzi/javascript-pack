var fs = require("fs");
var fileApi = require("./fileTools");
var rule = require("./compressRule");

const PATH = process.argv[2];
const OUT_PATH = process.argv[3] || __dirname + "\\output";
const FILTER_FILE_ARRAY = ["html","js"];


// rule.filter(config.close);
// rule.add(config.rule);

// 编译文件
function compressFile(filePath){
  fileApi.readFile(filePath).then(function(data){
    // 遍历规则
    for(var item of rule.rule){
      data = data.replace(item.rule,item.fn);
    }
    return data;
  }).then(function(data){
    // 输出文件
    var P = null;
    filePath = fileApi.replaceFilePath(PATH,filePath,OUT_PATH);
    filePath.split("\\").forEach((item,index)=>{
      if(index===0){
        P = item;
        return;
      }
      P += "\\" + item;
      fileApi.createFile(P,data);
    });
  });
}
// 编译目录
function compressDir(dirPath){
  fileApi.readdir(dirPath).then(function(data){
    data.forEach(item=>{
      outFile(dirPath + "\\" + item);
    });
  },console.error);
}
// 判断是目录还是输出文件
function outFile(path){
  if(fileApi.isFile(path)){
    if(fileApi.fileFilter(path,FILTER_FILE_ARRAY)){
      compressFile(path);
    }
  }else{
    compressDir(path);
  }
}

outFile(PATH);
