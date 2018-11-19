const getColors = require('get-image-colors')
const fs = require('fs');
const IMAGE_DIR = './imgs'
const _ = require('lodash');
fs.readdir(IMAGE_DIR, (err, files) => {
    files.forEach(file => {
        getColors(`./${IMAGE_DIR}/${file}`, function (err, res) {
            if (err) throw err
            console.log(_.map(res, r => r.hex()));
        })
    });
})