const _ = require('lodash');
const xray = require('x-ray');
const x = xray();

const request = require('request');
const matcher = require('./matcher');

const apiBase = 'http://localhost:3031';
const promotionsApi = `${apiBase}/promotions`;

const shops = require('./dataProviders/stores'
);
function populateData(promotions) {
    request.post(promotionsApi, {
        json: promotions
    }).on('response', function(response) {
        console.log(response.statusCode) // 200
    })
}

_.each(shops, async provider => {
    const result = await x(provider.dates.url, provider.dates.selector)
    const [startDate, endDate] = result.match(/(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g);
    const promises = _.map(provider.categories, async category => {
        return x(`${provider.baseUrl}/${category.url}`, {
            items: x(provider.schema.base, provider.schema.details),
        })
        .then(res => {
            const items = res.items.map(i => ({...i, category: category.name}));
            const parsed = matcher.parseData(items);
          
            return parsed;
        });
    });
    console.log(startDate, endDate);
    Promise.all(promises).then((values) => {
        // populateData(_.flatten(values));
    })
});
