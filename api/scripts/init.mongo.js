/*
 * Run using the mongo shell. For remote databases, ensure that the
 * connection string is supplied in the command line. For example:
 * localhost:
 *   mongo issuetracker scripts/init.mongo.js
 * Atlas:
 *   mongo mongodb+srv://user:pwd@xxx.mongodb.net/issuetracker scripts/init.mongo.js
 * MLab:
 *   mongo mongodb://user:pwd@xxx.mlab.com:33533/issuetracker scripts/init.mongo.js
 */

/* global db print */
/* eslint no-restricted-globals: "off" */

db.products.remove({});
const productsDB = [
    {
        id: 1,
        name: 'Slim Fit Jeans',
        pricePerUnit: 10,
        category: 'Jeans',
        imageUrl: 'https://media.gq-magazine.co.uk/photos/5eb40b3aa7a089b1a9138b86/master/w_1024%2cc_limit/20200507-jeans-14.jpg',
    },
    {
        id: 2,
        name: 'Blue Shirt',
        pricePerUnit: 30,
        category: 'Shirts',
        imageUrl: 'https://media.tractorsupply.com/is/image/TractorSupplyCompany/1497240?$456$',
    },
];

db.products.insertMany(productsDB);
const count = db.products.count();
print('Inserted', count, 'products');

db.counters.remove({ _id: 'products' });
db.counters.insert({ _id: 'products', current: count });

db.issues.createIndex({ id: 1 }, { unique: true });
db.issues.createIndex({ status: 1 });
db.issues.createIndex({ owner: 1 });
db.issues.createIndex({ created: 1 })