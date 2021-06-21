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
router.route("/changestatus").post((req, res) => {
  const { rid } = req.params;
  const { status } = req.body;
  console.log("status", status, rid);
  Rides.findByIdAndUpdate(rid, {
    status,
  })
    .then((ride) => {
      return res.json({ ride, message: "ride updated succussfully" });
    })
    .catch((error) => res.json({ error }));
});
router.route("/addRide").post((req, res) => {
  const { uid } = req.params;
  const { pickup, destination, distance, amount, driver, client } = req.body;
  var status = "Enroute pickup";
  const newRide = new Rides({
    pickup,
    destination,
    distance,
    amount,
    driver,
    client,
    status,
  });
  newRide
    .save()
    .then((ride) => {
      if (ride) {
        console.log("rides", ride);
        return res.json({ ride, message: "ride added successfully" });
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
