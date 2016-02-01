'use strict';

var deepClone = require('./backbone-deep-clone'),
    _ = require('underscore'),
    Backbone = require('backbone');
var testTopCollection = new Backbone.Collection([new Backbone.Model({
    testAttrA: 'testing'
}), new Backbone.Model({
    testAttrB: 'testing'
})]);

var getEmbeddedCollections = function() {
    return new Backbone.Collection([new Backbone.Model({
        embeddedCollectionA: new Backbone.Collection([new Backbone.Model({
            embeddedCollectionB: new Backbone.Collection([new Backbone.Model({
                embeddedCollectionC: new Backbone.Collection([new Backbone.Model({
                    embeddedCollectionD: new Backbone.Collection([new Backbone.Model({
                        lastAttribute: 'last attribute'
                    })])
                })])
            })])
        })])
    })]);
};
var embeddedCollections = getEmbeddedCollections();
var clonedEmbeddedCollections = deepClone(embeddedCollections);
testTopCollection.url = '/some-test-url';
testTopCollection.model = function() {
    return 'testing model Function';
}
testTopCollection.fetchOptions = {
    criteria: {
        reqObj1: 'data1',
        reqObj2: 'data2'
    },
    body: 'testing body'
};

testTopCollection.each(function(model) {
    model.set('testCollection', new Backbone.Collection([new Backbone.Model({
        testNum: 100,
        testString: 'I am a String',
        testFunction: function() {
            return 'testing Function';
        },
        testBoolean: true,
        testModel: new Backbone.Model({
            testModleAttr: 'someModelAttr'
        }),
        testArrayInArray: [
            [1, 2, 3, 4, 5],
            [6, 7, 8, 9, 10]
        ],
        testObjectInObject: {
            obj1: {
                keyA: 'value A',
                keyB: 'value B'
            },
            obj2: {
                keyC: 'value C',
                keyD: 'value D'
            }
        },
        testNullValue: null,
        testUndefinedValue: undefined,
        testComplexArray: [{
                keyA: 'value A',
                keyB: 'value B'
            },
            [1, 2, 3, 4, 5],
            100,
            false,
            null,
            undefined,
            function() {
                return 'testing Function';
            },
            new Backbone.Model({
                testingAttrInComplexArray: 'testing Attr In Complex Array'
            }),
            new Backbone.Collection([new Backbone.Model({
                testingAttrInComplexArray1: 'testing Attr In Complex Array 1'
            }), new Backbone.Model({
                testingAttrInComplexArray2: 'testing Attr In Complex Array 2'
            })])
        ],
        testComplexObject: {
            obj: {
                keyA: 'value A',
                keyB: 'value B'
            },
            array: [1, 2, 3, 4, 5],
            number: 100,
            boolean: false,
            nullValue: null,
            undefinedValue: undefined,
            testFunction: function() {
                return 'testing Function';
            },
            model: new Backbone.Model({
                testingAttrInComplexObj: 'testing Attr In Complex Object'
            }),
            collection: new Backbone.Collection([new Backbone.Model({
                testingAttrInComplexObj1: 'testing Attr In Complex Object 1'
            }), new Backbone.Model({
                testingAttrInComplexObj2: 'testing Attr In Complex Object 2'
            })])
        }

    })]));
});
var deepClonedCollection = deepClone(testTopCollection);
var deepClonedCollectionReset = deepClone(testTopCollection);
deepClonedCollectionReset.reset([]);
describe('#Testing Deep Cloning Functionality', function() {
    describe('#Testing baseline', function() {
        it('Returns expected null', function() {
            expect(deepClone(null)).to.equal(null);
        });
        it('Returns expected undefined', function() {
            expect(deepClone(undefined)).to.equal(undefined);
        });
        it('Returns expected string', function() {
            expect(deepClone('testing')).to.equal('testing');
        });
        it('Returns expected number', function() {
            expect(deepClone(100)).to.equal(100);
        });
        it('Returns expected boolean', function() {
            expect(deepClone(false)).to.equal(false);
        });
        it('Returns expected object: is an Object ', function() {
            var testObject = {
                keyA: 'value A',
                keyB: 'value B'
            };
            var clonedTestObject = deepClone(testObject);
            expect(_.isObject(clonedTestObject)).to.equal(true);
        });
        it('Returns expected object: value is equal', function() {
            var testObject = {
                keyA: 'value A',
                keyB: 'value B'
            };
            var clonedTestObject = deepClone(testObject);
            expect(_.isEqual(testObject, clonedTestObject)).to.equal(true);
        });
        it('Returns expected function: is a Function', function() {
            var testFunction = function() {
                return 'testing Function';
            };
            expect(_.isFunction(deepClone(testFunction))).to.equal(true);
        });
        it('Returns expected function: value is equal', function() {
            var testFunction = function() {
                return 'testing Function';
            };
            expect(deepClone(testFunction)).to.equal(testFunction);
        });
        it('Returns expected model: is a Backbone Model', function() {
            var testModel = new Backbone.Model({
                testModleAttr: 'someModelAttr'
            });
            var clonedTestModel = deepClone(testModel);
            expect(clonedTestModel instanceof Backbone.Model).to.equal(true);
        });
        it('Returns expected model: value is equal', function() {
            var testModel = new Backbone.Model({
                testModleAttr: 'someModelAttr'
            });
            var clonedTestModel = deepClone(testModel);
            expect(_.isEqual(testModel.attributes, clonedTestModel.attributes)).to.equal(true);
        });
        it('Returns a Collection', function() {
            expect(deepClonedCollection instanceof Backbone.Collection).to.equal(true);
        });
        it('Collection has same length', function() {
            expect(deepClonedCollection.length).to.equal(testTopCollection.length);
        });
        it('Collection has same model function', function() {
            expect(deepClonedCollection.model).to.equal(testTopCollection.model);
        });
        it('Collection has same fetch options', function() {
            var isEqual = (_.isEqual(deepClonedCollection.fetchOptions.criteria, testTopCollection.fetchOptions.criteria) &&
                _.isEqual(deepClonedCollection.fetchOptions.body, testTopCollection.fetchOptions.body));
            expect(isEqual).to.equal(true);
        });
        it('Collection has same url', function() {
            expect(deepClonedCollection.url).to.equal(testTopCollection.url);
        });
        it('Original Collection is unchanged after reseting cloned collection', function() {
            expect(deepClonedCollectionReset.length).to.equal(0);
            expect(testTopCollection.length).to.equal(2);
        });
    });
    describe('#Embeded Collection has same first model', function() {
        var expectedModel = testTopCollection.models[0].get('testCollection').models[0];
        var actualModel = deepClonedCollection.models[0].get('testCollection').models[0];
        it('Has same number of attributes', function() {
            expect(expectedModel.attributes.length).to.equal(actualModel.attributes.length);
        });
        _.each(expectedModel.attributes, function(value, key) {
            if (key === 'testArrayInArray') {
                it('Has same \"' + key + '\" attribute value', function() {
                    var isEqual = (actualModel.get(key).length === expectedModel.get(key).length) &&
                        (actualModel.get(key)[0].length === expectedModel.get(key)[0].length) &&
                        (actualModel.get(key)[1].length === expectedModel.get(key)[1].length) &&
                        _.contains(actualModel.get(key)[0], expectedModel.get(key)[0][0]) &&
                        _.contains(actualModel.get(key)[0], expectedModel.get(key)[0][1]) &&
                        _.contains(actualModel.get(key)[0], expectedModel.get(key)[0][2]) &&
                        _.contains(actualModel.get(key)[0], expectedModel.get(key)[0][3]) &&
                        _.contains(actualModel.get(key)[0], expectedModel.get(key)[0][4]) &&
                        _.contains(actualModel.get(key)[1], expectedModel.get(key)[1][0]) &&
                        _.contains(actualModel.get(key)[1], expectedModel.get(key)[1][1]) &&
                        _.contains(actualModel.get(key)[1], expectedModel.get(key)[1][2]) &&
                        _.contains(actualModel.get(key)[1], expectedModel.get(key)[1][3]) &&
                        _.contains(actualModel.get(key)[1], expectedModel.get(key)[1][4]);
                    expect(isEqual).to.equal(true);
                });
            } else if (key === 'testModel') {
                it('Has same \"' + key + '\" attribute value', function() {
                    expect(actualModel.get(key).get('testModleAttr')).to.equal(expectedModel.get(key).get('testModleAttr'));
                });
            } else if (key === 'testObjectInObject') {
                it('Has same \"' + key + '\" attribute value', function() {
                    expect(_.isEqual(actualModel.get(key), expectedModel.get(key))).to.equal(true);
                });
            } else if (key === 'testComplexArray') {
                it('Has same \"' + key + '\" attribute value', function() {
                    var isEqual = (actualModel.get(key).length === expectedModel.get(key).length) &&
                        _.isEqual(actualModel.get(key)[0], expectedModel.get(key)[0]) &&
                        (actualModel.get(key)[1].length === expectedModel.get(key)[1].length) &&
                        _.contains(actualModel.get(key)[1], expectedModel.get(key)[1][0]) &&
                        _.contains(actualModel.get(key)[1], expectedModel.get(key)[1][1]) &&
                        _.contains(actualModel.get(key)[1], expectedModel.get(key)[1][2]) &&
                        _.contains(actualModel.get(key)[1], expectedModel.get(key)[1][3]) &&
                        _.contains(actualModel.get(key)[1], expectedModel.get(key)[1][4]) &&
                        _.isEqual(actualModel.get(key)[2], expectedModel.get(key)[2]) &&
                        _.isEqual(actualModel.get(key)[3], expectedModel.get(key)[3]) &&
                        _.isEqual(actualModel.get(key)[4], expectedModel.get(key)[4]) &&
                        _.isEqual(actualModel.get(key)[5], expectedModel.get(key)[5]) &&
                        _.isEqual(actualModel.get(key)[6], expectedModel.get(key)[6]) &&
                        _.isEqual(actualModel.get(key)[7].attributes, expectedModel.get(key)[7].attributes) &&
                        _.isEqual(actualModel.get(key)[8].models[0].attributes, expectedModel.get(key)[8].models[0].attributes) &&
                        _.isEqual(actualModel.get(key)[8].models[1].attributes, expectedModel.get(key)[8].models[1].attributes);
                    expect(isEqual).to.equal(true);
                });
            } else if (key === 'testComplexObject') {
                it('Has same \"' + key + '\" attribute value', function() {
                    var isEqual = _.isEqual(actualModel.get(key).obj, expectedModel.get(key).obj) &&
                        (actualModel.get(key).array.length === expectedModel.get(key).array.length) &&
                        _.contains(actualModel.get(key).array, expectedModel.get(key).array[0]) &&
                        _.contains(actualModel.get(key).array, expectedModel.get(key).array[1]) &&
                        _.contains(actualModel.get(key).array, expectedModel.get(key).array[2]) &&
                        _.contains(actualModel.get(key).array, expectedModel.get(key).array[3]) &&
                        _.contains(actualModel.get(key).array, expectedModel.get(key).array[4]) &&
                        _.isEqual(actualModel.get(key).number, expectedModel.get(key).number) &&
                        _.isEqual(actualModel.get(key).boolean, expectedModel.get(key).boolean) &&
                        _.isEqual(actualModel.get(key).nullValue, expectedModel.get(key).nullValue) &&
                        _.isEqual(actualModel.get(key).undefinedValue, expectedModel.get(key).undefinedValue) &&
                        _.isEqual(actualModel.get(key).testFunction, expectedModel.get(key).testFunction) &&
                        _.isEqual(actualModel.get(key).model.attributes, expectedModel.get(key).model.attributes) &&
                        _.isEqual(actualModel.get(key).collection.models[0].attributes, expectedModel.get(key).collection.models[0].attributes) &&
                        _.isEqual(actualModel.get(key).collection.models[1].attributes, expectedModel.get(key).collection.models[1].attributes);
                    expect(isEqual).to.equal(true);
                });
            } else {
                it('Has same \"' + key + '\" attribute value', function() {
                    expect(expectedModel.get(key)).to.equal(actualModel.get(key));
                });
            }
        });
    });
    describe('#Embeded Collection has same second model', function() {
        var expectedModel = testTopCollection.models[1].get('testCollection').models[0];
        var actualModel = deepClonedCollection.models[1].get('testCollection').models[0];
        it('Has same number of attributes', function() {
            expect(expectedModel.attributes.length).to.equal(actualModel.attributes.length);
        });
        _.each(expectedModel.attributes, function(value, key) {
            if (key === 'testArrayInArray') {
                it('Has same \"' + key + '\" attribute value', function() {
                    var isEqual = (actualModel.get(key).length === expectedModel.get(key).length) &&
                        (actualModel.get(key)[0].length === expectedModel.get(key)[0].length) &&
                        (actualModel.get(key)[1].length === expectedModel.get(key)[1].length) &&
                        _.contains(actualModel.get(key)[0], expectedModel.get(key)[0][0]) &&
                        _.contains(actualModel.get(key)[0], expectedModel.get(key)[0][1]) &&
                        _.contains(actualModel.get(key)[0], expectedModel.get(key)[0][2]) &&
                        _.contains(actualModel.get(key)[0], expectedModel.get(key)[0][3]) &&
                        _.contains(actualModel.get(key)[0], expectedModel.get(key)[0][4]) &&
                        _.contains(actualModel.get(key)[1], expectedModel.get(key)[1][0]) &&
                        _.contains(actualModel.get(key)[1], expectedModel.get(key)[1][1]) &&
                        _.contains(actualModel.get(key)[1], expectedModel.get(key)[1][2]) &&
                        _.contains(actualModel.get(key)[1], expectedModel.get(key)[1][3]) &&
                        _.contains(actualModel.get(key)[1], expectedModel.get(key)[1][4]);
                    expect(isEqual).to.equal(true);
                });
            } else if (key === 'testModel') {
                it('Has same \"' + key + '\" attribute value', function() {
                    expect(actualModel.get(key).get('testModleAttr')).to.equal(expectedModel.get(key).get('testModleAttr'));
                });
            } else if (key === 'testObjectInObject') {
                it('Has same \"' + key + '\" attribute value', function() {
                    expect(_.isEqual(actualModel.get(key), expectedModel.get(key))).to.equal(true);
                });
            } else if (key === 'testComplexArray') {
                it('Has same \"' + key + '\" attribute value', function() {
                    var isEqual = (actualModel.get(key).length === expectedModel.get(key).length) &&
                        _.isEqual(actualModel.get(key)[0], expectedModel.get(key)[0]) &&
                        (actualModel.get(key)[1].length === expectedModel.get(key)[1].length) &&
                        _.contains(actualModel.get(key)[1], expectedModel.get(key)[1][0]) &&
                        _.contains(actualModel.get(key)[1], expectedModel.get(key)[1][1]) &&
                        _.contains(actualModel.get(key)[1], expectedModel.get(key)[1][2]) &&
                        _.contains(actualModel.get(key)[1], expectedModel.get(key)[1][3]) &&
                        _.contains(actualModel.get(key)[1], expectedModel.get(key)[1][4]) &&
                        _.isEqual(actualModel.get(key)[2], expectedModel.get(key)[2]) &&
                        _.isEqual(actualModel.get(key)[3], expectedModel.get(key)[3]) &&
                        _.isEqual(actualModel.get(key)[4], expectedModel.get(key)[4]) &&
                        _.isEqual(actualModel.get(key)[5], expectedModel.get(key)[5]) &&
                        _.isEqual(actualModel.get(key)[6], expectedModel.get(key)[6]) &&
                        _.isEqual(actualModel.get(key)[7].attributes, expectedModel.get(key)[7].attributes) &&
                        _.isEqual(actualModel.get(key)[8].models[0].attributes, expectedModel.get(key)[8].models[0].attributes) &&
                        _.isEqual(actualModel.get(key)[8].models[1].attributes, expectedModel.get(key)[8].models[1].attributes);
                    expect(isEqual).to.equal(true);
                });
            } else if (key === 'testComplexObject') {
                it('Has same \"' + key + '\" attribute value', function() {
                    var isEqual = _.isEqual(actualModel.get(key).obj, expectedModel.get(key).obj) &&
                        (actualModel.get(key).array.length === expectedModel.get(key).array.length) &&
                        _.contains(actualModel.get(key).array, expectedModel.get(key).array[0]) &&
                        _.contains(actualModel.get(key).array, expectedModel.get(key).array[1]) &&
                        _.contains(actualModel.get(key).array, expectedModel.get(key).array[2]) &&
                        _.contains(actualModel.get(key).array, expectedModel.get(key).array[3]) &&
                        _.contains(actualModel.get(key).array, expectedModel.get(key).array[4]) &&
                        _.isEqual(actualModel.get(key).number, expectedModel.get(key).number) &&
                        _.isEqual(actualModel.get(key).boolean, expectedModel.get(key).boolean) &&
                        _.isEqual(actualModel.get(key).nullValue, expectedModel.get(key).nullValue) &&
                        _.isEqual(actualModel.get(key).undefinedValue, expectedModel.get(key).undefinedValue) &&
                        _.isEqual(actualModel.get(key).testFunction, expectedModel.get(key).testFunction) &&
                        _.isEqual(actualModel.get(key).model.attributes, expectedModel.get(key).model.attributes) &&
                        _.isEqual(actualModel.get(key).collection.models[0].attributes, expectedModel.get(key).collection.models[0].attributes) &&
                        _.isEqual(actualModel.get(key).collection.models[1].attributes, expectedModel.get(key).collection.models[1].attributes);
                    expect(isEqual).to.equal(true);
                });
            } else {
                it('Has same \"' + key + '\" attribute value', function() {
                    expect(expectedModel.get(key)).to.equal(actualModel.get(key));
                });
            }
        });
    });
    describe('#Testing deep nested Collections', function() {
        it('embeddedCollectionA is a Collection', function() {
            var actualValue = (clonedEmbeddedCollections.models[0].get('embeddedCollectionA') instanceof Backbone.Collection);
            expect(actualValue).to.equal(true);
        });
        it('embeddedCollectionA first item is a Model', function() {
            var actualValue = (clonedEmbeddedCollections.models[0].get('embeddedCollectionA').models[0] instanceof Backbone.Model);
            expect(actualValue).to.equal(true);
        });
        it('embeddedCollectionB is a Collection', function() {
            var actualValue = (clonedEmbeddedCollections.models[0].get('embeddedCollectionA').models[0].get('embeddedCollectionB') instanceof Backbone.Collection);
            expect(actualValue).to.equal(true);
        });
        it('embeddedCollectionB first item is a Model', function() {
            var actualValue = (clonedEmbeddedCollections.models[0].get('embeddedCollectionA').models[0].get('embeddedCollectionB').models[0] instanceof Backbone.Model);
            expect(actualValue).to.equal(true);
        });
        it('embeddedCollectionC is a Collection', function() {
            var actualValue = (clonedEmbeddedCollections.models[0].get('embeddedCollectionA').models[0].get('embeddedCollectionB').models[0].get('embeddedCollectionC') instanceof Backbone.Collection);
            expect(actualValue).to.equal(true);
        });
        it('embeddedCollectionC first item is a Model', function() {
            var actualValue = (clonedEmbeddedCollections.models[0].get('embeddedCollectionA').models[0].get('embeddedCollectionB').models[0].get('embeddedCollectionC').models[0] instanceof Backbone.Model);
        });
        it('embeddedCollectionD is a Collection', function() {
            var actualValue = (clonedEmbeddedCollections.models[0].get('embeddedCollectionA').models[0].get('embeddedCollectionB').models[0].get('embeddedCollectionC').models[0].get('embeddedCollectionD') instanceof Backbone.Collection);
            expect(actualValue).to.equal(true);
        });
        it('embeddedCollectionD first item is a Model', function() {
            var actualValue = (clonedEmbeddedCollections.models[0].get('embeddedCollectionA').models[0].get('embeddedCollectionB').models[0].get('embeddedCollectionC').models[0].get('embeddedCollectionD').models[0] instanceof Backbone.Model);
            expect(actualValue).to.equal(true);
        });
        it('Returns expected last Attribute', function() {
            var actualValue = clonedEmbeddedCollections.models[0].get('embeddedCollectionA').models[0].get('embeddedCollectionB').models[0].get('embeddedCollectionC').models[0].get('embeddedCollectionD').models[0].get('lastAttribute');
            var expectedValue = embeddedCollections.models[0].get('embeddedCollectionA').models[0].get('embeddedCollectionB').models[0].get('embeddedCollectionC').models[0].get('embeddedCollectionD').models[0].get('lastAttribute');
            expect(actualValue).to.equal(expectedValue);
        });
    });
});