const express = require("express");
const fs = require("fs");
const con = require("../../database/db");
const { body, validationResult } = require("express-validator");
const router = express.Router();

router.get("/", function (req, res) {
  fs.readFile("views/config/user-data.json", (err, data) => {
    if (data.length != 0) {
      var user_data = JSON.parse(data);
    }
    if (
      data.length != 0 &&
      user_data.isAdmin === 1 &&
      typeof user_data.isAdmin != "undefined"
    ) {
      res.render("add_books_admin");
    } else {
      var htmlContent = `<h1>Please login as a admin to view this page</h1>`;
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

    body("category").not().isEmpty().withMessage("Please enter category"),

    body("price").not().isEmpty().withMessage("Please enter price"),

    body("quantity").not().isEmpty().withMessage("Please enter quantity"),
  ],

  //Callback for handling post req
  function (req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const alert = errors.array();
      res.render("add_books_admin", { alert });
    } else {
      const bookDetails = {
        isbn: req.body.isbn,
        book_title: req.body.name_of_book,
        category: req.body.category,
        author_name: req.body.author_name,
        price: req.body.price,
        quantity: req.body.quantity,
      };
      var sql = `SELECT * FROM available_books WHERE isbn = ${bookDetails.isbn}`;
      con.query(sql, function (err, result) {
        if (err) throw err;
        var booksData = JSON.parse(JSON.stringify(result));

        if (booksData.length === 0) {
          var insertQuery = `INSERT INTO available_books ( isbn, book_title, category, author_name, price, quantity) 
                            VALUES (${bookDetails.isbn}, '${bookDetails.book_title}', '${bookDetails.category}',
                             '${bookDetails.author_name}', ${bookDetails.price}, ${bookDetails.quantity});`;
          con.query(insertQuery, function (err, result) {
            if (err) throw err;
            res.render("add_books_admin", { msg: "New book was added." });
          });
        } else {
          var quantity = booksData[0].quantity;
          quantity += +bookDetails.quantity;
          var updateQuery = `UPDATE available_books SET quantity = ${quantity} 
                               WHERE isbn = ${bookDetails.isbn};`;
          con.query(updateQuery, function (err, result) {
            if (err) throw err;
            res.render("add_books_admin", {
              msg: `This book is already available. Therefore quantity was updated to ${quantity}`,
            });
          });
        }
      });
    }
  }
);

module.exports = router;
