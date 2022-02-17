const axios = require('axios');
const dbModels = require('../models/dbModel');
const cacheModel = require('../models/cacheModel');

exports.getWeather = async (user, socket) => {
  try{
    if(user.lat && user.long){
      const redisData = await cacheModel.getValueFromRedisCache('weather-update') || [];
      const result = redisData.find(location => location.coord.lat === user.lat && location.coord.lon === user.long)
      if(result){
        socket.emit('weather_update', result)
      }else{
        const { Weather } = await dbModels.Models();
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${user.lat}&lon=${user.long}&appid=be9fdbf6e71eb84b361ce6debe87f00a`);
        const data = {}
        data.cityName = response.data.name;
        data.weather = response.data.main;
        data.coord = response.data.coord;
        redisData.push(data);
        await Weather.create({
          long: user.long,
          lat: user.lat,
          temp: data.weather.temp,
          temp_min: data.weather.temp,
          temp_max: data.weather.temp,
          humidity: data.weather.humidity
        })
        cacheModel.setValueInRedisCache('weather-update', redisData, 120);
        socket.emit('weather_update', data)
      }
    }else{
      return { error: 'Unable to fetch location' }
    }
  }catch(error){
    console.log(error)
  }
}

exports.getWeatherByCityName = async(req, res) => {
  try{
    const city = req.params.city;
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=be9fdbf6e71eb84b361ce6debe87f00a`);
    const data = {}
    data.cityName = response.data.name;
    data.weather = response.data.main;
    data.coord = response.data.coord;
    console.log('Data', data)
    res.json(data)
  }catch(err){
    res.send(err)
  }
  
}