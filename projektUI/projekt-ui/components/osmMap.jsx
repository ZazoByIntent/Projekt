import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

var rezultati = [];

function getRezultati() {
  return fetch('http://localhost:3001/rezultat')
  .then((response) => response.json())
  .then((responseJson) => {
    for (var i = 0; i < responseJson.length; i++){
      let stanjeCeste = responseJson[i].stanje_ceste;
      const koordinate = responseJson[i].koordinate.split(",");
      koordinate[1] = koordinate[1].trim();
      const noviPodatki = [stanjeCeste, koordinate];
      rezultati.push(noviPodatki)
    }
  })
  .catch((error) => {
    console.error(error);
  });
}

window.onload = function() {
  getRezultati();
};


const Map = () => {
  return (
    <MapContainer
      center={[46.55353455753438, 15.644892773708696]}
      zoom={14}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", position: "absolute" }}
    >
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiemF6bzIwMDAiLCJhIjoiY2wzOTlueXB0MDBkbTNkbW82azVxYXZxYSJ9.3BvSbH7qXomkevh596Kmew`}
        attribution='Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>'
      />
      <Marker position={[46.55353455753438, 15.644892773708696]} draggable={true} animate={true}>
        <Popup>Hey ! I live here</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;