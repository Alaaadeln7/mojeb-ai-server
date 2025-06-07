import asyncHandler from "../middlewares/asyncHandler.js";
export const makeSubscription = asyncHandler(async (req, res) => {
  const { userId, planId } = req.body;
  const existingSubscription = await Subscribe.find({
    user: userId,
  });
  if (existingSubscription) {
    return responseHandler(res, 400, "You already have a subscription");
  }
  const subscription = new Subscribe({ user: userId, plan: planId });
  await subscription.save();
  return responseHandler(res, 200, "Subscription created successfully");
});
export const cancelSubscription = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  await Subscribe.findOneAndDelete({ user: userId });
  return responseHandler(res, 200, "Subscription cancelled successfully");
});
