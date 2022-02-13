import express from "express";
import chatBotController from "../controllers/chatBotController";
import homePageController from "../controllers/homePageController";
let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/",homePageController.getHomePage);
  router.get("/webhook",chatBotController.getWebhook);
  router.post("/webhook",chatBotController.postWebhook);
  router.get("/profile",homePageController.getFacebookUserProfile);
  router.post("/set-up-user-fb-profile",homePageController.setUpUserFacebook);
  return app.use("/",router);
};

module.exports = initWebRoutes;
