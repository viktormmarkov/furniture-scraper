const _ = require('lodash');
const xray = require('x-ray');
const x = xray();
// const fs = require('fs');
const request = require('request');
const matcher = require('./matcher');

const apiBase = 'http://localhost:3031';
const promotionsApi = `${apiBase}/promotions`;

const shops = [
    {
        name: 'Kaulfand',
        url: 'https://www.kaufland.bg/',
        baseUrl: 'https://www.kaufland.bg/aktualni-predlozheniya',
        schema: {
            base: '.m-offer-tile__link',
            details: [{
                name: '.m-offer-tile__container .m-offer-tile__text .m-offer-tile__title',
                price: '.m-offer-tile__split .a-pricetag__price',
                subtitle: '.m-offer-tile__container .m-offer-tile__text .m-offer-tile__subtitle',
                oldPrice: '.m-offer-tile__split .a-pricetag__old-price'
            }]
        },
        categories: [
        // {
        //     name: 'Meat&Fish',
        //     url: 'ot-ponedelnik.category=01_%D0%9C%D0%B5%D1%81%D0%BE__%D0%BF%D1%82%D0%B8%D1%87%D0%B5_%D0%BC%D0%B5%D1%81%D0%BE__%D0%BA%D0%BE%D0%BB%D0%B1%D0%B0%D1%81%D0%B8.html',
        // }, {
        {
            name: 'Fish',
            url: 'ot-ponedelnik.category=01a_%D0%9F%D1%80%D1%8F%D1%81%D0%BD%D0%B0_%D1%80%D0%B8%D0%B1%D0%B0.html'
        }],
        nextPageSelector: ''
    },
]

_.each(shops, provider => {
    _.each(provider.categories, async category => {
        x(`${provider.baseUrl}/${category.url}`, {
            items: x(provider.schema.base, provider.schema.details)
        })
        ((err, res) => {
            if (err) {
            } else {
                console.log(category.name)
                const items = res.items.map(i => ({...i, category: category.name}));
                const parsed = matcher.parseData(items);
                // request.post(promotionsApi, {
                //     json: parsed
                // }).on('response', function(response) {
                //     console.log(response.statusCode) // 200
                // })
                // console.log(parsed);
            }
        });
    })
});
