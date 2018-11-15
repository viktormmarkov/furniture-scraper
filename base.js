const xray = require('x-ray');
const x = Xray();

x('https://videnov.bg/products/standartni-kuhni', {
    items: x('.prod-teaser', [{
        title: '.prod-teaser-title a',
        image: '.prod-teaser-image img@src',
        price: '.prod-teaser-price',
        url: '.prod-teaser-title a@href',
    }])
})((err, result) => {
    if (err) return;
    console.log(result);
});

// persist data in mongo 
// analyze images -- extract main colorss
// invalidate data in mongo
//