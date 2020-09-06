var express = require('express');
var router = express.Router();

// Require controller modules.
var dig_controller = require('../controllers/digController');

/// dig ROUTES ///

// GET catalog home page.
router.get('/', dig_controller.index);

// GET request for map page.
router.get('/map', dig_controller.map);

// GET request for about page.
router.get('/about', dig_controller.about);

router.get('/yfirlit', dig_controller.yfirlit);

// GET request for list of all dig items.
router.get('/all', dig_controller.dig_list);

// GET request for creating a dig. NOTE This must come before routes that display dig (uses id).
// router.get('/dig/create', dig_controller.dig_create_get);

// GET request for one dig.
router.get('/dig/:id', dig_controller.dig_detail);

// GET request for list of all dig items.
router.get('/digs/all', dig_controller.dig_list);

module.exports = router;
