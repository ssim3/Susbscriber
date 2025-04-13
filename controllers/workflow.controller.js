import { serve } from "@upstash/workflow/express";
import Subscription from "../models/subscription.model";
import dayjs from "dayjs";

const reminders = [ 7, 5, 2, 1 ]

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") return;

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping Workflow`);
  }

  for (const daysBefore of reminders) {
    const reminderDate = renewalDate.subtract(daysBefore, 'day');

    if (reminderDate.isAfter(dayjs())) {

    }
  }

})

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
}

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription', () => {
    return Subscription.findById(subscriptionId).populate('user', 'name email');
  })
}