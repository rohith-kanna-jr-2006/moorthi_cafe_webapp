@echo off
set NODE_ENV=staging
set MONGODB_URI=mongodb+srv://jrrohithk_db_user:5rSHqeZkoF3RTYF3@moorthicafecluster.mrx8evm.mongodb.net/moorthi_cafe_staging?retryWrites=true&w=majority
set ALLOW_STAGING_SEED=true
node seed-staging.js