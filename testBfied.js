(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// go-json2html/index.js

module.exports = (function () {

// PRIVATE Properties/Methods
var _ = {

    id: 0,
    primitiveTypesNotNull: {'string':1, 'undefined':1, 'number':1, 'boolean':1, 'symbol': 1},
        // since typeof null yields 'object', it's handled separately

}; // end PRIVATE properties


//---------------------
_.displayPageH = (parent, dispOb) => {
    
    if (dispOb === 0) {
        // case where no content is desired
        // to display an actual zero, make it a string:  "0"

        return;

    } // end if (dispOb === 0)
    
    var dispObType = typeof dispOb;
    var isPrimitive = _.primitiveTypesNotNull.hasOwnProperty (dispObType) || dispOb === null;

    if (isPrimitive) {

        Id = _.textMake (parent, dispOb, 'append');

    } else {
        
            // NE => Not Empty
        var isNEArray = Array.isArray (dispOb) && dispOb.length > 0;
        var isNEObject = !Array.isArray(dispOb) && dispObType == 'object' && Object.keys(dispOb).length > 0;
        
        var Id = null;
            // capital Id to indicate id with '#' prefixing it
    
        if (isNEObject) {
    
            if (dispOb.hasOwnProperty ('rm')) {

                var selector = dispOb.rm;
                $(selector)
                .remove ();

            } else if (dispOb.hasOwnProperty ('empty')) {

                var selector = dispOb.empty;
                $(selector)
                .empty ();

            } else if (dispOb.hasOwnProperty ('_content')) {

                _.displayPageH (parent, dispOb._content);

            } else if (dispOb.hasOwnProperty ('attr')) {

                $(parent)
                .attr (dispOb.attr);

            } else {
                
                parent = dispOb.hasOwnProperty ('parent') ? dispOb.parent : parent;
            
                var attrs = {};
                var elementName = null;
                var content;
            
                var keys = Object.keys (dispOb);
                var insertLocation = 'append';
                for (var i = 0; i < keys.length; i++) {
        
                    var ky = keys [i];
        
                    var tagType = _.getTagType (ky);
        
                    var styleInHead = parent === 'head' && ky === 'style';
                        // style can be attribute or element
                        // regarded as element, if in head section
                        // otherwise regarded as an attribute
                        
                    var tagNotStyle = tagType !== 0 && ky !== 'style';
        
                    if (tagNotStyle || styleInHead) {
        
                        elementName = ky;
                        content = dispOb [elementName];
        
                    } else {
                        
                        switch (ky) {
            
                            case 'parent':
                                    // do nothing -- Prevents 'parent' from becoming an attribute
                                break;
                            case 'prepend':
                            case 'append':
                            case 'before':
                            case 'after':
                                insertLocation = ky;
                                parent = dispOb [ky] === 1 ? parent : dispOb [ky];
                                    // if any of prepend, ... are specified, and the value is other
                                    // than a '1', override the parent value with that value
                                break;
            
                            default:
                                
                                attrs [ky] = dispOb [ky];
                                break;
            
                        } // end switch (ky)
        
                    } // end if (tagType !== 0)
        
                } // end for (var i = 0; i < keys; i++)
                
        
                if (!elementName) {
                    // error case -- set as text and display entire dispOb

                    elementName = 'text';
                    content = JSON.stringify (dispOb);

                } // end if (!elementName)
                
                if (elementName === 'text') {

                    Id = _.textMake (parent, content, insertLocation);

                } else {

                    Id = _.elementMake (elementName, parent, insertLocation, attrs);

                } // end if (elementName === 'text')
                
                
                if (Id !== null) {
                    // case for element not 'text'
                    
                    _.displayPageH (Id, content);

                } // end if (Id !== null)
                

            } // end if (dispOb.hasOwnProperty ('rm'))
            
    
        } else if (isNEArray) {
    
            for (var i = 0; i < dispOb.length; i++) {
    
                    // returned Id will be for last item in array
                    // useful to later add siblings with 'after' key
                Id = _.displayPageH (parent, dispOb [i]);
    
            } // end for (var i = 0; i < dispOb.length; i++)
    
        } else {
    
            Id = null;
                // case for dispOb as an empty object
    
        } // end if (isNEObject)

    } // end if (_.primitiveTypesNotNull.hasOwnProperty (dispObType))
    
        
    return Id;

}; // end _.displayPageH 

//---------------------
_.elementMake = (tag, parentOrSibl, insertLocation, attrs) => {
    
    var id;
    var attrKeys = Object.keys (attrs);
    var hasAttrs = attrKeys.length > 0;

    if (hasAttrs && attrs.hasOwnProperty ('id')) {

        id = attrs.id;

    } else {

        id = P.genId ();

    } // end if (hasAttrs)
    
    var Id = '#' + id;
    
    var divel = '<' + tag + ' id="' + id + '"';

    var tagtype = _.getTagType (tag);

    if (tagtype == 1) {

        divel += '>';

    } else {

        divel += '></' + tag + '>';

    } // end if (tagtype == 1)

    $(parentOrSibl)[insertLocation] (divel);
    
    if (hasAttrs) {
        
        $(Id)
        .attr (attrs);

    } // end if (hasAttrs)
    
    return Id;

}; // end _.elementMake

//---------------------
_.getTagType = (tag) => {

        // 1 => void elements, 2 => has content
    var tags = { area: 1, base: 1, br: 1, col: 1, embed: 1, hr: 1, img: 1, input: 1, keygen: 1, link: 1, meta: 1, param: 1, source: 1, track: 1, wbr: 1, a: 2, abbr: 2, address: 2, article: 2, aside: 2, audio: 2, b: 2, bdi: 2, bdo: 2, blockquote: 2, body: 2, button: 2, canvas: 2, caption: 2, cite: 2, code: 2, colgroup: 2, datalist: 2, dd: 2, del: 2, details: 2, dfn: 2, dialog: 2, div: 2, dl: 2, dt: 2, em: 2, fieldset: 2, figcaption: 2, figure: 2, footer: 2, form: 2, h1: 2, h2: 2, h3: 2, h4: 2, h5: 2, h6: 2, head: 2, header: 2, hgroup: 2, html: 2, i: 2, iframe: 2, ins: 2, kbd: 2, label: 2, legend: 2, li: 2, map: 2, mark: 2, menu: 2, meter: 2, nav: 2, noscript: 2, object: 2, ol: 2, optgroup: 2, option: 2, output: 2, p: 2, pre: 2, progress: 2, q: 2, rp: 2, rt: 2, ruby: 2, s: 2, samp: 2, script: 2, section: 2, select: 2, small: 2, span: 2, strong: 2, style: 2, sub: 2, summary: 2, sup: 2, svg: 2, table: 2, tbody: 2, td: 2, textarea: 2, tfoot: 2, th: 2, thead: 2, time: 2, title: 2, tr: 2, u: 2, ul: 2, 'var': 2, video: 2};

    tags.text = 1;  // special tag:  uses _.makeText ()
    
    return tags.hasOwnProperty(tag) ? tags [tag] : 0;

}; // end _.getTagType 


//---------------------
_.textMake = (parent, primitive, location) => {
    
    if (typeof primitive === 'string') {
        
        var singlequote = '&#x0027;';
        var backslash = '&#x005c;';
        var doublequote = '&#x0022;';
        var lt = '&lt;';
        
        primitive = primitive.replace (/'/g, singlequote);
        primitive = primitive.replace (/"/g, doublequote);
        primitive = primitive.replace (/\\/g, backslash);
        primitive = primitive.replace (/</g, lt);

    } else if (typeof primitive === 'symbol') {

        primitive = 'symbol';
            // otherwise stringify would produce '{}' which is less useful

    } else {

        primitive = JSON.stringify (primitive);

    } // end if (typeof primitive === 'string')
    

    $(parent) [location] (primitive);

    return null;
        // text obs have no id's: only text is appended with no way to address it
        // if addressing is necessary, use span instead of text

}; // end _.textMake 



// PUBLIC Properties/Methods
var P = {};

//---------------------
P.displayPage = (dispOb) => {
    
    var parent = dispOb.hasOwnProperty ('parent') ? dispOb.parent : 'body';
        // if parent not found, append to body

    var Id = _.displayPageH (parent, dispOb);

    return Id;

}; // end P.displayPage 

//---------------------
P.genId = () => {

    var id = 'i' + _.id++;
    return id;

}; // end P.genId


// end PUBLIC section

return P;

}());




},{}],2:[function(require,module,exports){

// test.js

(function () {

    $(document)
    .ready (function () {
        var dpp = require ('go-json2html').displayPage;

        dpp ({
            span: {label: 'test go-json2html'}, 
            style: "border: 1px solid blue;" +
                "border-radius: 4px;" +
                "background-color: #ccffcc;"
        });

        dpp ({br: 0});
        dpp ("plain text");

    });

}) ();

},{"go-json2html":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlc19nbG9iYWwvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBnby1qc29uMmh0bWwvaW5kZXguanNcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKCkge1xuXG4vLyBQUklWQVRFIFByb3BlcnRpZXMvTWV0aG9kc1xudmFyIF8gPSB7XG5cbiAgICBpZDogMCxcbiAgICBwcmltaXRpdmVUeXBlc05vdE51bGw6IHsnc3RyaW5nJzoxLCAndW5kZWZpbmVkJzoxLCAnbnVtYmVyJzoxLCAnYm9vbGVhbic6MSwgJ3N5bWJvbCc6IDF9LFxuICAgICAgICAvLyBzaW5jZSB0eXBlb2YgbnVsbCB5aWVsZHMgJ29iamVjdCcsIGl0J3MgaGFuZGxlZCBzZXBhcmF0ZWx5XG5cbn07IC8vIGVuZCBQUklWQVRFIHByb3BlcnRpZXNcblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXy5kaXNwbGF5UGFnZUggPSAocGFyZW50LCBkaXNwT2IpID0+IHtcbiAgICBcbiAgICBpZiAoZGlzcE9iID09PSAwKSB7XG4gICAgICAgIC8vIGNhc2Ugd2hlcmUgbm8gY29udGVudCBpcyBkZXNpcmVkXG4gICAgICAgIC8vIHRvIGRpc3BsYXkgYW4gYWN0dWFsIHplcm8sIG1ha2UgaXQgYSBzdHJpbmc6ICBcIjBcIlxuXG4gICAgICAgIHJldHVybjtcblxuICAgIH0gLy8gZW5kIGlmIChkaXNwT2IgPT09IDApXG4gICAgXG4gICAgdmFyIGRpc3BPYlR5cGUgPSB0eXBlb2YgZGlzcE9iO1xuICAgIHZhciBpc1ByaW1pdGl2ZSA9IF8ucHJpbWl0aXZlVHlwZXNOb3ROdWxsLmhhc093blByb3BlcnR5IChkaXNwT2JUeXBlKSB8fCBkaXNwT2IgPT09IG51bGw7XG5cbiAgICBpZiAoaXNQcmltaXRpdmUpIHtcblxuICAgICAgICBJZCA9IF8udGV4dE1ha2UgKHBhcmVudCwgZGlzcE9iLCAnYXBwZW5kJyk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIE5FID0+IE5vdCBFbXB0eVxuICAgICAgICB2YXIgaXNORUFycmF5ID0gQXJyYXkuaXNBcnJheSAoZGlzcE9iKSAmJiBkaXNwT2IubGVuZ3RoID4gMDtcbiAgICAgICAgdmFyIGlzTkVPYmplY3QgPSAhQXJyYXkuaXNBcnJheShkaXNwT2IpICYmIGRpc3BPYlR5cGUgPT0gJ29iamVjdCcgJiYgT2JqZWN0LmtleXMoZGlzcE9iKS5sZW5ndGggPiAwO1xuICAgICAgICBcbiAgICAgICAgdmFyIElkID0gbnVsbDtcbiAgICAgICAgICAgIC8vIGNhcGl0YWwgSWQgdG8gaW5kaWNhdGUgaWQgd2l0aCAnIycgcHJlZml4aW5nIGl0XG4gICAgXG4gICAgICAgIGlmIChpc05FT2JqZWN0KSB7XG4gICAgXG4gICAgICAgICAgICBpZiAoZGlzcE9iLmhhc093blByb3BlcnR5ICgncm0nKSkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdG9yID0gZGlzcE9iLnJtO1xuICAgICAgICAgICAgICAgICQoc2VsZWN0b3IpXG4gICAgICAgICAgICAgICAgLnJlbW92ZSAoKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChkaXNwT2IuaGFzT3duUHJvcGVydHkgKCdlbXB0eScpKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0b3IgPSBkaXNwT2IuZW1wdHk7XG4gICAgICAgICAgICAgICAgJChzZWxlY3RvcilcbiAgICAgICAgICAgICAgICAuZW1wdHkgKCk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlzcE9iLmhhc093blByb3BlcnR5ICgnX2NvbnRlbnQnKSkge1xuXG4gICAgICAgICAgICAgICAgXy5kaXNwbGF5UGFnZUggKHBhcmVudCwgZGlzcE9iLl9jb250ZW50KTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChkaXNwT2IuaGFzT3duUHJvcGVydHkgKCdfYXR0cicpKSB7XG5cbiAgICAgICAgICAgICAgICAkKHBhcmVudClcbiAgICAgICAgICAgICAgICAuYXR0ciAoZGlzcE9iLl9hdHRyKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBkaXNwT2IuaGFzT3duUHJvcGVydHkgKCdwYXJlbnQnKSA/IGRpc3BPYi5wYXJlbnQgOiBwYXJlbnQ7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSB7fTtcbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudE5hbWUgPSBudWxsO1xuICAgICAgICAgICAgICAgIHZhciBjb250ZW50O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyAoZGlzcE9iKTtcbiAgICAgICAgICAgICAgICB2YXIgaW5zZXJ0TG9jYXRpb24gPSAnYXBwZW5kJztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHZhciBreSA9IGtleXMgW2ldO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhZ1R5cGUgPSBfLmdldFRhZ1R5cGUgKGt5KTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdHlsZUluSGVhZCA9IHBhcmVudCA9PT0gJ2hlYWQnICYmIGt5ID09PSAnc3R5bGUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3R5bGUgY2FuIGJlIGF0dHJpYnV0ZSBvciBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByZWdhcmRlZCBhcyBlbGVtZW50LCBpZiBpbiBoZWFkIHNlY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG90aGVyd2lzZSByZWdhcmRlZCBhcyBhbiBhdHRyaWJ1dGVcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB2YXIgdGFnTm90U3R5bGUgPSB0YWdUeXBlICE9PSAwICYmIGt5ICE9PSAnc3R5bGUnO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhZ05vdFN0eWxlIHx8IHN0eWxlSW5IZWFkKSB7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudE5hbWUgPSBreTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBkaXNwT2IgW2VsZW1lbnROYW1lXTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoa3kpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3BhcmVudCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkbyBub3RoaW5nIC0tIFByZXZlbnRzICdwYXJlbnQnIGZyb20gYmVjb21pbmcgYW4gYXR0cmlidXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3ByZXBlbmQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FwcGVuZCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnYmVmb3JlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdhZnRlcic6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydExvY2F0aW9uID0ga3k7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IGRpc3BPYiBba3ldID09PSAxID8gcGFyZW50IDogZGlzcE9iIFtreV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBhbnkgb2YgcHJlcGVuZCwgLi4uIGFyZSBzcGVjaWZpZWQsIGFuZCB0aGUgdmFsdWUgaXMgb3RoZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoYW4gYSAnMScsIG92ZXJyaWRlIHRoZSBwYXJlbnQgdmFsdWUgd2l0aCB0aGF0IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzIFtreV0gPSBkaXNwT2IgW2t5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gLy8gZW5kIHN3aXRjaCAoa3kpXG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9IC8vIGVuZCBpZiAodGFnVHlwZSAhPT0gMClcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgfSAvLyBlbmQgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzOyBpKyspXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICghZWxlbWVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZXJyb3IgY2FzZSAtLSBzZXQgYXMgdGV4dCBhbmQgZGlzcGxheSBlbnRpcmUgZGlzcE9iXG5cbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudE5hbWUgPSAndGV4dCc7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBKU09OLnN0cmluZ2lmeSAoZGlzcE9iKTtcblxuICAgICAgICAgICAgICAgIH0gLy8gZW5kIGlmICghZWxlbWVudE5hbWUpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnROYW1lID09PSAndGV4dCcpIHtcblxuICAgICAgICAgICAgICAgICAgICBJZCA9IF8udGV4dE1ha2UgKHBhcmVudCwgY29udGVudCwgaW5zZXJ0TG9jYXRpb24pO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICBJZCA9IF8uZWxlbWVudE1ha2UgKGVsZW1lbnROYW1lLCBwYXJlbnQsIGluc2VydExvY2F0aW9uLCBhdHRycyk7XG5cbiAgICAgICAgICAgICAgICB9IC8vIGVuZCBpZiAoZWxlbWVudE5hbWUgPT09ICd0ZXh0JylcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoSWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FzZSBmb3IgZWxlbWVudCBub3QgJ3RleHQnXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBfLmRpc3BsYXlQYWdlSCAoSWQsIGNvbnRlbnQpO1xuXG4gICAgICAgICAgICAgICAgfSAvLyBlbmQgaWYgKElkICE9PSBudWxsKVxuICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICB9IC8vIGVuZCBpZiAoZGlzcE9iLmhhc093blByb3BlcnR5ICgncm0nKSlcbiAgICAgICAgICAgIFxuICAgIFxuICAgICAgICB9IGVsc2UgaWYgKGlzTkVBcnJheSkge1xuICAgIFxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkaXNwT2IubGVuZ3RoOyBpKyspIHtcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gcmV0dXJuZWQgSWQgd2lsbCBiZSBmb3IgbGFzdCBpdGVtIGluIGFycmF5XG4gICAgICAgICAgICAgICAgICAgIC8vIHVzZWZ1bCB0byBsYXRlciBhZGQgc2libGluZ3Mgd2l0aCAnYWZ0ZXInIGtleVxuICAgICAgICAgICAgICAgIElkID0gXy5kaXNwbGF5UGFnZUggKHBhcmVudCwgZGlzcE9iIFtpXSk7XG4gICAgXG4gICAgICAgICAgICB9IC8vIGVuZCBmb3IgKHZhciBpID0gMDsgaSA8IGRpc3BPYi5sZW5ndGg7IGkrKylcbiAgICBcbiAgICAgICAgfSBlbHNlIHtcbiAgICBcbiAgICAgICAgICAgIElkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAvLyBjYXNlIGZvciBkaXNwT2IgYXMgYW4gZW1wdHkgb2JqZWN0XG4gICAgXG4gICAgICAgIH0gLy8gZW5kIGlmIChpc05FT2JqZWN0KVxuXG4gICAgfSAvLyBlbmQgaWYgKF8ucHJpbWl0aXZlVHlwZXNOb3ROdWxsLmhhc093blByb3BlcnR5IChkaXNwT2JUeXBlKSlcbiAgICBcbiAgICAgICAgXG4gICAgcmV0dXJuIElkO1xuXG59OyAvLyBlbmQgXy5kaXNwbGF5UGFnZUggXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5fLmVsZW1lbnRNYWtlID0gKHRhZywgcGFyZW50T3JTaWJsLCBpbnNlcnRMb2NhdGlvbiwgYXR0cnMpID0+IHtcbiAgICBcbiAgICB2YXIgaWQ7XG4gICAgdmFyIGF0dHJLZXlzID0gT2JqZWN0LmtleXMgKGF0dHJzKTtcbiAgICB2YXIgaGFzQXR0cnMgPSBhdHRyS2V5cy5sZW5ndGggPiAwO1xuXG4gICAgaWYgKGhhc0F0dHJzICYmIGF0dHJzLmhhc093blByb3BlcnR5ICgnaWQnKSkge1xuXG4gICAgICAgIGlkID0gYXR0cnMuaWQ7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAgIGlkID0gUC5nZW5JZCAoKTtcblxuICAgIH0gLy8gZW5kIGlmIChoYXNBdHRycylcbiAgICBcbiAgICB2YXIgSWQgPSAnIycgKyBpZDtcbiAgICBcbiAgICB2YXIgZGl2ZWwgPSAnPCcgKyB0YWcgKyAnIGlkPVwiJyArIGlkICsgJ1wiJztcblxuICAgIHZhciB0YWd0eXBlID0gXy5nZXRUYWdUeXBlICh0YWcpO1xuXG4gICAgaWYgKHRhZ3R5cGUgPT0gMSkge1xuXG4gICAgICAgIGRpdmVsICs9ICc+JztcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgZGl2ZWwgKz0gJz48LycgKyB0YWcgKyAnPic7XG5cbiAgICB9IC8vIGVuZCBpZiAodGFndHlwZSA9PSAxKVxuXG4gICAgJChwYXJlbnRPclNpYmwpW2luc2VydExvY2F0aW9uXSAoZGl2ZWwpO1xuICAgIFxuICAgIGlmIChoYXNBdHRycykge1xuICAgICAgICBcbiAgICAgICAgJChJZClcbiAgICAgICAgLmF0dHIgKGF0dHJzKTtcblxuICAgIH0gLy8gZW5kIGlmIChoYXNBdHRycylcbiAgICBcbiAgICByZXR1cm4gSWQ7XG5cbn07IC8vIGVuZCBfLmVsZW1lbnRNYWtlXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5fLmdldFRhZ1R5cGUgPSAodGFnKSA9PiB7XG5cbiAgICAgICAgLy8gMSA9PiB2b2lkIGVsZW1lbnRzLCAyID0+IGhhcyBjb250ZW50XG4gICAgdmFyIHRhZ3MgPSB7IGFyZWE6IDEsIGJhc2U6IDEsIGJyOiAxLCBjb2w6IDEsIGVtYmVkOiAxLCBocjogMSwgaW1nOiAxLCBpbnB1dDogMSwga2V5Z2VuOiAxLCBsaW5rOiAxLCBtZXRhOiAxLCBwYXJhbTogMSwgc291cmNlOiAxLCB0cmFjazogMSwgd2JyOiAxLCBhOiAyLCBhYmJyOiAyLCBhZGRyZXNzOiAyLCBhcnRpY2xlOiAyLCBhc2lkZTogMiwgYXVkaW86IDIsIGI6IDIsIGJkaTogMiwgYmRvOiAyLCBibG9ja3F1b3RlOiAyLCBib2R5OiAyLCBidXR0b246IDIsIGNhbnZhczogMiwgY2FwdGlvbjogMiwgY2l0ZTogMiwgY29kZTogMiwgY29sZ3JvdXA6IDIsIGRhdGFsaXN0OiAyLCBkZDogMiwgZGVsOiAyLCBkZXRhaWxzOiAyLCBkZm46IDIsIGRpYWxvZzogMiwgZGl2OiAyLCBkbDogMiwgZHQ6IDIsIGVtOiAyLCBmaWVsZHNldDogMiwgZmlnY2FwdGlvbjogMiwgZmlndXJlOiAyLCBmb290ZXI6IDIsIGZvcm06IDIsIGgxOiAyLCBoMjogMiwgaDM6IDIsIGg0OiAyLCBoNTogMiwgaDY6IDIsIGhlYWQ6IDIsIGhlYWRlcjogMiwgaGdyb3VwOiAyLCBodG1sOiAyLCBpOiAyLCBpZnJhbWU6IDIsIGluczogMiwga2JkOiAyLCBsYWJlbDogMiwgbGVnZW5kOiAyLCBsaTogMiwgbWFwOiAyLCBtYXJrOiAyLCBtZW51OiAyLCBtZXRlcjogMiwgbmF2OiAyLCBub3NjcmlwdDogMiwgb2JqZWN0OiAyLCBvbDogMiwgb3B0Z3JvdXA6IDIsIG9wdGlvbjogMiwgb3V0cHV0OiAyLCBwOiAyLCBwcmU6IDIsIHByb2dyZXNzOiAyLCBxOiAyLCBycDogMiwgcnQ6IDIsIHJ1Ynk6IDIsIHM6IDIsIHNhbXA6IDIsIHNjcmlwdDogMiwgc2VjdGlvbjogMiwgc2VsZWN0OiAyLCBzbWFsbDogMiwgc3BhbjogMiwgc3Ryb25nOiAyLCBzdHlsZTogMiwgc3ViOiAyLCBzdW1tYXJ5OiAyLCBzdXA6IDIsIHN2ZzogMiwgdGFibGU6IDIsIHRib2R5OiAyLCB0ZDogMiwgdGV4dGFyZWE6IDIsIHRmb290OiAyLCB0aDogMiwgdGhlYWQ6IDIsIHRpbWU6IDIsIHRpdGxlOiAyLCB0cjogMiwgdTogMiwgdWw6IDIsICd2YXInOiAyLCB2aWRlbzogMn07XG5cbiAgICB0YWdzLnRleHQgPSAxOyAgLy8gc3BlY2lhbCB0YWc6ICB1c2VzIF8ubWFrZVRleHQgKClcbiAgICBcbiAgICByZXR1cm4gdGFncy5oYXNPd25Qcm9wZXJ0eSh0YWcpID8gdGFncyBbdGFnXSA6IDA7XG5cbn07IC8vIGVuZCBfLmdldFRhZ1R5cGUgXG5cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbl8udGV4dE1ha2UgPSAocGFyZW50LCBwcmltaXRpdmUsIGxvY2F0aW9uKSA9PiB7XG4gICAgXG4gICAgaWYgKHR5cGVvZiBwcmltaXRpdmUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgc2luZ2xlcXVvdGUgPSAnJiN4MDAyNzsnO1xuICAgICAgICB2YXIgYmFja3NsYXNoID0gJyYjeDAwNWM7JztcbiAgICAgICAgdmFyIGRvdWJsZXF1b3RlID0gJyYjeDAwMjI7JztcbiAgICAgICAgdmFyIGx0ID0gJyZsdDsnO1xuICAgICAgICBcbiAgICAgICAgcHJpbWl0aXZlID0gcHJpbWl0aXZlLnJlcGxhY2UgKC8nL2csIHNpbmdsZXF1b3RlKTtcbiAgICAgICAgcHJpbWl0aXZlID0gcHJpbWl0aXZlLnJlcGxhY2UgKC9cIi9nLCBkb3VibGVxdW90ZSk7XG4gICAgICAgIHByaW1pdGl2ZSA9IHByaW1pdGl2ZS5yZXBsYWNlICgvXFxcXC9nLCBiYWNrc2xhc2gpO1xuICAgICAgICBwcmltaXRpdmUgPSBwcmltaXRpdmUucmVwbGFjZSAoLzwvZywgbHQpO1xuXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcHJpbWl0aXZlID09PSAnc3ltYm9sJykge1xuXG4gICAgICAgIHByaW1pdGl2ZSA9ICdzeW1ib2wnO1xuICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIHN0cmluZ2lmeSB3b3VsZCBwcm9kdWNlICd7fScgd2hpY2ggaXMgbGVzcyB1c2VmdWxcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgcHJpbWl0aXZlID0gSlNPTi5zdHJpbmdpZnkgKHByaW1pdGl2ZSk7XG5cbiAgICB9IC8vIGVuZCBpZiAodHlwZW9mIHByaW1pdGl2ZSA9PT0gJ3N0cmluZycpXG4gICAgXG5cbiAgICAkKHBhcmVudCkgW2xvY2F0aW9uXSAocHJpbWl0aXZlKTtcblxuICAgIHJldHVybiBudWxsO1xuICAgICAgICAvLyB0ZXh0IG9icyBoYXZlIG5vIGlkJ3M6IG9ubHkgdGV4dCBpcyBhcHBlbmRlZCB3aXRoIG5vIHdheSB0byBhZGRyZXNzIGl0XG4gICAgICAgIC8vIGlmIGFkZHJlc3NpbmcgaXMgbmVjZXNzYXJ5LCB1c2Ugc3BhbiBpbnN0ZWFkIG9mIHRleHRcblxufTsgLy8gZW5kIF8udGV4dE1ha2UgXG5cblxuXG4vLyBQVUJMSUMgUHJvcGVydGllcy9NZXRob2RzXG52YXIgUCA9IHt9O1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuUC5kaXNwbGF5UGFnZSA9IChkaXNwT2IpID0+IHtcbiAgICBcbiAgICB2YXIgcGFyZW50ID0gZGlzcE9iLmhhc093blByb3BlcnR5ICgncGFyZW50JykgPyBkaXNwT2IucGFyZW50IDogJ2JvZHknO1xuICAgICAgICAvLyBpZiBwYXJlbnQgbm90IGZvdW5kLCBhcHBlbmQgdG8gYm9keVxuXG4gICAgdmFyIElkID0gXy5kaXNwbGF5UGFnZUggKHBhcmVudCwgZGlzcE9iKTtcblxuICAgIHJldHVybiBJZDtcblxufTsgLy8gZW5kIFAuZGlzcGxheVBhZ2UgXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5QLmdlbklkID0gKCkgPT4ge1xuXG4gICAgdmFyIGlkID0gJ2knICsgXy5pZCsrO1xuICAgIHJldHVybiBpZDtcblxufTsgLy8gZW5kIFAuZ2VuSWRcblxuXG4vLyBlbmQgUFVCTElDIHNlY3Rpb25cblxucmV0dXJuIFA7XG5cbn0oKSk7XG5cblxuXG4iLCJcbi8vIHRlc3QuanNcblxuKGZ1bmN0aW9uICgpIHtcblxuICAgICQoZG9jdW1lbnQpXG4gICAgLnJlYWR5IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkcHAgPSByZXF1aXJlICgnZ28tanNvbjJodG1sJykuZGlzcGxheVBhZ2U7XG5cbiAgICAgICAgZHBwICh7XG4gICAgICAgICAgICBzcGFuOiB7bGFiZWw6ICd0ZXN0IGdvLWpzb24yaHRtbCd9LCBcbiAgICAgICAgICAgIHN0eWxlOiBcImJvcmRlcjogMXB4IHNvbGlkIGJsdWU7XCIgK1xuICAgICAgICAgICAgICAgIFwiYm9yZGVyLXJhZGl1czogNHB4O1wiICtcbiAgICAgICAgICAgICAgICBcImJhY2tncm91bmQtY29sb3I6ICNjY2ZmY2M7XCJcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZHBwICh7YnI6IDB9KTtcbiAgICAgICAgZHBwIChcInBsYWluIHRleHRcIik7XG5cbiAgICB9KTtcblxufSkgKCk7XG4iXX0=
