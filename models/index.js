import { Sequelize } from 'sequelize';
import { mysql as dbConfig } from '../config/db.config.js';
import initUserModel from './user.model.js';

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  pool: dbConfig.pool,
  define: {
    timestamps: true, 
    underscored: true, 
  }
}, );

const User = initUserModel(sequelize, Sequelize);


export { sequelize, User };
