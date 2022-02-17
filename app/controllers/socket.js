const { createUser, validateUser } = require('./users');
const { getWeather } = require('./weather')

exports.getSocketConnection = async socket => {
    socket.on('user_info', async (data) => {
        if(data.key){
          const userValidated = await validateUser(data.key)
          console.log('User', userValidated)
          if(userValidated){
            await getWeather(data, socket)
            // socket.emit('weather_update', res)
          }else{
            socket.emit('weather_update', {response: 'User is not verified'})
          }
        }else{
          const user = await createUser()
          socket.emit('new_user', user);
        }
    })    
}