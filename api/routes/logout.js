const express = require('express');
const fs = require('fs');
const router = express.Router();


router.get('/', function (req, res) {
    fs.writeFileSync('views\\config\\user-data.json', '', () => {
        console.log("User logged out");
    });
    res.redirect('/student_login');
});



module.exports = router;