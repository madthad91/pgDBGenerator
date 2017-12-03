const faker = require('faker');
const fs = require('fs');
const validator = require('./validator.js');

var schemaName = process.env.schemaName || 's1';
var tableName = process.env.tableName || 't1';

var tableData = JSON.parse(process.env.tableData) || {
  c1: {
    dataType: 'p',
    description: 'some text'
  },
  c2: {
    dataType: 'i',
    description: 'some text',
    foreignKeyTo: 's2.t2.d1'
  }
};

// TODO: check for columns at all
// end TODO
var resultText = `fs.appendFileSync('./data.sql', \`INSERT INTO ${schemaName}.${tableName}(<%token_key%>) VALUES (<%token_value%>);\\n\``;
let primaryKeyKey =null;
let primaryKeyValue = null;

//finding primary key - important for update set in postprocessor
Object.keys(tableData).find(column=>{
  if(tableData[column]['dataType'] =='p' || tableData[column]['dataType'].toLowerCase().includes('primary')){
    primaryKeyKey = column;
    return true;
  }
});
Object.keys(tableData).forEach(column=>{
  var dataType = validator.validateMyStuff(tableData[column]['dataType']);
  if(!dataType) return;

  //write insert statement for primary key column
  if(dataType.toLowerCase().includes('primary')){
    if(dataType.toLowerCase().includes('int')){
      resultText = `const ${schemaName}_${tableName}_pk = `+'faker.random.number();\n' + resultText;

      //handle int types
      resultText = resultText.replace(/<%token_key%>/, `${column}, <%token_key%>`);
      resultText = resultText.replace(/<%token_value%>/, `\${${schemaName}_${tableName}_pk}, <%token_value%>`);
    }
    else if(dataType.toLowerCase().includes('uuid')){
      //not supported yet
    }
  }
  //if it's foreign key relation, set a token that will be used in the faker postprocessor to generate update statements
  //via token replacement
  else if(tableData[column].hasOwnProperty('foreignKeyTo')){
    let fkData = tableData[column]['foreignKeyTo'].split('.');
    //handle int types
    resultText = resultText.replace(/<%token_key%>/, `${column}, <%token_key%>`);
    resultText = resultText.replace(/<%token_value%>/, `<%${schemaName}.${tableName}~_~${column}~_~${fkData[0]+'_'+fkData[1]+'_pk'}~_~${primaryKeyKey}~_~${schemaName+'_'+tableName+'_pk'}%>, <%token_value%>`);
  }
  else if(dataType.toLowerCase().startsWith('int')){
    //handle int types
    resultText = resultText.replace(/<%token_key%>/, `${column}, <%token_key%>`);
    resultText = resultText.replace(/<%token_value%>/, '${faker.random.number()}, <%token_value%>');
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
resultText += ", {flag: 'a+'});\n"
fs.appendFileSync('index.js', resultText, {flag: 'a+'});