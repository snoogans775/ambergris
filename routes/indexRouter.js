const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    res.render('../public/index.html', {message: 'Rendered from router'});
})

module.exports = router;