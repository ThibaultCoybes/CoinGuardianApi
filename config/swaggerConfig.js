import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CoinGuardian API',
      version: '1.0.0',
      description: 'API sécurisée et performante pour l\'intégration de CoinGuardian, une application mobile permettant de suivre et gérer efficacement les portefeuilles de cryptomonnaies. Permet l\'accès aux données du marché en temps réel, la gestion des utilisateurs, et l\'interaction sécurisée avec les services de Binance.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

export default specs;
