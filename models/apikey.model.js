import { DataTypes } from 'sequelize';

const initApiKeyModel = (sequelize) => {
  const ApiKey = sequelize.define('api_keys', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    api_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    secret_key: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    tableName: 'api_keys',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });

  return ApiKey;
};

export default initApiKeyModel;
