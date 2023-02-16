// sk_test_51MZxjmAIcUHJiGANrzUEpJXqws2jZcluanrb5LVYLUVWoOdDZ0Tir6Oy5qf7NiK521rDlORSg2DvidLeDlWKy4w9009S08a3PY
//price_1MZxnoAIcUHJiGANXGp6cTIV - biriyani
//price_1MZxoyAIcUHJiGANkxTxE6G8  -grapes
//price_1MZxpcAIcUHJiGANZiEh9MDs   -apple
// price_1MZxqWAIcUHJiGANfnKyoVPT -seafood kottu
// price_1MZxrZAIcUHJiGANLn70xPYq   -chicken kottu
// price_1MZxsZAIcUHJiGANK46xck7F   - nasi goreng
// price_1MZxtLAIcUHJiGANBgkTVbwL - rainbow uni corn
// price_1MZxu2AIcUHJiGANaDDxdF7l - chicken fried rice
// price_1MZxuoAIcUHJiGANFKgMu7dy - choccolate ice cream
// price_1MZxvXAIcUHJiGANlNcxTIps- Strawberry butterscotch ice cream
// price_1MZxwDAIcUHJiGANxYum4EeT -rambutan
//  price_1MZxwpAIcUHJiGANFvdsdbAA  Vanilla creamy ice cream
//   price_1MZxxOAIcUHJiGANfFbM9NDQ   Cheese kottu
// price_1MZxxtAIcUHJiGANUpcZcusY - orange
// price_1MZxyNAIcUHJiGANd9s8FScD - mango
// price_1MZxyqAIcUHJiGAN6HOKDJvF - seadfood rice
//  price_1MZxzSAIcUHJiGANndAagVV4      Vegetable kottu
//  price_1MZy00AIcUHJiGANbCacFfuH- Dolphin kottu
// Mixed flavor ice cream  - price_1MZy0ZAIcUHJiGANJ2GuFa7Z
const dotenv=require("dotenv").config();
const express=require("express");
const cors=require("cors");
const stripe=require("stripe")(process.env.SECRET_URL);

const app=express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.post("/checkout",async(req,res)=>{
    
console.log(req.body) 
    const items=req.body.items;
    let lineItems=[];
    items.forEach((item)=>{
       lineItems.push({
        price:item.id,
        quantity:item.quantity
       })
    });

    console.log(lineItems);
    

    const session=await stripe.checkout.sessions.create({
        line_items:lineItems,
        mode: "payment",
        success_url: "http://localhost:3000",
        cancel_url: "http://localhost:3000/cancel"
    });
   
  res.send(JSON.stringify({
     url:session.url
  }));


});

app.listen(4000,()=>console.log("listening on port 4000"));
