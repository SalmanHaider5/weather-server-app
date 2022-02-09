const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.POSTGRES_DBNAME , process.env.POSTGRES_USERNAME, process.env.POSTGRES_PASS, {
  dialect: 'postgres' ,
  logging: false,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  pool: {
    max: Number(process.env.MAX_DB_CONNECTIONS) || 100,
    min: Number(process.env.MIN_DB_CONNECTIONS) || 50,
    idle: Number(process.env.IDLE_DB_TIME) || 10000,
    acquire: Number(process.env.ACQUIRE_DB) || 60000,
    evict: Number(process.env.EVICT_DB) || 1000
  }
});

exports.Models = async function () {

  const models = {};
  try {

    // models.kubePod = await sequelize.define('kubePod', {
    //   id: {
    //       type: Sequelize.INTEGER,
    //       primaryKey: true,
    //       autoIncrement: true,
    //   },
    //   data: { type: Sequelize.JSON }
    // });

    // models.appConfiguration = await sequelize.define('appConfiguration', {
    //   id: {
    //     type: Sequelize.INTEGER,
    //     primaryKey: true,
    //     autoIncrement: true,
    //   },
    //   configData: { type: Sequelize.TEXT },
    //   configType: { type: Sequelize.STRING},
    //   locale: { type: Sequelize.STRING }
    // },
    // {
    //   charset: 'utf8mb4',
    //   collate: 'utf8mb4_unicode_ci'
    // });

    models.Users = await sequelize.define('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      key: { type: Sequelize.STRING }
    });

    models.Weather = await sequelize.define('weather', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      long: { type: Sequelize.FLOAT },
      lat: { type: Sequelize.FLOAT },
      temp: { type: Sequelize.FLOAT },
      temp_min: { type: Sequelize.FLOAT },
      temp_max: { type: Sequelize.FLOAT },
      humidity: { type: Sequelize.FLOAT }
    })
    
    return models;
  }
  catch (err) {
    return (err);
  }

}


exports.dbsync = async function () {
  try {
    let mdl = await this.Models();
    await sequelize.sync({
      force: false  //careful when setting this to true . this will override table structures and will erase data
    });
  } catch (err) {
      console.log(err)
    return err
  }
}

exports.healthcheck = async function(){
    try{
      let data = await sequelize.query("SELECT NOW()", { type: sequelize.QueryTypes.SELECT});
      return data;
      
    }catch(error){
      return new Promise( (resolve, reject) =>{
        return reject(error);
      })
    }
}