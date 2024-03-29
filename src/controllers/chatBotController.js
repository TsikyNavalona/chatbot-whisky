require("dotenv").config();
import request from "request";
import chatBotService from "../services/chatBotService";

const MY_VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
let test = (req,res) =>{
  return res.send("hello ono");
}

let getWebhook =(req,res) =>{
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = MY_VERIFY_TOKEN;

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
}

let postWebhook =(req,res) =>{

  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);


        // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
     }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

}
// Handles messages events
//function handleMessage(sender_psid, received_message) {
let handleMessage = async (sender_psid, received_message) => {
  let response;

  if(received_message && received_message.quick_reply && received_message.quick_reply.payload){
    if(received_message.quick_reply.payload ==="MENU"){
      await chatBotService.sendMainMenu(sender_psid);
    }
    else if(received_message.quick_reply.payload ==="LIST_WHISKY"){
      await chatBotService.sendListWhisky(sender_psid);
    }else if(received_message.quick_reply.payload ==="DET_ACH_RL"){
      await chatBotService.sendAchatWhisky(sender_psid,1);
    }else if(received_message.quick_reply.payload ==="DET_ACH_JD"){
      await chatBotService.sendAchatWhisky(sender_psid,2);
    }else if(received_message.quick_reply.payload ==="DET_ACH_BL"){
      await chatBotService.sendAchatWhisky(sender_psid,3);
    }

    return;
  }

  // Check if the message contains text
  if (received_message.text) {
    let username = await chatBotService.getFacebookUsername(sender_psid);
    await chatBotService.sendResponseWelcomeNewCustomer(username,sender_psid);
  }
  else if (received_message.attachments) {

    // Gets the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
    }
  }

  // Sends the response message
  callSendAPI(sender_psid, response);
};

// Handles messaging_postbacks events
let handlePostback = async (sender_psid, received_postback) => {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  switch(payload){
    case "GET_STARTED":
      let username = await chatBotService.getFacebookUsername(sender_psid);
      await chatBotService.sendResponseWelcomeNewCustomer(username,sender_psid);
      //response = { "text": `Hey ${username} Bienvenue  sur le Chatbot de Whisky Mada Corp`};
      break;
    case "MENU":
      await chatBotService.sendMainMenu(sender_psid);
      break;
    case "LIST_WHISKY":
      await chatBotService.sendListWhisky(sender_psid);
      break;
    case "CONTACT":
      await chatBotService.sendContact(sender_psid);
      break;
    case "D_RED_LABEL":
      await chatBotService.sendDetailWhisky(sender_psid,1);
      break;
    case "D_JACK_DA":
      await chatBotService.sendDetailWhisky(sender_psid,2);
      break;
    case "D_BLACK_LABEL":
      await chatBotService.sendDetailWhisky(sender_psid,3);
      break;
    case "A_RED_LABEL":
      await chatBotService.sendAchatWhisky(sender_psid,1);
      break;
    case "A_JACK_DA":
      await chatBotService.sendAchatWhisky(sender_psid,2);
      break;
    case "A_BLACK_LABEL":
      await chatBotService.sendAchatWhisky(sender_psid,3);
      break;
    default :
      console.log("erreur");
  }
  // Send the message to acknowledge the postback
  //callSendAPI(sender_psid, response);
};

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
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
}


module.exports = {
  test: test,
  getWebhook: getWebhook,
  postWebhook: postWebhook
}
//curl -X GET "localhost:8080/webhook?hub.verify_token=whiskytoken&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"
