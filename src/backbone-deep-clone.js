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
        if (!_.isUndefined(item.comparator)) {
            clonedCollection.comparator = item.comparator;
        }
        if (!_.isUndefined(item.parse)) {
            clonedCollection.parse = item.parse;
        }
        return clonedCollection;
    } else if ((item instanceof Backbone.Model) === true) {
        var clonedModel = new Backbone.Model(deepCloneSubItem(item.attributes));
        if (!_.isUndefined(item.validate)) {
            clonedModel.validate = item.validate;
        }
        return clonedModel;
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
            if (_.isFunction(value) === true) {
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