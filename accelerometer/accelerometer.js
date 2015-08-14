// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This basic accelerometer example logs a stream
of x, y, and z data from the accelerometer
*********************************************/

// process.env.TESSEL_UPLOAD_DIR = "./";
var tessel = require('tessel');
var climatelib = require('climate-si7020');

var camera = require('camera-vc0706').use(tessel.port['A']);
var climate = climatelib.use(tessel.port['B']);
var accel = require('accel-mma84').use(tessel.port['C']);

var notificationLED = tessel.led[3];

var pushed = true;

// Initialize the accelerometer.
camera.on('ready', function(){
  console.log("camera ready");
    climate.on('ready',function(){
        console.log("climate ready");
          accel.on('ready', function () {
           console.log("accel ready");
              // Stream accelerometer data
            accel.on('data', function loop (xyz) {
              if (pushed && Math.abs(xyz[2].toFixed(2))>0.1) {
                console.log('I have been pushed.');
                pushed = false;
                setTimeout(takePic,1000);
                setTimeout(function(){pushed=true;},2000);
              }
              /*console.log('x:', xyz[0].toFixed(2),
                'y:', xyz[1].toFixed(2),
                'z:', xyz[2].toFixed(2));*/
        });
      });
  });
});

function takePic(){
  camera.takePicture(function(err, image) {
    if (err) {
      console.log('error taking image', err);
    } else {
      notificationLED.low();
      // Name the image
      var name = 'picture-' + Math.floor(Date.now()*1000) + '.jpg';
      // Save the image
      console.log('Picture saving as', name, '...');
      process.sendfile(name, image);
      console.log('done.');
    }
    console.log('Connected to si7020');
    climate.readTemperature('f', function (err, temp) {
      climate.readHumidity(function (err, humid) {
        console.log('Degrees:', temp.toFixed(4) + 'F', 'Humidity:', humid.toFixed(4) + '%RH');
        setTimeout(loop, 300);
      });
    });
  });
}

accel.on('error', function(err){
  console.log('Error:', err);
});

camera.on('error', function(err) {
  console.error(err);
});

climate.on('error', function(err) {
  console.log('error connecting module', err);
});