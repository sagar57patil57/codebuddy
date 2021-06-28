const faker = require('faker');

let dummyData = [];
for (let i = 0; i < 3; i++) {
    dummyData.push({ 
        title: faker.lorem.word(),
        content: faker.lorem.words()
    });
}

exports.tests = dummyData;