const express=require('express');
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

app.use(cors({
    origin:serverConfig.FRONTEND_URL,
    credentials:true,
}));
app.use(express.text()); // Add this line to parse plain text
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
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


