### Midprocessors:

Purpose: To intercept postgres data at the table creation point in time. This will help you write custom plugins using only table data. Only separate file is supported at the moment. Placement of midprocessor code back into the result file will be supported in either a before or after create table implementation.

1) make a node program that can set itself up and run using only: npm install and npm start (see bottom for why npm run build is not supported )

2) put the whole program into the midprocessors folder