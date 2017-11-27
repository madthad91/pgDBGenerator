const fs = require('fs');

var fileData = fs.readFileSync('./index.js', {encoding: 'utf-8'}).toString();
var regexp = /<%.*%>/g;
var matches_array = fileData.match(regexp);
matches_array.forEach(val=>{
  val = val.replace('<%', '');
  val = val.replace('%>', '');
  let tempArr = val.split('~_~');
  //TODO: add srcSchema and targetSchema(if needed)
  let srcTable = tempArr[0];
  let srcCol = tempArr[1];
  let targetPkVar = tempArr[2];
  let srcPkColName = tempArr[3];
  let srcPkColVar = tempArr[4];
  console.log(srcTable, srcCol, targetPkVar, srcPkColName, srcPkColVar);

})
// console.log(matches_array);
