const express=require('express');
const bodyParser = require('body-parser')
const ServerConfig = require('./config/serverConfig');
const connectDB = require('./config/dbConfig');
const cartRouter = require('./routes/cartRoute');
const userRouter=require('./routes/useRoutes');
const authRouter=require('./routes/authRouter');
const cookieParser = require('cookie-parser');
const { isLoggedIn } = require('./validation/authValidation');
const productRouter = require('./routes/productRoutes');
const orderRoute = require('./routes/orderRoutes');
const app=express();
const cors=require('cors');
const serverConfig = require('./config/serverConfig');
const { handleWebhookRequest } = require('./services/chatBotService');

// Middleware

app.use(express.json());  // For handling JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());  // For handling cookies


app.use(cors({
    origin:serverConfig.FRONTEND_URL,
    credentials:true,
}));

app.use('/users',userRouter);
app.use('/carts',cartRouter);
app.use('/auth',authRouter);
app.use('/products',productRouter)
app.use('/orders',orderRoute);


app.post('/webhook', express.json(), handleWebhookRequest);  // Use the service function

// app.use('/chatbot',chatBotRouter);


app.listen(ServerConfig.PORT, async()=>{
    await connectDB();
    console.log(`Server got started at port ${ServerConfig.PORT}!!!!!!`);
});
//0viUsU9ZINsriSNG//




//Connection with Dialogflow and Webhook---------------->


