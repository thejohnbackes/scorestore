'use strict';


var Sequelize = require('sequelize');

module.exports = function (db) {

    return db.define('genre', {
        genreName: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
};
