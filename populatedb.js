#! /usr/bin/env node

console.log('This script populates some digs to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var Dig = require('./models/digModel');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var digs = []

// create function
function digCreate(title, people, county, year, category, type, finished, observable, gps, citations, summary, cb) {
  var digDetail = {
    title: title,
    people: people,
    county: county,
    year: year,
    category: category,
    type: type,
    finished: finished,
    observable: observable,
    gps: gps,
    citations: citations,
    summary: summary
  }

  var dig = new Dig(digDetail);

  dig.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Dig: ' + dig);
    digs.push(dig)
    cb(null, dig)
  });
}

// functions to call other create functions with data

function createDigs(cb) {
    async.series([
        function(callback) {
          digCreate(
            'Hæli í Flókadal',
            ['Guðmundur Ólafsson'],
            'Skagafjarðarsýsla',
            '1996',
            1,
            'Framkvæmdaruppgröftur',
            true,
            false,
            [64.13548, -21.89541],
            ['1996/5: Beinafundur á Hæli í Flókadal / Guðmundur Ólafsson'],
            'Grafir fundust við gröfuvinnu og var þá fornleifafræðingur kallaður til. Guðmundur Ólafsson, fornleifafræðingur, kom á staðinn, hreinsaði frá beinum og fann leifar af þremur gröfum. Beinafræðingur greindi beinin úr gröfunum þremur og komst að eftirfarandi niðurstöðu. Í einni gröf var að finna bein úr karlmanni um þrítugt. Úr næstu gröf voru bein úr tveimur einstaklingum, illa farin og vantaði töluvert í þau, því erfitt að greina t.d. kyn, en beinin virðast vera úr karlmanni og barni (barnið hefur verið u.þ.b. 18 mánaða gamalt). Þriðja gröfin var illa farin eftir gröfuvinnu en í henni voru bein nokkurra einstaklinga, líklegast úr einum karlmanni, sterklega byggðum á aldrinum 40-50 ára og 3-4 börnum (eitt þeirra u.þ.b. 9-10 ára, annað 5-6 ára og þriðja 2-3 ára ásamt broti af bringubeini annars barns líklega 2-3 ára en ekki hægt að staðfesta það.',
            callback);
        },
        function(callback) {
          digCreate(
            'Katanes í Hvalfjarðarsveit',
            ['Fornleifastofnun Íslands'],
            'Borgarfjarðarsýsla',
            '2014',
            1,
            'Framkvæmdarannsókn',
            true,
            false,
            [64.604263, -21.462045],
            ['https://fornleif.is/wp-content/uploads/2018/01/U-FS563-14182_Uppgr%C3%B6ftur-%C3%AD-Katanesi.pdf'],
            'Framkvæmdarannsókn á mannvistarleifum undir handleiðslu Hildar Gestsdóttur hjá Fornleifastofnun Íslands fór fram árið 2014. Um sumarið höfðu verið teknir prufuskurðir á svæðinu sem gáfu til kynna að frekari rannsókn væri þörf. Tvö svæði voru grafin upp á staðnum um haustið. Á öðru svæðinu voru tvö mannvirki grafin upp, það eldra var líklega útihús og ekki hægt að aldursgreina það, hið yngra var mögulega reykhús (þar sem það var niðurgrafið) sem hefur verið í notkun fram á f. hl. 20. aldar skv. gripum sem fundust þar. Eftir að hætt var að nota húsið var það nýtt sem ruslagryfja. Á hinu svæðinu fannst eitt mannvirki, það var vegghleðsla eða gerði sem erfitt er að túlka. Það hefur þó ekki verið með þaki og var hellulagt að hluta. Mögulega var það nýtt sem aðhald fyrir skepnur, geymsla eða skjól fyrir beð. Lítið af gripum fannst, þó var þar eitt keramikbrot sem erfitt er að aldursgreina almennilega, það hefur verið frá því ca. 1500 - f. hl. 19. aldar. Nokkuð fannst af gripum við rannsóknina, m.a. dýrabein, leirker (frá f. hl. 20. aldar), glerflöskur frá því um 1960 og rúðuglerbrot, þó nokkuð af járni (t.d. naglar), viðarleifar og steinar.',
            callback);
        },
        ],
        // optional callback
        cb);
}

// async calls to database

async.series([
    createDigs
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Yas!!', results);

    }
    // All done, disconnect from database
    mongoose.connection.close();
});
