'use strict';
var crypto = require('crypto');
var _ = require('lodash');
var Sequelize = require('sequelize');

module.exports = function (db) {

    return db.define('user', {
        firstName: { //add full name virtual
          type: Sequelize.STRING
        },
        lastName: {
          type: Sequelize.STRING
        },
        fullName: {
          type: Sequelize.VIRTUAL,
          get: function() {
            return this.firstName + ' ' + this.lastName;
          }
        },
        isGuest: {
          type: Sequelize.BOOLEAN
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            validate: {
              isEmail: true
            },
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING
        },
        resetPassword: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        salt: {
            type: Sequelize.STRING
        },
        twitter_id: {
            type: Sequelize.STRING
        },
        facebook_id: {
            type: Sequelize.STRING
        },
        google_id: {
            type: Sequelize.STRING
        },
        isAdmin: {
            type: Sequelize.BOOLEAN
        }
    }, {
        instanceMethods: {
            sanitize: function () {
                return _.omit(this.toJSON(), ['password', 'salt']);
            },
            correctPassword: function (candidatePassword) {
                return this.Model.encryptPassword(candidatePassword, this.salt) === this.password;
            }
        },
        classMethods: {
            generateSalt: function () {
                return crypto.randomBytes(16).toString('base64');
            },
            encryptPassword: function (plainText, salt) {
                var hash = crypto.createHash('sha1');
                hash.update(plainText);
                hash.update(salt);
                return hash.digest('hex');
            }
        },
        hooks: {
            beforeUpdate: function (user) {
                if (user.changed('password')) {
                    user.salt = user.Model.generateSalt();
                    user.password = user.Model.encryptPassword(user.password, user.salt);
                }
            },
            beforeCreate: function (user) {
                if (user.changed('password')) {
                    user.salt = user.Model.generateSalt();
                    user.password = user.Model.encryptPassword(user.password, user.salt);
                }
            }
        }
    });

};
