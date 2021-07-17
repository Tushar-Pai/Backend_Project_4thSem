const express = require("express");
const bcrypt = require("bcrypt");
const con = require("../../database/db");
const { body, validationResult } = require("express-validator");
const fs = require("fs");
const router = express.Router();

router.get("/", function (req, res) {
  res.render("admin_login");
});

router.post(
  "/",
  // Form Validation
  [body("email").isEmail().withMessage("Invalid email")],

  // Callback for handling the request
  function (req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const alert = errors.array();
      res.render("admin_login", { alert });
    } else {
      let email = req.body.email;
      let password = req.body.password;

      con.query(
        `select * from admin_registration where admin_email='${email}';`,
        function (err, result) {
          if (err) throw err;
          let r = JSON.parse(JSON.stringify(result));
          if (r.length === 0) {
            res.render("admin_login", {
              msg: "This email ID is not registered. Please register to the website.",
            });
          } else {
            bcrypt.compare(
              password,
              r[0].admin_password,
              function (err, result) {
                if (result === true) {
                  var data = JSON.stringify(r[0]);
                  fs.writeFileSync("views\\config\\user-data.json", data);
                  res.redirect("/available_books_admin");
                } else {
                  res.render("admin_login", {
                    msg: "Login failed. Invalid password or email",
                  });
                }
              }
            );
          }
        }
      );
    }
  }
);
module.exports = router;
