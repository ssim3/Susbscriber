import Subscription from "../models/subscription.model.js"

export const createSubscription = async (req, res, next) => {
  
  try {

    const subscription = await Subscription.create({
      ...req.body,
      user : req.user._id,
    });

    res.status(201).json({ success : true, data : subscription });

  } catch (error) {
    next(error)
  }

}

export const getUserSubscriptions = async (req, res, next) => {

  try {

    // Ensure that Request and Token user is the same
    if (req.user.id != req.params.id) {
      const error = new Error('Unauthorized!');
      error.status = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });
    res.status(200).json({ status: 200, data: subscriptions });

  } catch (error) {
    next(error);
  }

}

export const updateSubscription = async (req, res, next) => {

  try {

    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      const error = new Error("Subscription not found!");
      error.status = 404;
      throw error;      
    }

    if (req.user.id != subscription.user) {
      const error = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }

    await subscription.updateOne({ ...req.body });
    res.status(200).json({ status: 200, data: subscription });

  } catch (error) {
    next(error);
  }

}
