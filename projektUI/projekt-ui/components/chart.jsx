import React from 'react';
import Chart from 'chart.js/auto';
import {Bar} from 'react-chartjs-2';
import { Card, CardHeader, CardBody } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

//var lokacijeLabel = [];
//var dataLabel = [];

async function getData() {
    const response = await fetch("http://localhost:3001/scrapper")
    const chartData = await response.json()

    console.log(chartData);
}

getData();

const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
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


const MyChart = () => {
    return (
        <>
            <Card className="bg-dark text-white" style={{ width:"40rem" }}>
                <CardBody>
                    <h2>Bar Example</h2>
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