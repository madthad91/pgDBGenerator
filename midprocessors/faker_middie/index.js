const faker = require('faker');
const fs = require('fs');

for(let i = 0; i<500; i++){

const s1_t1_pk = faker.getNumber();
fs.appendFileSync(`insert into s1.t1(c1, c2) values (${s1_t1_pk}, <%t1~_~c2~_~s2_t2_pk~_~c1~_~s1_t1_pk%>);`);
