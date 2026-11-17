$env:NODE_ENV = "staging"
$env:MONGODB_URI = "mongodb+srv://jrrohithk_db_user:5rSHqeZkoF3RTYF3@moorthicafecluster.mrx8evm.mongodb.net/moorthi_cafe_staging?retryWrites=true&w=majority"
$env:ALLOW_STAGING_SEED = "true"
node scripts/seedMenu.js