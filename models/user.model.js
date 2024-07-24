import { DataTypes, Sequelize } from 'sequelize';

const initUserModel = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    authy_id: {
      type: DataTypes.STRING 
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW 
    },
  }, {
    underscored: true,
    timestamps: true,
    tableName: 'users',
  });
  
  return User;
};

export default initUserModel;
