import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";
import { SERVER_URL } from "../config/env.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id, //Because we want to know which user created this subscription
    });

    await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/subscription/reminder`,
    });

    res.status(201).json({ success: true, data: subscription });
  } catch (e) {
    next(e);
  }
};

export const getSubscriptions = async (req, res, next) => {
  try {
    //check if the users is the same as the one in the token
    if (req.user.id !== req.params.id) {
      const error = new Error("You are not the owner of this account");
      error.status = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });
    res.status(200).json({ success: true, data: subscriptions });
  } catch (e) {
    next(e);
  }
};
