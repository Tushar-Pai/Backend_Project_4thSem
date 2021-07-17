const express = require("express");
const con = require("../../database/db");
const { body, validationResult } = require("express-validator");
const router = express.Router();

router.get("/", function (req, res) {
  res.render("feedback");
});

router.post(
  "/",
  [
    //Form Validation
    body("username").not().isEmpty().withMessage("Please enter a name"),

    body("email").isEmail().withMessage("Invalid email"),

    body("feedback").not().isEmpty().withMessage("Please enter feedback"),
  ],

  function (req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const alert = errors.array();
      res.render("feedback", { alert });
    } else {
      let email = JSON.stringify(req.body.email);
      let name = JSON.stringify(req.body.username);
      let feedback = JSON.stringify(req.body.feedback);

      const query = `INSERT INTO feedbacks VALUES ( ${email}, ${name} ,${feedback}); commit ;`;

      con.on("error", function (err) {
        console.log("[mysql error]", err);
      });

      con.query(query, function (err, result) {
        if (err) throw err;
        console.log("Feedback inserted");
      });

      res.render("feedback", { msg: "Feedback submitted successfully" });
    }
  }
);
module.exports = router;
