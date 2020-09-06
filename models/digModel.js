const mongoose = require('mongoose');
const shortid = require('shortid');

const Schema = mongoose.Schema;

var DigSchema = new Schema(
  {
    _id: {type: String, default: shortid.generate},
    title: {type: String, required: true},
    // author: {type: Schema.Types.ObjectId, ref: 'Author', required: true},
    people: {type: Array, default: [], required: false},
    county: {type: String, required: true},
    year: {type: Array, default: [], required: false},
    category: {type: Number, required: false}, // green or red?
    type: {type: String, required: false},     // Fullnaðaruppgr ...
    finished: {type: Boolean, required: false},
    observable: {type: String, required: false},
    gps: {type: [Number], default: [], required: true},
    gps_desc: {type: String, required: false},
    sources: {type: Array, default: [], required: false},
    source_links: {type: Array, default: [], required: false},
    image_url: {type: String, required: false},
    image_descriptions: {type: Array, default: [], required: false},
    image_sources: {type: Array, default: [], required: false},
    tags: {type: Array, required: false},
    summary: {type: String, required: true}
  }
);

// Virtual for dig's URL
DigSchema
.virtual('url')
.get(function () {
  return '/digs/dig/' + this._id;
});

//Export model
module.exports = mongoose.model('Dig', DigSchema);
