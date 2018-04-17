"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const restService = express();

const App = require('actions-on-google').DialogflowApp;


var obj = [];
var myObj = [];
var a;
var i = 0;

restService.use(
  bodyParser.urlencoded({
      extended: true
  })
);

restService.use(bodyParser.json());


restService.post("/slack-test", function (req, res) {
const app = new App({ request: req, response: res });

    //const app = new App({req, res});

    //const param = app.getContextArgument('actions_intent_option',
    // 'OPTION').value;

    var speech =
      req.body.result &&
      req.body.result.action
        ? req.body.result.action
        : "wrong";


    //var key=JSON.stringify(req.body);

    var speech11 =
      req.body.result &&
      req.body.result.parameters &&
      req.body.result.parameters.key
        ? req.body.result.parameters.key
        : "xx";

    var myObj = [
{
    'CustomerID': "ALFKI",
    'CompanyName': "Alfreds Futterkiste",
    'ContactName': "Maria Anders"


},
{
    'CustomerID': "ANATR",
    'CompanyName': "Ana Trujillo Emparedados y helados",
    'ContactName': "Ana Trujillo"

}];

    for (; i < myObj.length; i++) {

        var tmp = {
            'optionInfo': { 'key': myObj[i].CustomerID },
            'title': myObj[i].CompanyName,
            'description': myObj[i].ContactName
        };

        obj.push(tmp);

    }
	
	    if (speech == "actions_intent_OPTION") {
        var param = app.getArgument('OPTION');
	var input=app.getRawInput();
    }
    else {
        var param = "hi";
	  var input="bye";
    }

   var slack_message={
  
  expect_user_response: true,
  rich_response: {
  items: [
    {
      simpleResponse: {
          textToSpeech:"This is the first simple response for a basic card"
      }
    },
    {
      basicCard: {
        title:"Title: this is a title",
        formattedText:"This is a basic card.  Text in a\n      basic card can include \"quotes\" and most other unicode characters\n      including emoji ??.  Basic cards also support some markdown\n      formatting like *emphasis* or _italics_, **strong** or __bold__,\n      and ***bold itallic*** or ___strong emphasis___ as well as other things\n      like line  \nbreaks",
        subtitle:
        "This is a subtitle",
        image: {
          url:"https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
          accessibilityText:"Image alternate text"
        },
        buttons: [
          {
            title:"This is a button",
            openUrlAction:{
              url:"https://assistant.google.com/"
            }
          }
        ]
      }
    },
    {
      simpleResponse: {
        textToSpeech:"This is the 2nd simple response ",
        displayText:"This is the 2nd simple response"
      }
    }
  ],
  suggestions:
  [
    {"title":"Basic Card"},
    {"title":"List"},
    {"title":"Carousel"},
    {"title":"Suggestions"}
  ]
}

    };

    return res.json({
        speech: "",
        displayText: "",

        source: "webhook-echo-sample",

        data: {
            google: slack_message
        }



    });




});



restService.listen(process.env.PORT || 8000, function () {
    console.log("Server up and listening");
});
