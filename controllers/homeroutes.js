const router = require("express").Router();
const { User, Subscription } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    const userData = await User.findAll();
    const users = userData.map((user) => user.get({ plain: true }));
    res.render("login", {
      users,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/profile", withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Subscription }],
    });
    const user = userData.get({ plain: true });
    user.subscriptions = user.subscriptions.map((subscription) => {
      return {
        ...subscription,
        pay_date: subscription.pay_date
          .toString()
          .split(" ")
          .splice(0, 4)
          .join(" "),
      };
    });
    res.render("profile", {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/profile");
    return;
  }
  res.render("login");
});

router.get("/prices", async (req, res) => {
  // Use subscription model to get data from database
  let mSubscriptions = await Subscription.findAll({
    where: {
      user_id: req.session.user_id,
      pay_period: "monthly",
    },
  });

  let ySubscriptions = await Subscription.findAll({
    where: {
      user_id: req.session.user_id,
      pay_period: "yearly",
    },
  });

  var monthlySubscriptionData = new Array();
  var yearlySubscriptionData = new Array();

  for (index of mSubscriptions) {
    monthlySubscriptionData.push({
      label: index.service_name,
      price: index.price,
    });
  }

  for (index2 of ySubscriptions) {
    yearlySubscriptionData.push({
      label: index2.service_name,
      price: index2.price,
    });
  }

  // This requires a json made from the subscription model that fetches the name and price of each one
  return res.json({
    monthly: monthlySubscriptionData,
    yearly: yearlySubscriptionData
  });
});

router.get("/events", async (req, res) => {
  // Use subscription model to get data from database
  const subscriptions = await Subscription.findAll({
    where: {
      user_id: req.session.user_id,
    },
  });

  var subscriptionData = new Array();

  for (index of subscriptions) {
    subscriptionData.push({
      title: index.service_name,
      start: index.pay_date,
    });
  }

  // give data back as response so calanedar.js can fill up the events
  return res.json({
    data: subscriptionData,
  });
});

module.exports = router;


let a = 1;

a = a;