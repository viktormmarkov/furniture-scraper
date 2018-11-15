const _ = require('lodash');
const xray = require('x-ray');
const x = xray();

const providers = [{
    name: 'Videnov',
    url: 'https://videnov.bg/',
    baseUrl: 'https://videnov.bg/products',
    products: [{
        category: 'Kitchen',
        url: 'standartni-kuhni',
        schema: {
            base: '.prod-teaser',
            details: [{
                title: '.prod-teaser-title a',
                image: '.prod-teaser-image img@src',
                price: '.prod-teaser-price',
                url: '.prod-teaser-title a@href',
            }]
        }
    }]
}]

_.each(providers, provider => {
    _.each(provider.products, product => {
        x(`${provider.baseUrl}/${product.url}`, {
            items: x(product.schema.base, product.schema.details)
        })((err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        });
    })
});

// persist data in mongo 
// analyze images -- extract main colorss
// invalidate data in mongo
// persist provider in data and allow it to be modifiable