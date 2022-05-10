const rp = require('request-promise');
const url = 'https://opendata.si/promet/counters/';
const apiUrl = "http://localhost:3000/scrapper";
const axios = require('axios');
var XMLHttpRequest = require('xhr2');
var moment = require('moment');

function SendValues(casBaze) {
  rp(url)
  .then(function(body){
    var json = JSON.parse(body);
    var casZajema = moment(json.Contents[0].ModifiedTime);
    // Primerjaj cas zajema podatkov s shranjenim casom
    if((casBaze != null && casZajema.diff(casBaze, "hours") > 1) || casBaze == null){
      // Izbrisi stare vnose na bazi
      console.log("cas baze: " + casBaze);
      if(casBaze != null)
        axios.delete(apiUrl);

      // Napolni z novimi podatki
      for (var element in json.Contents[0].Data.Items)
      {
        var lokacija = json.Contents[0].Data.Items[element].stevci_lokacijaOpis;
        var latitude = json.Contents[0].Data.Items[element].y_wgs;
        var longitude = json.Contents[0].Data.Items[element].x_wgs;
        var cas = json.Contents[0].ModifiedTime;
        console.log("Lokacija: " + lokacija + " na koordinatah: Y:" + latitude + " X: " + longitude);
        console.log("Cas: " + cas);
        //  for (var subElement in json.Contents[0].Data.Items[element].Data)
        // {
          var averageSpeed = json.Contents[0].Data.Items[element].Data[0].properties.stevci_hit;
          console.log("Povprečna hitrost: " + averageSpeed + " km/h");
          var numberOfVehicles = json.Contents[0].Data.Items[element].Data[0].properties.stevci_stev;
          console.log("Stevilo vozil: " + numberOfVehicles);
          var gostotaPrometa = json.Contents[0].Data.Items[element].Data[0].properties.stevci_statOpis;
          console.log("Gostota: " + gostotaPrometa);
          console.log("--------------------------------")
        // }
        var xhr = new XMLHttpRequest();
        xhr.open("POST", apiUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            "lokacija": lokacija,
            "latitude" : latitude,
            "longitude" : longitude,
            "cas" : cas,
            'povprecnaHitrost' : averageSpeed,
            'steviloVozil' : numberOfVehicles,
            'gostota' : gostotaPrometa
        }));
      }
    } else {
      console.log("Podatki so posodobljeni.");
    }
  })
  .catch(function(err){
    console.log(err);
  });
}

axios
  .get(apiUrl)
  .then(res => {
    if(res.data[0] == undefined)
      SendValues(null);
    else{
      var casBaze = moment(res.data[0].cas);
      SendValues(casBaze);
    }
  })
  .catch(error => {
    console.error(error);
  });