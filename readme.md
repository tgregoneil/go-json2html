 
### go-json2html 

DEPRECATED: use go-j2h, instead

Converts objects, arrays and primitives into html. An 'html-object' is an object
that has a key that is a valid html tag and is converted into the corresponding html 
element. This key is referred to as the 'tag-key'. The remaining keys/values of 
the object are treated as corresponding attributes/values for that html element. 

Arrays are interpreted as corresponding sequences of html elements. 

Primitives that are values of tag-keys are stringified and appended to 
the html tag-key.

Any arbitrary html structure can be rendered with arbitrarily deep nesting. 

A 'cmd-object' is an object that has one of the command keys: 
    'empty': empties the html element, but leaves the element itself in place
    'rm': removes the content and the element itself
    'content': replaces existing content of a non-void html element 
    'attr': sets an attribute (or replaces with new value, if attribute exists)

### Installation
```shell
$ npm install go-json2html
```

### Example (test.js)

```js
var dpp = require ('go-json2html').displayPage;

dpp ({
    span: {label: 'test go-json2html'}, 
    style: "border: 1px solid blue;" +
        "border-radius: 4px;" +
        "background-color: #ccffcc;"
});

dpp ({br: 0});
dpp ("plain text");
```
![rendered](https://raw.githubusercontent.com/tgregoneil/go-json2html/master/testGo2Html.png) 


