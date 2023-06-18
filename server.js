const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

const mercadopago = require("mercadopago");

// ACCESS TOKEN
const PRODUCTION_LUIS =
  "APP_USR-8783793935974297-061721-515643ca4b2ade8f2fa2b43225ba97a1-48601413"
const TEST_CREDENTIAL =
  "TEST-1662046653454430-052619-b3c586b2f48964b1a0ad2c95867da2b3-139879099"
mercadopago.configure({
  access_token: TEST_CREDENTIAL,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  express.static(
    path.join(__dirname, "../landingong/src/app/landing/componentes")
  )
);
app.use(cors());

app.get("/", function () {
  path.resolve(
    __dirname,
    "..",
    "landingong/src/app/landing/componentes/",
    "boton-de-pago.component.html"
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
