import React from 'react';
import { useContext, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import {Bar} from 'react-chartjs-2';
import { Card, CardHeader, CardBody } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const MyChart = () => {
    const [lokacije,setlokacijeGraf] = React.useState([]) // Usestate za Lokacijo
    const [steviloVozil,setsteviloVozilGraf] = React.useState([]) //Usestate za steviloStevil
    useEffect(function(){
        const getData= async function() {
        const response = await fetch("http://localhost:3001/scrapper") // Klic apija
        const chartData = await response.json() // Prirejanje jsona
        setlokacijeGraf(chartData.map((x)=> x.lokacija)); //Mapiranje lokacije in setanje v lokacijeGraf
        setsteviloVozilGraf(chartData.map((x)=> x.steviloVozil)); // Mapiranej stevilVozil in setanje v SteviloVozil
        }
        getData() //Klic Funkcije
    },[]);
    const data = {
        labels: lokacije, //Prirejanje vrednosti
        datasets: [{
            label: 'Stevilo vozil v zadnji uri',
            data: steviloVozil, // Prirejanje vrednosti
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    };
    return (
        <>
            <Card className="bg-dark text-white" style={{ width:"40rem" }}>
                <CardBody>
                    <h2>Najbolj obremenjene prometne povezave</h2>
                    <Bar
                        data={data}
                        id="my-chart"
                    />
                </CardBody>
            </Card>
        </>
    );
};

export default MyChart;