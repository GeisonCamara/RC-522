'use strict';
const relativePath = process.env.RELATIVE_PATH || '';

module.exports = {
    relativePath: () => {
        return relativePath;
    },
    resource: (path) => {
        return relativePath + '/content' + path;
    },
    npm:(path) =>{
        return relativePath + '/node_modules' + path;
    },
    url: function (path) {
        return relativePath + path;
    },
    toLowerCase: function (word){
        return word.toLowerCase();
    }
};
