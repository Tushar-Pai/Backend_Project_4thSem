const express = require("express");
const fs = require("fs");
const con = require("../../database/db");
const { body, validationResult } = require("express-validator");
const router = express.Router();

router.get("/", function (req, res) {
  fs.readFile("views\\config\\user-data.json", (err, data) => {
    if (data.length != 0) {
      var user_data = JSON.parse(data);
    }
    if (
      data.length != 0 &&
      user_data.isAdmin === 0 &&
      typeof user_data.isAdmin != "undefined"
    ) {
      res.render("issue");
    } else {
      var htmlContent = `<h1>Please login as a user to view this page</h1>`;
      res.send(htmlContent);
    }
  });
});

router.post(
  "/",
  [
    //Form Validation
    body("name_of_book")
      .not()
      .isEmpty()
      .withMessage("Please enter a book name"),

    body("isbn").not().isEmpty().withMessage("Please enter ISBN"),

    body("author_name").not().isEmpty().withMessage("Please enter author name"),
  ],

  //Callback for handling post req
  function (req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const alert = errors.array();
      res.render("issue", { alert });
    } else {
      fs.readFile("views\\config\\user-data.json", (error, data) => {
        if (error) {
          console.error(error);
          return;
        }
        var user_data = JSON.parse(data);

        let isbn = req.body.isbn;

        con.on("error", function (err) {
          console.log("[mysql error]", err);
        });
        con.query(
          `SELECT * FROM available_books WHERE isbn = ${isbn}`,
          function (err, result) {
            if (err) throw err;
            var books_data = JSON.parse(JSON.stringify(result));

            if (books_data.length === 0) {
              res.render("issue", {
                altmsg: `There is no book with the isbn of ${isbn}`,
              });
            } else {
              if (books_data[0].quantity > 0) {
                con.query(
                  `SELECT * FROM issued_books WHERE isbn = ${isbn} AND user_id = ${user_data.user_id}`,
                  function (err, result) {
                    if (err) throw err;
                    var books_ = JSON.parse(JSON.stringify(result));

                    if (books_.length === 0) {
                      var sql = ` INSERT INTO issued_books (isbn , user_id) VALUES  (${books_data[0].isbn} , ${user_data.user_id});commit;`;
                      con.query(sql, function (err, result) {
                        if (err) throw err;
                        console.log("Inserted into issued books");
                      });

                      var sqlUpdate = `UPDATE available_books SET quantity = ${
                        books_data[0].quantity - 1
                      } WHERE isbn = ${books_data[0].isbn} ;`;
                      con.query(sqlUpdate, function (err, result) {
                        if (err) throw err;
                        console.log("Updated available books");
                      });

                      res.render("issue", { msg: "Book Issued successfully" });
                    } else {
                      res.render("issue", {
                        altmsg: "You have already issued this book.",
                      });
                    }
                  }
                );
              } else {
                res.render("issue", {
                  altmsg:
                    "This book is unavailable in the library. Please check after some time.",
                });
              }
            }
          }
        );
      });
    }
  }
);
module.exports = router;
