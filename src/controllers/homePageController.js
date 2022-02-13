require("dotenv").config();
import request from "request";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let getHomePage = (req, res) => {
  return res.render("homepage.ejs");
};
let getFacebookUserProfile = (req, res) => {
  return res.render("profile.ejs");
};
let setUpUserFacebook = (req, res) => {
  let data = {
    "get_started":{
    "payload":"GET_STARTED"
    },
    "persistent_menu": [
        {
            "locale": "default",
            "composer_input_disabled": false,
            "call_to_actions": [
                {
                    "type": "postback",
                    "title": "Talk to an agent",
                    "payload": "CARE_HELP"
                },
                {
                    "type": "postback",
                    "title": "Outfit suggestions",
                    "payload": "CURATION"
                },
                {
                    "type": "web_url",
                    "title": "Shop now",
                    "url": "https://www.originalcoastclothing.com/",
                    "webview_height_ratio": "full"
                }
            ]
        }
    ]
  };
  request({
    "uri": "https://graph.facebook.com/v7.0/me/messenger_profile",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": data
  }, (err, res, body) => {
    if (!err) {
      return res.status(200).json({
        "message":"Configuration réussie"
      })
    } else {
      return res.status(500).json({
        "message":"Erreur de configuration"
      })
    }
  });

  return res.status(200).json({
    message: "OK"
  });
};
module.exports ={
  getHomePage: getHomePage,
  getFacebookUserProfile: getFacebookUserProfile,
  setUpUserFacebook: setUpUserFacebook
};
