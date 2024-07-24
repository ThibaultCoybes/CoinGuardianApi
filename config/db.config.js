export const mysql = {
    HOST: 'localhost',
    USER: 'root',
    PASSWORD: 'root', 
    DB: 'coin_guardian',
    dialect: 'mysql',
    port: 8889, 
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
  
  