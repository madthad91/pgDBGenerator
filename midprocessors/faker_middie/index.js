const faker = require('faker');
const fs = require('fs');

for(let i = 0; i<500; i++){

const myapp_test_messages_pk = faker.random.number();
fs.appendFileSync('./data.sql', `INSERT INTO myapp_test.messages(id, user_id) VALUES (${myapp_test_messages_pk}, null);\n`, {flag: 'a+'});
const myapp_test_users_pk = faker.random.number();
fs.appendFileSync('./data.sql', `INSERT INTO myapp_test.users(id, c2) VALUES (${myapp_test_users_pk}, ${faker.random.number()});\n`, {flag: 'a+'});
const myapp_test_users_pk = faker.random.number();
fs.appendFileSync('./data.sql', `INSERT INTO myapp_test.users(id, c2) VALUES (${myapp_test_users_pk}, ${faker.random.number()});\n`, {flag: 'a+'});
const myapp_test_messages_pk = faker.random.number();
fs.appendFileSync('./data.sql', `INSERT INTO myapp_test.messages(id, user_id) VALUES (${myapp_test_messages_pk}, null);\n`, {flag: 'a+'});
fs.appendFileSync('./data.sql', `UPDATE myapp_test.messages SET user_id = ${myapp_test_users_pk} WHERE id = ${myapp_test_messages_pk};\n`, {flag: 'a+'});
fs.appendFileSync('./data.sql', `UPDATE myapp_test.messages SET user_id = ${myapp_test_users_pk} WHERE id = ${myapp_test_messages_pk};\n`, {flag: 'a+'});
}
const myapp_test_messages_pk = faker.random.number();
fs.appendFileSync('./data.sql', `INSERT INTO myapp_test.messages(id, user_id) VALUES (${myapp_test_messages_pk}, null);\n`, {flag: 'a+'});
const myapp_test_users_pk = faker.random.number();
fs.appendFileSync('./data.sql', `INSERT INTO myapp_test.users(id, c2) VALUES (${myapp_test_users_pk}, ${faker.random.number()});\n`, {flag: 'a+'});
const myapp_test_messages_pk = faker.random.number();
fs.appendFileSync('./data.sql', `INSERT INTO myapp_test.messages(id, user_id) VALUES (${myapp_test_messages_pk}, null);\n`, {flag: 'a+'});
const myapp_test_users_pk = faker.random.number();
fs.appendFileSync('./data.sql', `INSERT INTO myapp_test.users(id, c2) VALUES (${myapp_test_users_pk}, ${faker.random.number()});\n`, {flag: 'a+'});
fs.appendFileSync('./data.sql', `UPDATE myapp_test.messages SET user_id = ${myapp_test_users_pk} WHERE id = ${myapp_test_messages_pk};\n`, {flag: 'a+'});
fs.appendFileSync('./data.sql', `UPDATE myapp_test.messages SET user_id = ${myapp_test_users_pk} WHERE id = ${myapp_test_messages_pk};\n`, {flag: 'a+'});
}
const myapp_test_messages_pk = faker.random.number();
fs.appendFileSync('./data.sql', `INSERT INTO myapp_test.messages(id, user_id) VALUES (${myapp_test_messages_pk}, null);\n`, {flag: 'a+'});
const myapp_test_users_pk = faker.random.number();
fs.appendFileSync('./data.sql', `INSERT INTO myapp_test.users(id, c2) VALUES (${myapp_test_users_pk}, ${faker.random.number()});\n`, {flag: 'a+'});
const myapp_test_messages_pk = faker.random.number();
fs.appendFileSync('./data.sql', `INSERT INTO myapp_test.messages(id, user_id) VALUES (${myapp_test_messages_pk}, null);\n`, {flag: 'a+'});
const myapp_test_users_pk = faker.random.number();
fs.appendFileSync('./data.sql', `INSERT INTO myapp_test.users(id, c2) VALUES (${myapp_test_users_pk}, ${faker.random.number()});\n`, {flag: 'a+'});
fs.appendFileSync('./data.sql', `UPDATE myapp_test.messages SET user_id = ${myapp_test_users_pk} WHERE id = ${myapp_test_messages_pk};\n`, {flag: 'a+'});
fs.appendFileSync('./data.sql', `UPDATE myapp_test.messages SET user_id = ${myapp_test_users_pk} WHERE id = ${myapp_test_messages_pk};\n`, {flag: 'a+'});
}
const myapp_test_users_pk = faker.random.number();
fs.appendFileSync('./data.sql', `INSERT INTO myapp_test.users(id, c2) VALUES (${myapp_test_users_pk}, ${faker.random.number()});\n`, {flag: 'a+'});
const myapp_test_messages_pk = faker.random.number();
fs.appendFileSync('./data.sql', `INSERT INTO myapp_test.messages(id, user_id) VALUES (${myapp_test_messages_pk}, null);\n`, {flag: 'a+'});
const myapp_test_messages_pk = faker.random.number();
fs.appendFileSync('./data.sql', `INSERT INTO myapp_test.messages(id, user_id) VALUES (${myapp_test_messages_pk}, null);\n`, {flag: 'a+'});
const myapp_test_users_pk = faker.random.number();
fs.appendFileSync('./data.sql', `INSERT INTO myapp_test.users(id, c2) VALUES (${myapp_test_users_pk}, ${faker.random.number()});\n`, {flag: 'a+'});
fs.appendFileSync('./data.sql', `UPDATE myapp_test.messages SET user_id = ${myapp_test_users_pk} WHERE id = ${myapp_test_messages_pk};\n`, {flag: 'a+'});
fs.appendFileSync('./data.sql', `UPDATE myapp_test.messages SET user_id = ${myapp_test_users_pk} WHERE id = ${myapp_test_messages_pk};\n`, {flag: 'a+'});
}
