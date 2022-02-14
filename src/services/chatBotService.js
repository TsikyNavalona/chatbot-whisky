require("dotenv").config();
import request from "request";

const MY_VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let getFacebookUsername = (sender_psid) => {
    return new Promise((resolve, reject) => {
        // Send the HTTP request to the Messenger Platform
        let uri = `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`;
        request({
            "uri": uri,
            "method": "GET",
        }, (err, res, body) => {
            if (!err) {
                //convert string to json object
                body = JSON.parse(body);
                let username = `${body.first_name} ${body.last_name}`;
                resolve(username);
            } else {
                reject("Unable to send message:" + err);
            }
        });
    });
};

let sendResponseWelcomeNewCustomer = (username, sender_psid) => {
    return new Promise( async(resolve, reject) => {
      try{
        let first_response = {"text": `Hey ${username}. Bienvenue  sur le Chatbot de Whisky Mada Corp!`}
        let second_response = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "Whisky Mada Corp",
                "subtitle": "Nous proposons des Whiskys importés à des prix defiant toute concurrence,",
                "image_url": "https://i.ibb.co/CW4JBYQ/img-whisky.jpg",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Menu principal",
                    "payload": "MENU",
                  },

                ],
              }]
            }
          }
        }
        await sendMessage(sender_psid,first_response);
        await sendMessage(sender_psid,second_response);
        resolve("done");
      }catch(e){
        reject(e)
      }
    });
};

let sendMainMenu = (sender_psid) => {
  return new Promise( async(resolve, reject) => {
    try{
      let response = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
              {
                "title": "Nos produits",
                "subtitle": "Nous sommes heureux de vous proposer une large gamme de nos vins et nos spiritueux,"
                "image_url": "https://i.ibb.co/CW4JBYQ/img-whisky.jpg",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Voir les produits",
                    "payload": "LIST_WHISKY",
                  },
                ],
              },
              {

                "image_url": "https://checkrz.com/wp-content/uploads/2020/07/contact-us_540x_f09f05db-24f8-4f55-9f0c-4277ed2adb92.jpg",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Nous Contacter",
                    "payload": "CONTACT",
                  },
                ],
              }
            ]
          }
        }
      }
      await sendMessage(sender_psid,response);
      resolve("done");
    }catch(e){
      reject(e)
    }
  });
};

let sendMessage = (sender_psid, response) =>{
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v7.0/me/messages",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
};

module.exports = {
    getFacebookUsername: getFacebookUsername,
    sendResponseWelcomeNewCustomer: sendResponseWelcomeNewCustomer,
    sendMainMenu: sendMainMenu
};
