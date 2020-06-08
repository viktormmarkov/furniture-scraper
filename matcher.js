const _ = require('lodash');

const clearWords = [
    'от нашата витрина',
    'изчистена',
    'с кожа',
    'от витрина с обслужване'
];

function prepareData(raw) {
    const trimmed = _(raw)
        .mapValues(i => i.trim())
        .value();
    const name = trimmed.name && _.reduce(clearWords, (res, item) => res.replace(item, ''), trimmed.name);
    const cleared = {
        ...trimmed,
        name: name || trimmed.subtitle
    }
    const parsed = {
        ...cleared, 
        price: parseFloat(trimmed.price.replace(',', '.')),
        oldPrice: parseFloat(trimmed.oldPrice.replace(',', '.')),
        raw: cleared
    }
    return parsed;
}

function itemsWithPrice(item) {
    return item.price;
}

function matchProduct(item) {
    let productName;
    if (!item.title && item.subtitle) {
        productName = item.subtitle;
    } else if (item.title) {
        
    }
    // const productName = !item.title && item.subtitle;

    return {
        ...item,
        product
    }
}

function parseData(items) {
    return _(items)
        .map(prepareData)
        .filter(itemsWithPrice)
        .value();
}
module.exports = {
    parseData
};
