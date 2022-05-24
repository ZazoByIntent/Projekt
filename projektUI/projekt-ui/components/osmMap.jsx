import React, { Component, useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, Polyline, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";



const Map = () => {
  const [rezultati, setRezultati] = useState([]);
  const [stanja, setStanje] = useState([]);

  async function getRezultati() {
    const res = await fetch(`http://localhost:3001/rezultat`)
    const data = await res.json();
    return data;
  }

  useEffect(function(){
    getRezultati()
    .then((rezultatiData) => {
      setRezultati(rezultatiData);
      console.log(rezultati);
    })
  }, []);

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
      {rezultati.map((rezultat, index) => {
        if(rezultati[index]["stanje_ceste"] >= 3){
          if(typeof rezultati[index + 1] !== "undefined")
          {
            return <Polyline key={index} color="red" positions= {[
              [rezultati[index]["latitude"], rezultati[index]["longitude"]],
              [rezultati[index + 1]["latitude"], rezultati[index + 1]["longitude"]],
            ]}/>
          }
        }
        else if(rezultati[index]["stanje_ceste"] >= 2 && rezultati[index]["stanje_ceste"] < 3){
          if(typeof rezultati[index + 1] !== "undefined")
          {
            return <Polyline key={index} color="orange" positions= {[
              [rezultati[index]["latitude"], rezultati[index]["longitude"]],
              [rezultati[index + 1]["latitude"], rezultati[index + 1]["longitude"]],
            ]}/>
          }
        }
        else{
          if(typeof rezultati[index + 1] !== "undefined")
          {
            return <Polyline key={index} color="green" positions= {[
              [rezultati[index]["latitude"], rezultati[index]["longitude"]],
              [rezultati[index + 1]["latitude"], rezultati[index + 1]["longitude"]],
            ]}/>
          }
        }
        //<Marker position={[rezultat["latitude"], rezultat["longitude"]]} draggalbe={true} animate={true}></Marker>
      })}
    </MapContainer>
  );
};

export default Map;