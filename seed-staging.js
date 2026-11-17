require('dotenv').config({ path: require('path').resolve(__dirname, 'backend/.env') });

process.env.NODE_ENV = 'staging';
process.env.MONGODB_URI = 'mongodb+srv://jrrohithk_db_user:5rSHqeZkoF3RTYF3@moorthicafecluster.mrx8evm.mongodb.net/moorthi_cafe_staging?retryWrites=true&w=majority';
process.env.ALLOW_STAGING_SEED = 'true';

require('./backend/scripts/seedMenu.js')();