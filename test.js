#!/usr/bin/node
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
