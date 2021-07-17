const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { body, validationResult } = require("express-validator");
const con = require("../../database/db");

const router = express.Router();
const saltRounds = 10;

router.get("/", function (req, res) {
  res.render("student_registration");
});

router.post(
  "/",
  [
    //Form Validation
    body("username").not().isEmpty().withMessage("Please enter a name"),

    body("email").isEmail().withMessage("Invalid email"),

    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long"),

    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  ],

  // Callback for handling requests
  function (req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const alert = errors.array();

      res.render("student_registration", { alert });
    } else {
      let username = req.body.username;
      let email = req.body.email;
      let password = req.body.password;

      con.query(
        `select * from student_registration where user_email='${email}';`,
        function (err, result) {
          if (err) throw err;
          let r = JSON.parse(JSON.stringify(result));
          if (r.length != 0) {
            res.render("student_registration", {
              altmsg: "This email ID has already been registered",
            });
          } else {
            bcrypt.hash(password, saltRounds, function (err, hash) {
              // Store hash in your password DB.
              con.on("error", function (err) {
                console.log("[mysql error]", err);
              });
              con.query(
                `INSERT INTO student_registration(user_name, user_email, user_password, isAdmin) VALUES ('${username}', '${email}', '${hash}', 0);commit;`,
                function (err, result) {
                  if (err) throw err;
                  console.log("values inserted");
                  res.render("student_registration", {
                    msg: "Successfully Registered",
                  });
                }
              );
            });
          }
        }
      );
    }

    // const content = `<h5>Welcome to the library </h5>
    // <p>Thank you for registering. We hope you will have a great time. </p>
    //       `;

    // // create reusable transporter object using the default SMTP transport
    // let transporter = nodemailer.createTransport({
    //   service: "hotmail",

    //   auth: {
    //     user: 'librarymanagementbmsce@outlook.com', // generated ethereal user
    //     pass: 'libraryBMSCE@2021', // generated ethereal password
    //   },

    // });

    // // send mail with defined transport object
    // let mailOptions = {
    //   from: '"Library Mail" <librarymanagementbmsce@outlook.com>', // sender address
    //   to: req.body.email, // list of receivers
    //   subject: "Welcome to the library", // Subject line
    //   text: "Hello world?", // plain text body
    //   html: content, // html body
    // };

    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     return console.log(error);
    //   }
    //   console.log('Message sent: %s', info.messageId);
    // });
  }
);

module.exports = router;
