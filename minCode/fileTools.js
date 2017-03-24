var fs = require("fs");
var Q = require("q");


module.exports = {
  // 判断某段字符串后缀是不是文件
  isStringFile:function(str){
    var index = str.lastIndexOf("\\");
    var index2 = str.lastIndexOf("\/");
    index = index!=-1 ? index : index2!=-1 ? index2 : 0;
    return str.indexOf(".",index)!=-1;
  },
  // 判断是不是文件
  isFile:function(filePath){
    return !fs.lstatSync(filePath).isDirectory();
  },
  // 过滤文件
  fileFilter:function(filePath,filterArray){
    var index = filePath.lastIndexOf("\\");
    var index2 = filePath.lastIndexOf("\/");
    index = index!=-1 ? index : index2!=-1 ? index2 : 0;

    return filterArray.some(item=>{
      return item === filePath.substring(filePath.indexOf(".",index) + 1);
    });
  },
  // 替换文件路径
  replaceFilePath:function(sourcePath,currentPath,targetPath){
    var index = sourcePath.lastIndexOf("\/");
    var index2 = sourcePath.lastIndexOf("\\");
    index = index!=-1 ? index : index2!=-1 ? index2 : 0;

    if(sourcePath == currentPath)return targetPath + sourcePath.substring(index);
    return currentPath.replace(sourcePath,targetPath);
  },
  // 创建文件||目录
  createFile:function(filePath,data){
    var deferred = Q.defer();
    // 判断某个文件或目录是否存在
    if(!fs.existsSync(filePath)){
      // 判断是文件还是目录
      if(this.isStringFile(filePath)){
        fs.writeFile(filePath,data,function(err){
          if(err){
            deferred.reject(err);
          }else{
            deferred.resolve(data);
          }
        });
      }else{
        fs.mkdir(filePath,function(err){
          if(err){
            deferred.reject(err);
          }else{
            deferred.resolve(data);
          }
        });
      }
    }
  },
  // 读文件
  readFile:function(filePath){
    var deferred = Q.defer();
    fs.readFile(filePath,function(err,data){
      if(err){
        deferred.reject(err);
      }else{
        deferred.resolve(data.toString());
      }
    });
    return deferred.promise;
  },
  // 读目录
  readdir:function(dirPath){
    var deferred = Q.defer();
    fs.readdir(dirPath,function(err,data){
      if(err){
        deferred.reject(err);
      }else{
        deferred.resolve(data);
      }
    })
    return deferred.promise;
  }
};
