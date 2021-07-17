const express = require("express");
const con = require("../../database/db");
const fs = require("fs");
const router = express.Router();

router.get("/", function (req, res) {
  fs.readFile("views\\config\\user-data.json", (error, data) => {
    if (data.length != 0) {
      var user_data = JSON.parse(data);
    }
    if (
      data.length != 0 &&
      user_data.isAdmin === 1 &&
      typeof user_data.isAdmin != "undefined"
    ) {
      if (error) {
        console.error(error);
        return;
      }

      var sql = `SELECT sr.user_id, sr.user_name, sr.user_email, ab.isbn , ab.book_title,ab.author_name FROM issued_books ib , student_registration sr ,available_books ab
                WHERE ib.user_id = sr.user_id AND ib.isbn = ab.isbn ORDER BY ib.user_id; `;
      con.query(sql, function (err, result) {
        let r = JSON.parse(JSON.stringify(result));

        res.render("issued_books_admin", { booksData: r });
      });
    } else {
      var htmlContent = `<h1>Please login as a user to view this page</h1>`;
      res.send(htmlContent);
    }
  });
});

module.exports = router;
