const rp = require('request-promise');
const url = 'https://opendata.si/promet/counters/';

rp(url)
  .then(function(body){
    var json = JSON.parse(body)
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
      
      // Poslji ime lokacije, x in y koordinate
    }
  })
  .catch(function(err){
    console.log(err);
  });