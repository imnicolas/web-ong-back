const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
require('dotenv').config();
const mercadopago = require("mercadopago");

const routing_deploy = "../front-end/ong-front/dist/ong-front/index.html";
const routing_use = "../front-end/ong-front/dist/ong-front";

// ACCESS TOKEN
mercadopago.configure({
  access_token: process.env.TOKEN_FINAL.toString(),
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  express.static(
    path.join(__dirname, routing_use)
  )
);
app.use(cors());

app.get("/", function () {
  path.resolve(
    __dirname,
    routing_deploy
  );
});

app.post("/create_preference", (req, res) => {
  let preference = {
    items: [
      {
        title: req.body.description,
        unit_price: Number(req.body.price),
        quantity: Number(req.body.quantity),
      },
    ],
    back_urls: {
      success: "https://www.tudominio.com/success", // Aqui pegandole a la ruta en dist que es el folder del deploy
      failure: "https://www.tudominio.com/failure",
      pending: "",
    },
    auto_return: "approved",
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      res.json({
        id: response.body.id,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get("/feedback", function (req, res) {
  res.json({
    Payment: req.query.payment_id,
    Status: req.query.status,
    MerchantOrder: req.query.merchant_order_id,
  });
});

app.listen(8080, () => {
  console.log("The server is now running on Port 8080");
});
