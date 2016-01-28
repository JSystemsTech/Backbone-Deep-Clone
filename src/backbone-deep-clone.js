'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var deepCloneColection = function(collection) {
    var clonedModels = [];
    _.each(collection.models, function(model) {
        clonedModels.push(cloneModel(model));
    });
    var clonedCollection = new Backbone.Collection(clonedModels);
    if (!_.isUndefined(collection.url)) {
        clonedCollection.url = collection.url;
    }
    if (!_.isUndefined(collection.fetchOptions)) {
        clonedCollection.fetchOptions = collection.fetchOptions;
    }
    if (!_.isUndefined(collection.model)) {
        clonedCollection.model = collection.model;
    }
    if (!_.isUndefined(collection.originalModels)) {
        var clonedOriginalModels = [];
        _.each(collection.originalModels, function(model) {
            clonedOriginalModels.push(cloneModel(model));
        });
        clonedCollection.originalModels = clonedOriginalModels;
    }
    return clonedCollection;
};
var cloneModel = function(model) {
    return new Backbone.Model(cloneObject(model.attributes));
};
var cloneSubObject = function(object) {
    return cloneObject(object);
};
var cloneObject = function(object) {
    var clonedObject = {};
    _.each(object, function(value, key) {
        if ((value instanceof Backbone.Collection) === true) {
            clonedObject[key] = deepCloneColection(value);
        } else if ((value instanceof Backbone.Model) === true) {
            clonedObject[key] = cloneModel(value);
        } else if (_.isArray(value) === true) {
            clonedObject[key] = cloneArray(value);
        } else if (_.isFunction(value)) {
            clonedObject[key] = value;
        } else if (_.isObject(value) === true) {
            clonedObject[key] = cloneSubObject(value);
        } else {
            clonedObject[key] = value;
        }
    });
    return clonedObject;
};
var cloneSubArray = function(array) {
    return cloneArray(array);
};
var cloneArray = function(array) {
    var clonedArray = [];
    _.each(array, function(value) {
        if ((value instanceof Backbone.Collection) === true) {
            clonedArray.push(deepCloneColection(value));
        } else if ((value instanceof Backbone.Model) === true) {
            clonedArray.push(cloneModel(value));
        } else if (_.isArray(value) === true) {
            clonedArray.push(cloneSubArray(value));
        } else if (_.isFunction(value)) {
            clonedArray.push(value);
        } else if (_.isObject(value) === true) {
            clonedArray.push(cloneObject(value));
        } else {
            clonedArray.push(value);
        }
    });
    return clonedArray;
};
var deepClone = function(objectToClone) {
    if ((objectToClone instanceof Backbone.Collection) === true) {
        return deepCloneColection(objectToClone);
    } else if ((objectToClone instanceof Backbone.Model) === true) {
        return cloneModel(objectToClone);
    } else if (_.isArray(objectToClone) === true) {
        return cloneArray(objectToClone);
    } else if (_.isFunction(objectToClone)) {
        return objectToClone;
    } else if (_.isObject(objectToClone) === true) {
        return cloneObject(objectToClone);
    } else {
        return objectToClone;
    }
};
module.exports = deepClone;