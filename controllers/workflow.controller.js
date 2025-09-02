import dayjs from "dayjs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
//the above lines will help us to import upstash workflow
const { serve } = require("@upstash/workflow/express");

import Subscription from "../models/subscription.model.js";

const REMINDERS = [7, 5, 2, 1];

export const sendRemainders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") return; //meaning exit out of this function

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`
    );
    return;
  }
  for (const daysBefore of REMINDERS) {
    const remainderDate = renewalDate.subtract(daysBefore, "day");
    //example: renewal 22 feb 2023 , daysBefore = 7 , remainderDate = 15 feb 2023
    if (remainderDate.isAfter(dayjs())) {
      await sleepUntilRemainder(
        context,
        `Reminder ${daysBefore} days before`,
        remainderDate
      );
    }
    await triggerRemainder(context, `Reminder ${daysBefore} days before`);
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", () => {
    return Subscription.findById(subscriptionId).populate("user", "name email");
  });
};

const sleepUntilRemainder = async (context, label, date) => {
  console.log(`Sleeping until ${label} remainder at ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerRemainder = async (context, label) => {
  return await context.run(label, () => {
    console.log(`Triggering ${label} reminder`);
    //later on we can send an email, sms , push notification etc
  });
};
