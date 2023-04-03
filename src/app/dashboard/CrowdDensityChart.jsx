import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import styles from './CrowdDensityChart.module.css';
import image1 from '../../assets/images/image1.png';
import image2 from '../../assets/images/image2.png';
import image3 from '../../assets/images/image3.png';
import image4 from '../../assets/images/image4.png';

export default React.memo(function CrowdDensityChart({
    selectedCameraId,
    crowdDensityCountingLog,
    crowdDensityCameraId,
    crowdDensityCameraOrigin,
    occurEvent,
    status,
    // crowdDensityCameraName, 
    crowdDensityCameraThreshold,
    // crowdDensityCameraIdx 
}) {

    const [newFilteringData, setNewFilteringData] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [''],
        datasets: [
            {
                label: '측정값',
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 0.3,
            },
            {
                label: '임계치',
                data: [],
                borderColor: [
                    'white',
                ],
                borderWidth: 0.5,
            }
        ],
    });

    useEffect(() => {
        const fetchData = async () => {
            if (crowdDensityCountingLog && crowdDensityCameraOrigin) {
                const filterData = await crowdDensityCountingLog.filter((log) =>
                    // log.camera_channel === crowdDensityCameraOrigin && log.ipaddress === selectedCameraIpaddress // ==> ip가 다르고 selectredCameraId가 같은 경우 추가
                    log.camera_channel === crowdDensityCameraOrigin
                );
                setNewFilteringData(filterData);
            }
        };
        fetchData();
    }, [crowdDensityCountingLog, crowdDensityCameraOrigin, crowdDensityCameraThreshold]);

    useEffect(() => {
        if (newFilteringData.length === 0) {
            return;
        }

        const getCountingLog = async () => {
            try {
                const threshold = crowdDensityCameraThreshold;
                const maxDataLength = 30;
                const labels = newFilteringData.map((item) => {
                    const labelTime = item.datetime.substring(9, item.datetime.length);
                    const timeArray = [labelTime.slice(0, 2), labelTime.slice(2, 4), labelTime.slice(4, 6)];
                    const timeString = timeArray.join(':');
                    return timeString;
                }).reverse().slice(-maxDataLength);
                const dataPoints = newFilteringData.map((item) => item.count_average).reverse().slice(-maxDataLength);
                const thresholdData = newFilteringData.map((item) => threshold).slice(-maxDataLength);
                const datasets = [];

                if (threshold) {
                    datasets.push({
                        label: `임계치(${threshold})`,
                        data: thresholdData,
                        borderColor: ['red'],
                        borderWidth: 1,
                    });
                }

                datasets.push({
                    label: '군중감지',
                    data: dataPoints,
                    //   backgroundColor: ['rgba(255, 99, 132, 0.8)'],
                    backgroundColor: 'transparent',
                    borderColor: ['#37872D'],
                    borderWidth: 1,
                });

                const data = {
                    labels: labels,
                    datasets: datasets,
                };
                setChartData(data);
            } catch (err) {
                console.error('crowddensity chart component err: ', err);
            }
        };

        getCountingLog();
    }, [newFilteringData, crowdDensityCameraThreshold]);

    const options = {
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                gridLines: {
                    color: "rgba(204, 204, 204,0.1)"
                }
            }],
            xAxes: [{
                gridLines: {
                    color: "rgba(204, 204, 204,0.1)"
                },
                ticks: {
                    autoSkip: false,
                    maxRotation: 60,
                    minRotation: 60
                }
            }]
        },
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                fontColor: '#ffffff',
                fontSize: 10,
                usePointStyle: true,
                boxWidth: 30,
                boxHeight: 10,
                boxFillColor: 'rgba(255, 99, 132, 0.8)',
            },
        },
        elements: {
            point: {
                radius: 0
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.mapImage}>
                <img src={crowdDensityCameraId === 'crowd0' ? image1 :
                    crowdDensityCameraId === 'crowd1' ? image2 :
                    crowdDensityCameraId === 'crowd2' ? image3 :
                    crowdDensityCameraId === 'crowd3' ? image4 :
                    ''
                }/>
            </div>
            <div className={occurEvent ? status === '0' ? styles.normal : styles.onEvent : status === '0' ? styles.normal : styles.unAck}>
                <Line data={chartData} options={options}/>
            </div>
        </div>
    );
}
);