const sensors = [
    {
        title: 'Temperature',
        description: "The temperature sensor which measures temperature and humidity",
        imageUrl: process.env.PUBLIC_URL + '/assets/temp_sensor.jpg',
        direction: 'left',
        time: 1500,
    },
    {
        title: 'Wind',
        description: "The wind sensor which measure wind speed",
        imageUrl: process.env.PUBLIC_URL + '/assets/wind_sensor.jpg',
        direction: 'right',
        time: 1500,
    },
];

export default sensors;