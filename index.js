"use strict";

const express = require("express");
const bodyParser = require("body-parser");
var http = require('http');
var request = require('request');
var session = require('express-session');
var csrfToken;
const restService = express();

const App = require('actions-on-google').DialogflowApp;
var slack_message;

//var url = "http://208.85.249.174:8000/sap/opu/odata/CRVWM/WMS_SRV";
var url = "http://208.85.249.174:8000/sap/opu/odata/CRVWM/WMS_SRV/";

var d = '1140';
var i = 0;
var obj = [];
restService.use(
  bodyParser.urlencoded({
      extended: true
  })
);

restService.use(bodyParser.json());
//restService.use(session({ secret: 'ssshhhhh' }));
//var sess;


restService.post("/slack-test", function (req, res) {
    var actionName =
     req.body.result &&
     req.body.result.action
       ? req.body.result.action
       : "wrong";

    var val =
      req.body.result &&
      req.body.result.parameters &&
      req.body.result.parameters.optionkey
        ? req.body.result.parameters.optionkey
        : "xx";
  
      
  
    const app = new App({ request: req, response: res });
  
 
  
    //sess = req.session;

    if (val == "start" || val == "Start") {

        //   sess.name ="Napo";
        request({
            //url: url + "/TOItemDetailsSet?$filter=ToNum eq('" + d + "')&$format=json",
            url: url + "ListOpenTOSet?$filter=UserId eq 'SAPUSER' and TorderFrom eq '' and TorderTo eq '' and DelvFrom eq '' and DelvTo eq'' and SoFrom eq '' and SoTo eq '' and Material eq '' &sap-client=900&sap-language=EN&$format=json",
            headers: {
                "Authorization": "Basic <<base64 encoded sapuser:crave123>>",
                "Content-Type": "application/json",
                "x-csrf-token": "Fetch"
            }

        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                csrfToken = response.headers['x-csrf-token'];
                // console.log(csrfToken);
                // var gwResponse = body.asString();
                // var JSONObj = JSON.parse(body);
                var c = JSON.parse(body)
                //var a = res.json(body);
                var len = c.d.results.length;
                //var a = JSON.stringify(a);

                var botResponse;

                if (c.d.results.length > 0) {
                    // botResponse = "Your latest Purchase orders are: ";

                    for (; i < c.d.results.length; i++) {
                        // botResponse += " ";
                        botResponse = {

                            'optionInfo': { 'key': c.d.results[i].ToNum },
                            'title': c.d.results[i].ToNum

                        }
                        obj.push(botResponse);
                    }
                } else {
                    botResponse = "You do not seem to have any active Purchase Orders!";
                }
                var slack_message = {

                    expect_user_response: true,
                    rich_response: {
                        items: [
                              {
                                  simpleResponse: {
                                      textToSpeech: val
                                  }
                              }
                        ],
                        suggestions: [
                            {
                                title: "List"
                            },
                            {
                                title: "Carousel"
                            },
                            {
                                title: "Suggestions"
                            }
                        ]


                    },

                    systemIntent: {
                        intent: "actions.intent.OPTION",
                        data: {
                            "@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
                            listSelect: {
                                title: "Select the order",
                                items: obj
                            }
                        }
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

                //console.log(JSON.stringify(obj));
            }
        });
    }

    else if (actionName == "actions_intent_OPTION") {
        var param = app.getArgument('OPTION');
      var input = app.getRawInput();
     
    
      
      
        if (input == "Yes") {
        var z = app.getContextArgument('c_option', 'key');
           var tempContext = app.getContext('c_option');
    var originalTemp = tempContext.parameters.listkey.original;
        //const number = app.getContextArgument(OUT_CONTEXT, NUMBER_ARG);
         var slack_message = {

        expect_user_response: true,
        rich_response: {
        items: [
                      {
        simpleResponse: {
            textToSpeech: originalTemp+"Enterred input"
    }
    }
    ]
    }
    }
        return res.json({
            speech: "",
            displayText: "",

            source: "webhook-echo-sample",

            data: {
                google: slack_message
            }



        });
    }

       
            // var name1 = sess.name;
      
      else{
               //var z = app.getContextArgument(c_option, optionkey);

     
            request({
                url: url + "/TOItemDetailsSet?$filter=ToNum eq('" + param + "')&$format=json",
                //  url: url + "ListOpenTOSet?$filter=UserId eq 'SAPUSER' and TorderFrom eq '' and TorderTo eq '' and DelvFrom eq '' and DelvTo eq'' and SoFrom eq '' and SoTo eq '' and Material eq '' &sap-client=900&sap-language=EN&$format=json",
                headers: {
                    "Authorization": "Basic <<base64 encoded sapuser:crave123>>",
                    "Content-Type": "application/json",
                    "x-csrf-token": "Fetch"
                }

            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    csrfToken = response.headers['x-csrf-token'];
                    // console.log(csrfToken);
                    // var gwResponse = body.asString();
                    // var JSONObj = JSON.parse(body);
                    var c = JSON.parse(body)
                    //var a = res.json(body);
                    var len = c.d.results.length;
                    //var a = JSON.stringify(a);

                    var botResponse = c.d.results[0].MatDesc;

                    var tmsg = "Order number " + c.d.results[0].ToNum + " has material sample-" + c.d.results[0].MatDesc + "with " + c.d.results[0].Qty + " Quantity to pick from storage location " + c.d.results[0].StrLoc + ". Do you want to confirm the pick up for order number " + c.d.results[0].ToNum + ". ";

                    var slack_message = {

                        expect_user_response: true,
                        rich_response:
                        {
                            items:
                            [
                              {
                                  simpleResponse:
                                  {
                                      textToSpeech:tmsg
                                  }
                              }


                            ],
                            suggestions:
                            [
                              {
                                  title: "Yes"
                              },
                              {
                                  title: "No"
                              }
                            ]

                        }

                    };


                    return res.json({
                        speech: "",
                        displayText: "",

                        source: "webhook-echo-sample",
                        contextOut: [ {
    name: "c_option",
    lifespan: "5",
    parameters: {
      listkey: "Something foothy"
     
    }
  }
                        ],
                        data: {
                            google: slack_message
                        }



                    });

                    //console.log(JSON.stringify(obj));
                }
            });

      }


    }

   
    else {

        var slack_message = {

            expect_user_response: true,
            rich_response: {
                items: [
                      {
                          simpleResponse: {
                              textToSpeech: "bye"
                          }
                      }
                ]
            }
        }
        return res.json({
            speech: "",
            displayText: "",

            source: "webhook-echo-sample",

            data: {
                google: slack_message
            }



        });


    }





});


restService.listen(process.env.PORT || 8000, function () {
    console.log("Server up and listening");
});
