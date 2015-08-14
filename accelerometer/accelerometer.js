// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This basic accelerometer example logs a stream
of x, y, and z data from the accelerometer
*********************************************/

// process.env.TESSEL_UPLOAD_DIR = "./";
var tessel = require('tessel');
var http = require('http');
// var wifi = require('wifi-cc3000');
// var climatelib = require('climate-si7020');



var camera = require('camera-vc0706').use(tessel.port['A']);
// var climate = climatelib.use(tessel.port['B']);
var accel = require('accel-mma84').use(tessel.port['C']);


var servolib = require('servo-pca9685');
var servo = servolib.use(tessel.port['D']);

var servo1 = 1; 
var notificationLED = tessel.led[3];

var pushed = true;

// Initialize the accelerometer.
camera.on('ready', function(){
  console.log("camera ready");
          servo.on('ready', function () {
            console.log("servo ready");
        accel.on('ready', function () {
           console.log("accel ready");
              // Stream accelerometer data
            accel.on('data', function loop (xyz) {
              if (pushed && Math.abs(xyz[2].toFixed(2))>0.1) {
                console.log('I have been pushed.');
                pushed = false;
                setTimeout(takePic,1000);
              }
              /*console.log('x:', xyz[0].toFixed(2),
                'y:', xyz[1].toFixed(2),
                'z:', xyz[2].toFixed(2));*/
        });
      });
  });
});

var options = {
  method: 'POST',
  host:'192.168.2.132',
  port:'3000',
  path:'/data',
}

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
      var request = http.request(options,function(res){
        res.on('data',function(data){
          console.log('response data', data.toString('ascii'));
          pushed = true;
          if(data==="True"){
          }
            // stamp();
        })
      });
      // servo.configure(servo1, 0.05, 0.12, function () {
      //     servo.move(servo1, 1);
      //   })

      // request.on('error', function(err){ console.log(err)});
      request.write(image);
      request.end();
      console.log('done.');
    }
    console.log('Connected to si7020');
  });
}

accel.on('error', function(err){
  console.log('Error:', err);
});

camera.on('error', function(err) {
  console.error(err);
});


// We have a servo plugged in at position 1

// function stamp() {
//   servo.configure(servo1, 0.05, 0.12, function () {
//     setInterval(function () {
//       console.log('Position (in range 0-1):', position);
//       //  Set servo #1 to position pos.
//       servo.move(servo1, position);

//       // Increment by 10% (~18 deg for a normal servo)
//       position += 1;
//       if (position > 1) {
//         position = 0; // Reset servo position
//       }
//     }, 500); // Every 500 milliseconds
//   });
// }