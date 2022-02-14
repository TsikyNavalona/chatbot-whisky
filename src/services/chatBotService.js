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
        let first_response = {"text": `Hey ${username} 👋. Bienvenue  sur le Chatbot de Whisky Mada Corp 🥃 !`}
        let second_response = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "Whisky Mada Corp",
                "subtitle": "Nous proposons des Whiskys importés à des prix imbattables,",
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
                //"subtitle": "Nous sommes heureux de vous proposer une large gamme de nos vins et nos spiritueux,",
                "image_url": "https://i.ibb.co/44CgjLh/whisky-mine.jpg",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "En savoir plus",
                    "payload": "LIST_WHISKY",
                  },
                ],
              },
              {
                "title": "Nous contacter",
                "image_url": "https://checkrz.com/wp-content/uploads/2020/07/contact-us_540x_f09f05db-24f8-4f55-9f0c-4277ed2adb92.jpg",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "En savoir plus",
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

let sendListWhisky = (sender_psid) => {
  return new Promise( async(resolve, reject) => {
    try{
      let response = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
              {
                "title": "Johnnie Walker Red Label",
                //"subtitle": "Nous sommes heureux de vous proposer une large gamme de nos vins et nos spiritueux,",
                "image_url": "https://i.ibb.co/Q9k9Nfv/red.jpg",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Acheter",
                    "payload": "A_RED_LABEL",
                  },
                  {
                    "type": "postback",
                    "title": "Details",
                    "payload": "D_RED_LABEL",
                  },
                ],
              },
              {
                "title": "Jack Daniel's OLD NO. 7",
                "image_url": "https://i.ibb.co/Ypg5pf6/jackda.jpg",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Acheter",
                    "payload": "A_JACK_DA",
                  },
                  {
                    "type": "postback",
                    "title": "Details",
                    "payload": "D_JACK_DA",
                  },
                ],
              },
              {
                "title": "Johnnie Walker Black Label",
                "image_url": "https://i.ibb.co/5G16hXG/black.jpg",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Acheter",
                    "payload": "A_BLACK_LABEL",
                  },
                  {
                    "type": "postback",
                    "title": "Details",
                    "payload": "D_BLACK_LABEL",
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

let sendDetailWhisky = (sender_psid, idWhisky) => {
  return new Promise( async(resolve, reject) => {
    try{
      if(idWhisky===1){
        let image_response = {
          "attachment": {
            "type": "image",
            "payload": {
                "url":"https://i.ibb.co/Q9k9Nfv/red.jpg"
            }
          }
        }
        let descr_response = {"text": `Johnnie Walker Red Label 1L. Avec environ 85 millions de bouteilles commercialisées en 1999, ce blend est le whisky le plus vendu à travers le monde. De couleur orangée, le Red Label possède un nez dominé par une douceur maltée. La bouche est sèche avec une trace de tourbe. La finale de longueur moyenne est douce amère. Le Red Label est une valeur sûre.`}
        let prix_response = {"text": `160.000 Ariary`}

        await sendMessage(sender_psid,image_response);
        await sendMessage(sender_psid,descr_response);
        await sendMessage(sender_psid,prix_response);
      }else if(idWhisky===2){
        let image_response = {
          "attachment": {
            "type": "image",
            "payload": {
                "url":"https://i.ibb.co/Ypg5pf6/jackda.jpg"
            }
          }
        }
        let descr_response = {"text": `Jack Daniel's OLD NO. 7 1L. L'incontournable Jack Daniel's est un whiskey du Tennessee et non un bourbon (Kentucky) : en effet, après distillation, le whisky est filtré par une couche de charbon de bois d'érable de 3 mètres avant sa mise en fût. `}
        let prix_response = {"text": `210.000 Ariary`}

        await sendMessage(sender_psid,image_response);
        await sendMessage(sender_psid,descr_response);
        await sendMessage(sender_psid,prix_response);
      }
      else if(idWhisky===3){
        let image_response = {
          "attachment": {
            "type": "image",
            "payload": {
                "url":"https://i.ibb.co/5G16hXG/black.jpg"
            }
          }
        }
        let descr_response = {"text": `Johnnie Walker Black Label 1L. Il est le scotch whisky 12 ans d'âge le plus vendu au monde. Un whisky intense d'une rare complexité qui révèle de nouveaux arômes à chaque dégustation. `}
        let prix_response = {"text": `250.000 Ariary`}

        await sendMessage(sender_psid,image_response);
        await sendMessage(sender_psid,descr_response);
        await sendMessage(sender_psid,prix_response);
      }

      resolve("done");
    }catch(e){
      reject(e)
    }
  });
};

let sendContact = (sender_psid) => {


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
    sendMainMenu: sendMainMenu,
    sendListWhisky: sendListWhisky,
    sendContact: sendContact,
    sendDetailWhisky: sendDetailWhisky
};
