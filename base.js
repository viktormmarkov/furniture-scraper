const _ = require('lodash');
const xray = require('x-ray');
const x = xray();
const fs = require('fs');
const request = require('request');

const providers = [
    //     {
    //     name: 'Videnov',
    //     url: 'https://videnov.bg/',
    //     baseUrl: 'https://videnov.bg/products',
    //     products: [{
    //         category: 'Kitchen',
    //         url: 'standartni-kuhni',
    //         schema: {
    //             base: '.prod-teaser',
    //             details: [{
    //                 title: '.prod-teaser-title a',
    //                 image: '.prod-teaser-image img@src',
    //                 price: '.prod-teaser-price',
    //                 url: '.prod-teaser-title a@href',
    //             }]
    //         }
    //     }],
    //     nextPageSelector: ''
    // },
    {
        name: 'Mondo',
        url: 'https://mondomebeli.com/',
        baseUrl: 'https://mondomebeli.com/kuhni/',
        products: [{
            category: 'Kitchen',
            url: 'kuhnenski-komplekti',
            schema: {
                base: '.item.normal',
                details: [{
                    title: '.image-wrapper img@alt',
                    image: '.image-wrapper img@src',
                    price: '.price-wrapper .price span[itemprop="price"]',
                    url: '.image.img-redirect@data-url',
                }]
            }
        }],
        nextPageSelector: '.pagination li:last-child a@href',
        largeImageUrl: (smallImageUrl) => {
            return _.replace(smallImageUrl, '301', '1200');
        }
    }
];

function download(product, provider) {
    const {
        image: uri,
        title: filename
    } = product || {};
    const largeImageUrl = provider.largeImageUrl(uri);
    request.head(largeImageUrl, function (err, res, body) {
        request(largeImageUrl).pipe(fs.createWriteStream(`imgs/${filename}.jpg`));
    });
}

_.each(providers, provider => {
    _.each(provider.products, product => {
        x(`${provider.baseUrl}/${product.url}`, {
                items: x(product.schema.base, product.schema.details)
            })
            .paginate(provider.nextPageSelector)
            .limit(1)
            ((err, [products]) => {
                if (err) {
                } else {
                    _.map(products.items, p => download(p, provider));
                }
            });
    })
});

// persist data in mongo 
// analyze images -- extract main colorss
// invalidate data in mongo
// persist provider in data and allow it to be modifiable