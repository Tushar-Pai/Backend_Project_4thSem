const express = require("express");
const con = require("../../database/db");
const fs = require("fs");
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
      con.on("error", function (err) {
        console.log("[mysql error]", err);
      });
      con.query(`select * from available_books;`, function (err, result) {
        let r = JSON.parse(JSON.stringify(result));

        con.query(
          `SELECT distinct category from available_books;`,
          function (err, result) {
            if (err) throw err;
            let category = JSON.parse(JSON.stringify(result));
            res.render("available_books", { booksData: r, options: category });
          }
        );
      });
    } else {
      var htmlContent = `<h1>Please login as a user to view this page</h1>`;
      res.send(htmlContent);
    }
  });
});

router.post("/", function (req, res) {
  let i = req.body.category;
  let category = i.substring(1, i.length - 1);

  if (category === "All") {
    var sql = `SELECT * FROM available_books ;`;
  } else {
    var sql = `SELECT * FROM available_books WHERE category = '${category}';`;
  }

  con.on("error", function (err) {
    console.log("[mysql error]", err);
  });
  con.query(sql, function (err, result) {
    let r = JSON.parse(JSON.stringify(result));
    con.query(
      `SELECT distinct category from available_books;`,
      function (err, result) {
        if (err) throw err;
        let category = JSON.parse(JSON.stringify(result));
        res.render("available_books", { booksData: r, options: category });
      }
    );
  });
});

router.post("/available_books_search", function (req, res) {
  var sql = `SELECT * FROM available_books WHERE book_title LIKE '%${req.body.search_data}%' OR author_name LIKE '%${req.body.search_data}%';`;

  con.query(sql, function (err, result) {
    if (err) throw err;
    let search_result = JSON.parse(JSON.stringify(result));
    con.query(
      `SELECT distinct category from available_books;`,
      function (err, result) {
        if (err) throw err;
        let category = JSON.parse(JSON.stringify(result));
        res.render("available_books", {
          booksData: search_result,
          options: category,
        });
      }
    );
  });
});

router.post("/available_books", function (req, res) {
  let i = req.body.category;
  let category = i.substring(1, i.length - 1);

  if (category === "All") {
    var sql = `SELECT * FROM available_books ;`;
  } else {
    var sql = `SELECT * FROM available_books WHERE category = '${category}';`;
  }

  con.on("error", function (err) {
    console.log("[mysql error]", err);
  });
  con.query(sql, function (err, result) {
    let r = JSON.parse(JSON.stringify(result));
    con.query(
      `SELECT distinct category from available_books;`,
      function (err, result) {
        if (err) throw err;
        let category = JSON.parse(JSON.stringify(result));
        res.render("available_books", { booksData: r, options: category });
      }
    );
  });
});

module.exports = router;
