const express = require("express");
const con = require("../../database/db");
const fs = require("fs");
const router = express.Router();
const { body, validationResult } = require("express-validator");

router.get("/", function (req, res) {
  fs.readFile("views\\config\\user-data.json", (error, data) => {
    if (data.length != 0) {
      var user_data = JSON.parse(data);
    }
    if (
      data.length != 0 &&
      user_data.isAdmin === 0 &&
      typeof user_data.isAdmin != "undefined"
    ) {
      if (error) {
        console.error(error);
        return;
      }

      var sql = `SELECT * FROM available_books av, issued_books ib
          WHERE av.isbn=ib.isbn
          HAVING ib.user_id = ${user_data.user_id};`;

      con.on("error", function (err) {
        console.log("[mysql error]", err);
      });
      con.query(sql, function (err, result) {
        let r = JSON.parse(JSON.stringify(result));

        res.render("issued_books", { booksData: r });
      });
    } else {
      var htmlContent = `<h1>Please login as a user to view this page</h1>`;
      res.send(htmlContent);
    }
  });
});

router.post(
  "/",

  //Form Validation
  [body("isbn").not().isEmpty().withMessage("Please enter an ISBN")],

  function (req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      fs.readFile("views\\config\\user-data.json", (err, data) => {
        const alert = errors.array();
        if (err) {
          console.error(err);
          return;
        }

        var user_data = JSON.parse(data);

        var sql = `SELECT * FROM available_books av, issued_books ib
                       WHERE av.isbn=ib.isbn
                              HAVING ib.user_id = ${user_data.user_id};`;

        con.on("error", function (err) {
          console.log("[mysql error]", err);
        });
        con.query(sql, function (err, result) {
          let r = JSON.parse(JSON.stringify(result));

          res.render("issued_books", { booksData: r, alert: alert });
        });
      });
    } else {
      fs.readFile("views\\config\\user-data.json", (error, data) => {
        var user_data = JSON.parse(data);

        var sql = `SELECT * FROM issued_books WHERE isbn = ${req.body.isbn} AND user_id = ${user_data.user_id}`;
        con.on("error", function (err) {
          console.log("[mysql error]", err);
        });

        con.query(sql, function (err, result) {
          if (err) throw err;
          var table_result = JSON.parse(JSON.stringify(result));

          if (table_result.length === 0) {
            var issuedBooksQuery = `SELECT * FROM available_books av, issued_books ib
                                              WHERE av.isbn=ib.isbn
                                             HAVING ib.user_id = ${user_data.user_id};`;
            con.query(issuedBooksQuery, function (err, result) {
              let r = JSON.parse(JSON.stringify(result));

              res.render("issued_books", {
                booksData: r,
                altmsg: "You have not issued this book. Please check the ISBN",
              });
            });
          } else {
            var returnBookQuery = `DELETE FROM issued_books WHERE isbn= ${req.body.isbn} AND user_id=${user_data.user_id};commit;`;

            con.query(returnBookQuery, function (err, result) {
              console.log("Deleted from issued books");
            });

            var quantityQuery = `SELECT quantity FROM available_books WHERE isbn = ${req.body.isbn}`;
            con.query(quantityQuery, function (err, result) {
              let r = JSON.parse(JSON.stringify(result));
              var quantity = r[0].quantity;

              var quantityUpdateQuery = `UPDATE available_books SET quantity = ${
                quantity + 1
              }
                                                         WHERE isbn = ${
                                                           req.body.isbn
                                                         };`;

              con.query(quantityUpdateQuery, function (err, result) {
                console.log("Updated quantity in available_books");
              });
            });

            var sql = `SELECT * FROM available_books av, issued_books ib
                       WHERE av.isbn=ib.isbn
                              HAVING ib.user_id = ${user_data.user_id};`;

            con.query(sql, function (err, result) {
              let r = JSON.parse(JSON.stringify(result));

              res.render("issued_books", {
                booksData: r,
                msg: "Book returned successfully",
              });
            });
          }
        });
      });
    }
  }
);

module.exports = router;
