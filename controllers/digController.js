const Dig = require('../models/digModel');
// var path = require('path');
const async = require('async');
const _ = require('lodash');

const validator = require('express-validator');
const { body, validationResult } = require('express-validator');
// var $ = require('jquery');


// exports.index = function(req, res) {
//   async.parallel({
//     digs: function(callback) {
//       // Dig.countDocuments({}, callback);
//       Dig.find({}, callback);
//       // Pass an empty object as match condition to find all documents of this collection
//     },
//   }, function(err, results) {
//       results.digs.sort(function(a, b) {let textA = a.title.toUpperCase(); let textB = b.title.toUpperCase(); return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;});
//       res.render('index', {error: err, data: results});
//   });
// };

exports.index = function(req, res) {
  res.render('index', {data: {
    paddingLeft: "5px",
    elementWidth: "40%"
  }});
};

exports.about = function(req, res) {
  res.render('about');
};

exports.map = async (req, res) => {
  async.parallel({
    digs: function(callback) {
      // Dig.countDocuments({}, callback);
      Dig.find({}, callback);
      // Pass an empty object as match condition to find all documents of this collection
    },
  }, function(err, results) {
      results.digs.sort(function(a, b) {let textA = a.county.toUpperCase(); let textB = b.county.toUpperCase(); return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;});
      res.render('map', {error: err, data: results});
  });
};

// Display list of all digs.
exports.yfirlit = async (req, res) => {
  async.parallel({
    digs: function(callback) {
      // Dig.countDocuments({}, callback);
      Dig.find({}, callback);
      // Pass an empty object as match condition to find all documents of this collection
    },
  }, function(err, results) {
      results.digs.sort(function(a, b) {let textA = a.title.toUpperCase(); let textB = b.title.toUpperCase(); return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;});

      var grouped = _.groupBy(results.digs, function(dig) {
        return dig.county;
      });
      // console.log(grouped);

      res.render('yfirlit', {error: err, data: grouped});
  });
};

// Display list of all digs.
exports.dig_list = async (req, res) => {
    try {
      const digs = await Dig.find();

      return res.status(200).json({
        success: true,
        count: 0,
        data: digs
      })
    } catch (err) {
        console.log(err);
        res.status(500);
    }
};

// Display detail page for a specific dig.
exports.dig_detail = async (req, res) => {
  try {
    const dd = await Dig.findById(req.params.id)
    console.log(dd);
    return res.render('dig', {data: dd})
  } catch (err) {
      console.log(err);
      res.status(500);
  }
};

// Display dig create form on GET.
exports.dig_create_get = function(req, res, next) {
    res.render('dig_form', { title: 'Hér slær Una inn upplýsingar um fornleifauppgröft! :-)' });
};

// Handle dig create on POST.
exports.dig_create_post = [

  // Sanitize fields.
  validator.body('name').trim().escape(),
  validator.body('people').trim().escape(),
  validator.body('county').trim().escape(),
  validator.body('year').trim().escape(),
  validator.body('category').trim().escape(),
  validator.body('type').trim().escape(),
  // validator.body('finished').trim().escape(),
  // validator.body('observable').trim().escape(),
  validator.body('gps').trim().escape(),
  validator.body('gps_desc').trim().escape(),
  validator.body('summary').trim().escape(),

  // Process request after validation.
  (req, res, next) => {
    console.log(req.body.finished);
    // Extract the validation errors from a request.
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('dig_form', { title: 'Hér slær Una inn upplýsingar um fornleifauppgröft! :-)', dig: dig, errors: errors.array()});
      return;
    }
    else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Dig.findOne({ 'title': req.body.title })
        .exec( function(err, found_dig) {
           if (err) { return next(err); }

           if (found_dig) {
             // Genre exists, redirect to its detail page.
             res.redirect(found_dig.url);
           }
           else {
             // Create a dig object with escaped and trimmed data.
             const sources = [1,2,3,4].map(i => req.body['sources_' + i]);
             const source_links = [1,2,3,4].map(i => req.body['sources_link_' + i]);

             const image_descriptions = [1,2,3,4,5,6,7,8].map(i => req.body['image_desc_' + i]);
             const image_sources = [1,2,3,4,5,6,7,8].map(i => req.body['image_source_' + i]);

             const dig = new Dig(
               {
                 title: req.body.title,
                 people: req.body.people.split(','),
                 county: req.body.county,
                 year: req.body.year.split(','),
                 category: req.body.category,
                 type: req.body.type,
                 finished: req.body.finished == 'on' ? true : false,
                 observable: req.body.observable,
                 gps: req.body.gps.split(',').map(Number),
                 gps_desc: req.body.gps_desc,
                 sources: sources,
                 source_links: source_links,
                 image_url: req.body.image_url,
                 image_descriptions: image_descriptions,
                 image_sources: image_sources,
                 tags: req.body.tags.split(";"),
                 summary: req.body.summary
               }
             );
             dig.save(function (err) {
               if (err) { return next(err); }
               // Genre saved. Redirect to genre detail page.
               res.redirect(dig.url);
             });
           }
         });
    }
  }
];

// Display dig delete form on GET.
exports.dig_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: dig delete GET');
};

// Handle dig delete on POST.
exports.dig_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: dig delete POST');
};

// Display dig update form on GET.
exports.dig_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: dig update GET');
};

// Handle dig update on POST.
exports.dig_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: dig update POST');
};
