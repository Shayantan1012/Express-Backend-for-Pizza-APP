const { WebhookClient ,Payload } = require('dialogflow-fulfillment');
const {getAllProductsData}=require('../services/productService')
const serverConfig = require('../config/serverConfig');



 async function handleWebhookRequest (req, res) {
  const agent =  new WebhookClient({ request: req, response: res });



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



async  function storeOrder(agent) {
    const productsData=await getAllProductsData();
    console.log(productsData)
    const requestedProduct = agent.parameters['food-item'].map(product=>product.toLowerCase().replace(/\s+/g, ''));
console.log(requestedProduct)
    agent.add('Order stored by Shayantan!');
  }







  let intentMap = new Map();
  if(agent.intent=='showMenu')intentMap.set('showMenu', visitMenu);
  if(agent.intent=='giveOrder') intentMap.set('giveOrder', storeOrder);
  if(agent.intent=='foodQueryIntent') intentMap.set('foodQueryIntent', foodQuery);

  console.log('This is the Intent-->',intentMap)
  console.log('This is the Parameters-->',agent.parameters);
  console.log('This is the Intent-->',agent.intent);

    if(intentMap.size!=0)await agent.handleRequest(intentMap);
};




module.exports = {handleWebhookRequest};




