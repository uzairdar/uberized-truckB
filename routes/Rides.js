const router = require("express").Router();
let Rides = require("../models/Rides.model");
router.route("/").get((req, res) => {
  Rides.find()
    .then((rides) => {
      return res.json({ rides });
    })
    .catch((error) => {
      return res.json({ error });
    });
});
router.route("/addRide").post((req, res) => {
  const { uid } = req.params;
  const { pickup, destination, distance, amount, driver, client } = req.body;
  const newrRide = new Rides({
    pickup,
    destination,
    distance,
    amount,
    driver,
    client,
  });
  newRide
    .save()
    .then((rides) => {
      if (rides) {
        return res.json({ rides, message: "ride added successfully" });
      } else {
        return res.json({ message: "ride not added" });
      }
    })
    .catch((error) => {
      return res.json({ error });
    });
  // console.log("data", uid, data, req.body.udata);
});

module.exports = router;
