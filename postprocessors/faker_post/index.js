const fs = require('fs');
const child = require('child_process');

var fileData = fs.readFileSync('../../midprocessors/faker_middie/index.js', {encoding: 'utf-8'}).toString();
var regexp = /<%.*%>/g;
var matches_array = fileData.match(regexp);
matches_array.forEach(val=>{
  val = val.replace('<%', '');
  val = val.replace('%>', '');
  let tempArr = val.split('~_~');
  //TODO: add srcSchema and targetSchema(if needed)
  let srcSchemaAndTable = tempArr[0];
  let srcCol = tempArr[1];
  let targetPkVar = tempArr[2];
  let srcPkColName = tempArr[3];
  let srcPkColVar = tempArr[4];
  const resultText = `fs.appendFileSync('./data.sql', \`UPDATE ${srcSchemaAndTable} SET ${srcCol} = \${${targetPkVar}} WHERE ${srcPkColName} = \${${srcPkColVar}};\\n\`, {flag: 'a+'});\n`;
  fs.appendFileSync('../../midprocessors/faker_middie/index.js', resultText, {flag: 'a+'});

})
fs.appendFileSync('../../midprocessors/faker_middie/index.js', '}', {flag: 'a+'});