'use strict';
var _ = require('underscore');
var Backbone = require('backbone');
var deepCloneSubItem = function(item) {
    return deepCloneItem(item);
};
var deepCloneItem = function(item) {
    if ((item instanceof Backbone.Collection) === true) {
        var clonedCollection = new Backbone.Collection(deepCloneSubItem(item.models));
        if (!_.isUndefined(item.url)) {
            clonedCollection.url = item.url;
        }
        if (!_.isUndefined(item.fetchOptions)) {
            clonedCollection.fetchOptions = deepCloneSubItem(item.fetchOptions);
        }
        if (!_.isUndefined(item.model)) {
            clonedCollection.model = item.model;
        }
        if (!_.isUndefined(item.originalModels)) {
            clonedCollection.originalModels = deepCloneSubItem(item.originalModels);
        }
        return clonedCollection;
    } else if ((item instanceof Backbone.Model) === true) {
        return new Backbone.Model(deepCloneSubItem(item.attributes));
    } else if (_.isFunction(item) === true || (_.isArray(item) === false && _.isObject(item) === false)) {
        return item;
    } else {
        var clonedArray = [];
        var clonedObject = {};
        var addItem = function(value, key) {
            if (_.isArray(item)) {
                clonedArray.push(value);
            } else {
                clonedObject[key] = value;
            }
        }
        _.each(item, function(value, key) {
            if (_.isFunction(value) === true || (_.isArray(value) === true && _.isObject(value) === true && (value instanceof Backbone.Collection) === true && (value instanceof Backbone.Model) === true)) {
                addItem(value, key);
            } else {
                addItem(deepCloneSubItem(value), key);
            }
        });
        if (_.isArray(item)) {
            return clonedArray;
        }
        return clonedObject;
    }
};
module.exports = deepCloneItem;