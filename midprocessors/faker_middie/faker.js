const faker = require('faker');
const fs = require('fs');
const validator = require('./validator.js');

var schemaName = process.env.schemaName || 's1';
var tableName = process.env.tableName || 't1';

var tableData = {
  c1: {
    dataType: 'p',
    description: 'some text'
  },
  c2: {
    dataType: 'i',
    description: 'some text',
    foreignKeyTo: 's2.t2.d1'
  }
}

// TODO: check for columns at all
// end TODO
var resultText = `fs.appendFileSync(\`insert into ${schemaName}.${tableName}(<%token_key%>) values (<%token_value%>)`;
let primaryKeyKey =null;
let primaryKeyValue = null;

//finding primary key - important for update set in postprocessor
Object.keys(tableData).find(column=>{
  if(tableData[column]['dataType'] =='p' && tableData[column]['dataType'].toLowerCase().includes('primary')){
    primaryKeyKey = column;
    // primaryKeyValue = ;
    return true;
  }
});
Object.keys(tableData).forEach(column=>{
  var dataType = validator.validateMyStuff(tableData[column]['dataType']);
  if(!dataType) return;

  if(dataType.toLowerCase().includes('primary')){
    if(dataType.toLowerCase().includes('int')){
      resultText = `const ${schemaName}_${tableName}_pk = `+'faker.getNumber();\n' + resultText;

      //handle int types
      resultText = resultText.replace(/<%token_key%>/, `${column}, <%token_key%>`);
      resultText = resultText.replace(/<%token_value%>/, `\${${schemaName}_${tableName}_pk}, <%token_value%>`);
    }
    else if(dataType.toLowerCase().includes('uuid')){
      //not supported yet
    }
  }
  else if(tableData[column].hasOwnProperty('foreignKeyTo')){
    let fkData = tableData[column]['foreignKeyTo'].split('.');
    //handle int types
    resultText = resultText.replace(/<%token_key%>/, `${column}, <%token_key%>`);
    resultText = resultText.replace(/<%token_value%>/, `<%${tableName}~_~${column}~_~${fkData[0]+'_'+fkData[1]+'_pk'}~_~${primaryKeyKey}~_~${schemaName+'_'+tableName+'_pk'}%>, <%token_value%>`);
  }
  else if(dataType.toLowerCase().startsWith('int')){
    //handle int types
    resultText = resultText.replace(/<%token_key%>/, `${column}, <%token_key%>`);
    resultText = resultText.replace(/<%token_value%>/, '${faker.getNumber()}, <%token_value%>');
  }
  else if(dataType.toLowerCase().startsWith('varc')){
    //handle varchar types
    resultText = resultText.replace(/<%token_key%>/, `${column}, <%token_key%>`);
    resultText = resultText.replace(/<%token_value%>/, '${faker.lorem.words(5)}, <%token_value%>');
  }
  else if(dataType.toLowerCase().startsWith('text')){
    //handle text types
    resultText = resultText.replace(/<%token_key%>/, `${column}, <%token_key%>`);
    resultText = resultText.replace(/<%token_value%>/, "${faker.lorem.paragraphs(2).replace(/\n/g, '')}, <%token_value%>");
  }
  else if(dataType.toLowerCase().startsWith('timestamp')){
    //handle timestamp types
    resultText = resultText.replace(/<%token_key%>/, `${column}, <%token_key%>`);
    resultText = resultText.replace(/<%token_value%>/, '${faker.date.recent()}, <%token_value%>');
  }
});
resultText = resultText.replace(', <%token_key%>', '');
resultText = resultText.replace(', <%token_value%>', '');
resultText += ";\`);\n"
fs.appendFileSync('index.js', resultText, {flag: 'a+'});