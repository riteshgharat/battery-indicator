let color = '#70FF6F' //"#FFFA7F";
let body = document.body;
let root = document.querySelector(':root');


let batteryCon = document.querySelector('.boxTwo');
let batteryPer = document.querySelector('.text');
let batteryAni = document.querySelector('span');
let batteryStats = document.querySelector('.batteryStats');

//sound = new AudioContext();
//console.log(sound)
function updateStatus() {

  var sound = document.querySelector('audio') //new Audio();

  navigator.getBattery().then(function(battery) {
    var level = Math.round(battery.level * 100);
    var status = battery.charging;
    //  console.log(level, status);

    if (level <= 100) { BStatus = 'Normal' }

    if (level <= 20) color = '#F9FF65';
    if (level <= 10) {
      color = '#FF6565';
      BStatus = 'Low'
    }

    batteryPer.innerText = level + '%';
    batteryAni.style.height = (100 - level) + '%';
    batteryAni.style.animation = "animate 3s";
    batteryCon.style.backgroundColor = color;

    body.style.backgroundColor = color + '2F';

    if (level <= 99 && status == true) {
      CStatus = 'Charging On';
    }
    else {
      CStatus = 'Charging Off';
    }

    if (status == false) {
      CStatus = 'Fully Charged';
      batteryAni.style.animation = "animate 3s infinite";

      sound.src = 'sounds/batery_full_capacity.mp3';
      sound.autoplay = true;
      sound.play();
    }
    root.style.setProperty('--Height', (100 - level) + '%');
    batteryStats.innerHTML = `Battery charging: ${CStatus}. <br><br>
    Battery Status: ${BStatus}. <br><br>
    Battery discharging time: ${battery.dischargingTime} Minutes.`;
  })
}
setInterval(updateStatus, 2000);

/*
var promise = document.querySelector('sound').play();

if (sound !== undefined) {
  sound.then(_ => {
    console.log("Autoplay started!")
  }).catch(error => {
    console.log("Autoplay was prevented.")
    // Show a "Play" button so that user can start playback.
  });
}
*/


// Registering ServiceWorker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}


/*
var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;

//document.addEventListener('DOMContentLoaded', function() {
function we() {

  navigator.getBattery().then(function(battery) {
    // A few useful battery properties
    console.log("Battery charging: " + battery.charging); // true
    console.log("Battery level: " + battery.level); // 0.58
    console.log("Battery discharging time: " + battery.dischargingTime);

    // Add a few event listeners
    battery.addEventListener("chargingchange", function(e) {
      console.log("Battery charge change: " + battery.charging);
    }, false);
    battery.addEventListener("chargingtimechange", function(e) {
      console.log("Battery charge time change: " + battery.chargingTime);
    }, false);
    battery.addEventListener("dischargingtimechange", function(e) {
      console.log("Battery discharging time change: " + battery.dischargingTime);
    }, false);
    battery.addEventListener("levelchange", function(e) {
      console.log("Battery level change: " + battery.level);
    }, false)
  })
  // })
}
setInterval(we, 1000)
*/




let butInstall = document.querySelector('.install');

window.addEventListener('beforeinstallprompt', (event) => {
  //console.log('????', 'beforeinstallprompt', event);
/*
  storedData = JSON.parse(localStorage.getItem('MathRiddlesApp'));
  const data = navigator.userAgent;
  const replaceBrand = data.replace('SM', 'Samsung')
  let deviceBrand = replaceBrand.match('Samsung');
  deviceBrand = deviceBrand[0];

  if (storedData.visited == 0 && deviceBrand == 'Samsung') {
    alert('Download Same App from Samsung App Store')
    window.location.href = 'https://apps.samsung.com/appquery/appDetail.as?appId=app.netlify.mathriddles.twa';
  }
  else {*/
    // Stash the event so it can be triggered later.
    window.deferredPrompt = event;
    // Remove the 'hidden' class from the install button container
    //divInstall.classList.toggle('hidden', false);
  //}
});

butInstall.addEventListener('click', () => {
  //console.log('????', 'butInstall-clicked');

  const promptEvent = window.deferredPrompt;
  if (!promptEvent) {
    // The deferred prompt isn't available.
    return;
  }
  // Show the install prompt.
  promptEvent.prompt();
  // Log the result
  const result = promptEvent.userChoice;
  //console.log('????', 'userChoice', result);
  // Reset the deferred prompt variable, since
  // prompt() can only be called once.
  window.deferredPrompt = null;
  // Hide the install button.
  //divInstall.classList.toggle('hidden', true);
  //}
});

window.addEventListener('appinstalled', (event) => {
  //console.log('????', 'appinstalled', event);
  // Clear the deferredPrompt so it can be garbage collected
  window.deferredPrompt = null;
});