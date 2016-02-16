# Backbone-Deep-Clone
A helper function for JavaScript Object deep Cloning with support for deep cloning BackboneJS Collections and Models

**Installation**
------------------------
  npm install backbonedeepclone --save

  bower install backbonedeepclone

**Usage**
----------
Have you ever had the situation with Backbone.js models and collections where you needed complete and separate clone of the model or collection but there were embedded collections and/or models that you wanted tp make sure were cloned with it as well? Look no further than this little helper function module to solve those problems.

### **Example**
    'use strict';
    var _ = require('underscore');
    var Backbone = require('backbone');
    var backboneDeepClone = require('backbonedeepclone');
    var testTopCollection = new Backbone.Collection([new Backbone.Model({
    testAttrA: 'testing'
    }), new Backbone.Model({
    testAttrB: 'testing'
    })]);
    testTopCollection.url = '/some-test-url';

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
    var deepClonedCollection = backboneDeepClone(testTopCollection);

deepClonedCollection can take in any JavaScript object type and run a deep clone on it, but it is primarally designed to handel deep cloning of Backbone collections and models.

**Tests**
----
  npm test

**Contributing**
-----
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

**Release History**
----
* **1.6.0** Add missing support for deep cloning collection Comparitor and Parse functions and model Validate function. 
* **1.5.0** Code Refactor and clean up README file
* **1.0.0** Initial release