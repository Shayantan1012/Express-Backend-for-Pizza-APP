const { WebhookClient ,Payload } = require('dialogflow-fulfillment');
const {getAllProductsData}=require('../services/productService')
const serverConfig = require('../config/serverConfig');
const {  getCart } = require('./cartService');



let requestedProduct=[];
let productsQuantity=[];
let finalOrder=[];
let nonAvailableProductsQuantity= [];
let availableProducts=[];
let removeFromCart=[];

async function handleWebhookRequest (req, res) {
  try{
    const agent =  new WebhookClient({ request: req, response: res });
    // console.log('User ID:', console.log('User ID:', agent));
    let userId = agent?.originalRequest?.payload?.userId;
  
  
    async function visitMenu(agent) {
  
      const productsData=await getAllProductsData();
      
      const payload = {
        "richContent": productsData.map((product) => [
          {
            "type": "image",
            "rawUrl": product.productImage || "https://example.com/images/logo.png", // Use dynamic or fallback URL
            "accessibilityText": "Product Image",
          },
          {
            "type": "info",
            "title": product.productName, // Dynamic product name
            "subtitle": `${product.description}\nPrice: ${product.price}\n${product.inStock ? "Available now!" : "Not Available!"}`, // Combine all info in one subtitle
            "actionLink": product.productLink || "https://example.com" // Use dynamic or fallback link
          },
          {
            "type": "chips",
            "options": [
              {
                "text": "Go to Product",
                 "link":  `${serverConfig.FRONTEND_URL}/product/${product._id}` || "https://cloud.google.com/dialogflow/case-studies",
                "action": {
                  "type": "navigate",
                  "url":  `${serverConfig.FRONTEND_URL}/product/${product._id}` || "https://cloud.google.com"
                }
              }
            ]
          }      ])
      };
  
  
    agent.parameters?agent.add('Yes! What You want to order?? We have a lot of options for you!!'):null;
    agent.parameters?agent.add(new Payload(agent.UNSPECIFIED, payload, {sendAsMessage:true, rawPayload: true })):null;
      };
     
  
    async function foodQuery(agent) {
     const productsData=await getAllProductsData();
     const requestedProduct = agent.parameters['food-item'].map(product=>product.toLowerCase().replace(/\s+/g, ''));
     const products=agent.parameters['food-item']
     const allProducts = productsData
            .filter(product => product && product.productName && product.inStock) // Ensure valid data
            .map(product => product.productName.toLowerCase().replace(/\s+/g, ''));
        availableProducts = []
        
        const orderPhrases = [
          "So, what would you like to order?",
          "What can I get for you today?",
          "What would you like to have?",
          "What can I assist you with in terms of your order?",
          "What are you in the mood for today?",
          "What can I help you order?",
          "What would you like to choose?",
          "Is there anything you'd like to order?"
        ];
  
        for (const product of requestedProduct) {
           if(allProducts.includes(product)){
            availableProducts.push(product);
           }
        }
        availableProducts=products.filter(product=>availableProducts.includes(product.toLowerCase().replace(/\s+/g, '')));
            if(availableProducts.length==0)agent.add('Sorry no product available!!')
            else if(availableProducts.length!=requestedProduct.length){
              agent.add(`Sorry, only ${availableProducts} ${availableProducts.length==1?'is':'are'} available!!`);
              agent.add(`${orderPhrases[Math.floor(Math.random() * orderPhrases.length)]}`);
            }
          else {
        agent.add(`Yes, ${availableProducts} ${availableProducts.length==1?'is':'are'} available!!`);
        agent.add(`${orderPhrases[Math.floor(Math.random() * orderPhrases.length)]}`);
          }
  
      }
  
  
  async  function queryOrder(agent) {
  
      requestedProduct = agent.parameters['food-item'].map(product=>product.toLowerCase().replace(/\s+/g, ''));
      productsQuantity=agent.parameters['number']
      const quantity=agent.parameters['quantity']
  
        if(quantity.length!=0){
          agent.add('Please dont use article or noun phrase like:');
          agent.add('I want a couple of burgers. Instead use: I want 2/two burgers');
          return;
        }
  
        if(productsQuantity.length==0){
          agent.add('Please provide the quantity of each item!!');
          return;
        }
        if(requestedProduct.length==0){
          agent.add('Please provide the items you want to order!!');
          return;
        }
  if(requestedProduct.length==productsQuantity.length){
  
    const payload = {
      "richContent": [
        ...agent.parameters['food-item'].map((product,index) => 
        [{
          "type": "info",
          "title": product,
          "subtitle": `Quantity: ${productsQuantity[index]}`,
        }]),
      ]
    };
  
    agent.add(new Payload(agent.UNSPECIFIED, payload, { sendAsMessage: true, rawPayload: true }));
    agent.add('Okey!!Are all the product and quantity correct??');
    return ;
        }
        else{
          agent.add('Please provide the quantity of each item!! Like: I want 2/two Siciilian Pizza and 3/three Margherita Pizza');
          return;
        }
  
   }
  
  
   
   async function giveOrderFollwup(){
  
  agent.add('Do you want to add the order to cart??');
  
   }
  
  async function giveOrderFollwup_yes(){
  
  const productsData=await getAllProductsData();
  
    const allProducts = productsData  //Accept all products from the router
    .filter(product => product && product.productName && product.inStock) // Ensure valid data
    .map(product => product);
  
    availableProducts = [];
    requestedProduct.forEach((product,index)=>{//Filtering the all products and matching with the requested products by name
      const matchingItem=allProducts.find(item=>item.productName.toLowerCase().replace(/\s+/g, '')==product);
   
      if(matchingItem){
        availableProducts.push(matchingItem)
      }
    })
     
  
  
    requestedProduct.forEach((product,index)=>{//Filtering the all products and matching with the requested products by Quantity and whose quantity is less than requested quantity
      const nonMatchingQuanItem=allProducts.find(item=>item.productName.toLowerCase().replace(/\s+/g, '')==product && item.quantity<productsQuantity[index]); 
      if(nonMatchingQuanItem){
        nonAvailableProductsQuantity.push(nonMatchingQuanItem)
      }
    })
  
  
  
    if(nonAvailableProductsQuantity.length!=0){//Stores whose quantity is less than requested quantity
      agent.add('Sorry, we do not have enough quantity of the following products: ');
      agent.add(nonAvailableProductsQuantity.map(product=>`${product.productName} present  (${product.quantity}) items only!!`));
      agent.add('Would you like to proceed with the available products??');
       // Save context to track the user's response
       agent.context.set({
        name: 'awaiting_response',
        lifespan: 2, // Context will stay active for 5 turns
        parameters: { isWaiting: true }
  
      });
      return;
      }
    
   if(availableProducts.length==0){
    agent.add('Sorry no product available!!')
    return;
   }
  
   if(availableProducts.length!=requestedProduct.length){//
    const avaiproductsData=availableProducts.map(product=>product.productName);
    agent.add(`Sorry, only ${avaiproductsData} ${avaiproductsData.length==1?'is':'are'} available!!`);
    agent.add('Do you want to give the order for the available products??');
    agent.context.set({
      name: 'awaiting_response2',
      lifespan: 2, // Context will stay active for 5 turns
      parameters: { isWaiting: true }
    });
    finalOrder=availableProducts
  return;
   }
  
   finalOrder=availableProducts
   orderMap=requestedProduct.map((product,index)=>({product:product,quantity:productsQuantity[index]}))
   
   finalOrder.forEach((product)=>product.quantity=orderMap.find(item=>item.product==product.productName.toLowerCase().replace(/\s+/g, '')).quantity)
  
  agent.add('All products are available. Please proceed for payment.');  
  agent.context.set({
    name: 'ongoingPayment',
    lifespan: 2, // Context will stay active for 5 turns
    parameters: { isWaiting: true }
  })
  
   return; 
  }
  
  
  function handleYes(agent) {
      if(agent.intent=='giveOrder - yes - yes - nonAvailableProductsQuantity-yes'){
        finalOrder=[]
        orderMap=requestedProduct.map((product,index)=>({product:product,quantity:productsQuantity[index]}))
        finalOrder=nonAvailableProductsQuantity
  
        availableProducts.forEach((product,index)=>{
          if(!nonAvailableProductsQuantity.includes(product)){
            const newProduct=product;
            newProduct.quantity=orderMap.find(item=>item.product==product.productName.toLowerCase().replace(/\s+/g, '')).quantity;
            finalOrder.push(newProduct);
          }
        }
      )
      agent.add('Okay, your Ordered List has been updated.');
      agent.add('Do you want to proceed to payment??');
      agent.context.set({
        name: 'ongoingPayment',
        lifespan: 2, // Context will stay active for 5 turns
        parameters: { isWaiting: true }
      })
      return ;
    }
      else if(agent.intent=='giveOrder - yes - yes -nonAvailableProduct- yes'){
        orderMap=requestedProduct.map((product,index)=>({product:product,quantity:productsQuantity[index]}))
        finalOrder=availableProducts
        finalOrder.forEach((product,index)=>{
          product.quantity=orderMap.find(item=>item.product==product.productName.toLowerCase().replace(/\s+/g, '')).quantity;
          }
      )
  
      agent.add('Okay, your Ordered List has been updated.');
      agent.add('Do you want to proceed to payment??');
      agent.context.set({
        name: 'ongoingPayment',
        lifespan: 5, // Context will stay active for 5 turns
        parameters: { isWaiting: true }
      })
      return ;
      }
     else {
      agent.add("Sorry, I didn't understand that. Please confirm again.");
    }
  }
  
  // Handle "No" Intent
  function handleNo(agent) {
    if(agent.intent=='giveOrder - yes - yes - nonAvailableProductsQuantity-no'){
        agent.add('Okay, your order has been canceled.');
        agent.context.set({
          name: 'orderContext',
          lifespan: 5, // Context will stay active for 5 turns
          parameters: { isWaiting: true }
        });    
        return ;
      }
  
      else if(agent.intent=='giveOrder - yes - yes -nonAvailableProduct- no'){
        agent.add('Okay, your order has been canceled.');
        agent.context.set({
          name: 'orderContext',
          lifespan: 5, // Context will stay active for 5 turns
          parameters: { isWaiting: true }
        });    
        return ;
      }
     else {
      agent.add("Sorry, I didn't understand that. Please confirm again.");
    }
  }
  
  
  async function cartIntent(operation) {
    const userCart=await getCart(userId);
  removeFromCart=userCart;
  const allProduct=await getAllProductsData();
  finalOrder.forEach((product) => {
    const item = userCart.items.find(
      (item) => item.product._id.toString() === product._id.toString()
    );
  
      if (item) {
      if(operation==true)item.quantity += product.quantity;
      else {
        item.quantity -= product.quantity;
        if(item.quantity<0)item.quantity=0;
      }
    }
    else{
      userCart.items.push({
      product:product,
      quantity:product.quantity});
    }
  });
  await userCart.save();
  
  /////////Now Change the product Schema////////////////
  
  for (const product of finalOrder) { 
    const item = allProduct.find(
      (item) => item._id.toString() === product._id.toString()
    );
    if (item) {
      item.quantity -= product.quantity; // Update quantity
      await item.save(); 
    }
  }
  return ;
  }
  
   async function payment(){
  
      await  cartIntent(true);
  
    agent.add('Ok,I am giving you a link to Payment!!!');
    const payload ={
      "richContent": [
        [
          {
            "type": "button",
            "icon": {
              "type": "chevron_right",
              "color": "#FF9800"
            },
            "text": "Payment here",
            "link":   `${serverConfig.FRONTEND_URL}/cart`,
            "event": {
              "name": "",
              "languageCode": "",
              "parameters": {}
            }
          }
        ]
      ]
    }
  agent.add(new Payload(agent.UNSPECIFIED, payload, { sendAsMessage: true, rawPayload: true }));
  agent.add('Please click on the link to make payment!!');
  // agent.context=[];
  }
  
  
  async function Remove(){
  if(finalOrder==0 ){
    agent.add('Sorry No product present to remove!!');
    return;
  }
  removedProduct = agent.parameters['food-item'].map(product=>product.toLowerCase().replace(/\s+/g, ''));
  removedQuantity=agent.parameters['number']
  
  
  if(removedProduct !=0 && removedQuantity.length!=removedProduct.length){
    agent.add ('Please mentioned the removed quantity of eachproduct.')
    return;
  }
  
  
    if (removedProduct != 0 && removedQuantity == 0) {
      removedProduct.forEach((product) => {
        const item = finalOrder.find(item => item.productName.toLowerCase().replace(/\s+/g, '') === product);
        if (item) {
          const index = finalOrder.indexOf(item);
          if (index > -1) {
            finalOrder.splice(index, 1);  // Remove the item from finalOrder
          }
        }
      });
    }
  
  if(removedProduct!=0 && removedQuantity.length==removedProduct.length){
    removedProduct.forEach((product,index) => {
      const item = finalOrder.find(item => item.productName.toLowerCase().replace(/\s+/g, '') === product);
      if (item) {
        item.quantity-=removedQuantity[index];
        if(item.quantity<0)item.quantity=0;
        }
      })
  }
  
   if(finalOrder!=0 && removeFromCart!=0){
          await cartIntent(false);
        }
  
  agent.add('Removed Succefully!!')
  
  return;
  }
  
  
    let intentMap = new Map();
    if(agent.intent=='showMenu')intentMap.set('showMenu', visitMenu);
    if(agent.intent=='giveOrder') intentMap.set('giveOrder', queryOrder);
    if(agent.intent=='foodQueryIntent') intentMap.set('foodQueryIntent', foodQuery);
    if(agent.intent=='giveOrder - yes') intentMap.set('giveOrder - yes', giveOrderFollwup);
    if(agent.intent=='giveOrder - yes - yes') intentMap.set('giveOrder - yes - yes', giveOrderFollwup_yes);
    if(agent.intent=='giveOrder - yes - yes -nonAvailableProductsQuantity- no') intentMap.set('giveOrder - yes - yes -nonAvailableProductsQuantity- no', handleNo);
    if(agent.intent=='giveOrder - yes - yes - nonAvailableProductsQuantity-yes') intentMap.set('giveOrder - yes - yes - nonAvailableProductsQuantity-yes', handleYes);
    if(agent.intent=='giveOrder - yes - yes -nonAvailableProduct- no') intentMap.set('giveOrder - yes - yes -nonAvailableProduct- no', handleNo);
    if(agent.intent=='giveOrder - yes - yes -nonAvailableProduct- yes') intentMap.set('giveOrder - yes - yes -nonAvailableProduct- yes', handleYes);
    if(agent.intent=='payment') intentMap.set('payment', payment);
    if(agent.intent=='RemoveItem')intentMap.set('RemoveItem',Remove);
  
  
    console.log('This is the Intent-->',intentMap)
    console.log('This is the Parameters-->',agent.parameters);
    console.log('This is the Intent-->',agent.intent);
    console.log('This is the context->',agent.context);
  
      if(intentMap.size!=0)await agent.handleRequest(intentMap);
  
  }
  catch(error){
    console.log('Error in handleWebhookRequest',error)
};
  }

module.exports = {handleWebhookRequest};




