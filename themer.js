// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var themer     = express();                 // define our app using express
var bodyParser = require('body-parser');
var Promise = require('bluebird');
var fs = require('fs');
var Mustache = require('mustache');
var sass = require('node-sass');

themer.use(bodyParser.urlencoded({ extended: true }));
themer.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'Good job! You are here!' });
});

router.route('/scss')
    // post here, we give you a big compiled CSS string!
    .post(function(req, res) {
      Promise.promisifyAll(fs);

      /**

      Default Foundation Settings:

      $primary_color: '#1779ba'
      $secondary_color: '#767676'
      $success_color: '#3adb76'
      $warning_color: '#ffae00'
      $alert_color: '#cc4b37'

      **/

      var settings_data = {
        primary_color: ((req.body.primary_color) ? req.body.primary_color : '#1779ba'),
        secondary_color: ((req.body.secondary_color) ? req.body.secondary_color : '#767676'),
        success_color: ((req.body.success_color) ? req.body.success_color : '#3adb76'),
        warning_color: ((req.body.warning_color) ? req.body.warning_color : '#ffae00'),
        alert_color: ((req.body.alert_color) ? req.body.alert_color : '#cc4b37'),
        ltgray_color: ((req.body.ltgray_color) ? req.body.ltgray_color : '#e6e6e6'),
        mdgray_color: ((req.body.mdgray_color) ? req.body.mdgray_color : '#cacaca'),
        dkgray_color: ((req.body.dkgray_color) ? req.body.dkgray_color : '#8a8a8a'),
        black_color: ((req.body.black_color) ? req.body.black_color : '#0a0a0a'),
        white_color: ((req.body.white_color) ? req.body.white_color : '#fefefe'),
        body_font: ((req.body.body_font) ? req.body.body_font : '"Helvetica Neue", Helvetica, Roboto, Arial, sans-serif'),
        headline_font: ((req.body.headline_font) ? req.body.headline_font : '"Helvetica Neue", Helvetica, Roboto, Arial, sans-serif')
      }

      fs.readFileAsync(__dirname + '/inc/settings.scss.mst')
        .then(function(data){ render_settings(data) })
        .catch(function(err) {
          res.send(err);
        });

      function render_settings(data) {
        var settings_scss = Mustache.render(data.toString(), settings_data);
        fs.writeFileAsync('/tmp/_settings.scss', settings_scss)
        .then(function(){ generate_css() })
        .catch(function(err) {
          res.send(err);
        });
      }

      function generate_css(){
        //now we sass
        sass.render({
          file: __dirname + '/inc/base.scss',
          includePaths: ['/tmp/',__dirname + '/bower_components/foundation-sites/scss/'],
          outputStyle: 'compressed'
        }, function(err, result){
          if(err){
            res.status(503).send(err);
          } else {
            res.json({ css: result.css.toString() });
            fs.unlinkAsync('/tmp/_settings.scss');
          }
        });
      }
    });


themer.use('/v1', router);

// START THE SERVER
// =============================================================================
themer.listen(port);
console.log('Get to theming on port ' + port);

module.exports = themer;
