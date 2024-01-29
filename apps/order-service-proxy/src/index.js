import express, { json } from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const port = 8081;
const api = "https://public-api-server-testnet.up.railway.app";

app.use(json());
app.use(cors());

app.post("/auth/sign_in", async (req, res) => {
  try {
    const body = req.body;

    const response = await fetch(api + req.path, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(req.path, { response });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/orders/address/*", async (req, res) => {
  try {
    const chainId = req.header("x-chain-id");
    const settlement = req.header("x-settlement");
    const aggregator = req.header("x-aggregator");
    const auth = req.header("Authorization");

    const response = await fetch(api + req.path, {
      headers: {
        "x-chain-id": chainId,
        "x-settlement": settlement,
        "x-aggregator": aggregator,
        Authorization: auth,
      },
    });

    console.log(req.path, { response });

    const orders = await response.json();

    res.status(response.status).json(orders);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/orders/address/*", async (req, res) => {
  try {
    const chainId = req.header("x-chain-id");
    const settlement = req.header("x-settlement");
    const aggregator = req.header("x-aggregator");
    const auth = req.header("Authorization");

    const response = await fetch(api + req.path, {
      method: "post",
      headers: {
        "x-chain-id": chainId,
        "x-settlement": settlement,
        "x-aggregator": aggregator,
        Authorization: auth,
      },
    });

    console.log(req.path, { response });

    res.status(response.status).send("");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/orders/new", async (req, res) => {
  try {
    const chainId = req.header("x-chain-id");
    const settlement = req.header("x-settlement");
    const aggregator = req.header("x-aggregator");
    const auth = req.header("Authorization");
    const body = req.body;

    const response = await fetch(api + req.path, {
      method: "post",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        "x-chain-id": chainId,
        "x-settlement": settlement,
        "x-aggregator": aggregator,
        Authorization: auth,
      },
    });

    console.log(req.path, { response });

    res.status(response.status).send("");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/*", async (req, res) => {
  try {
    const chainId = req.header("x-chain-id");
    const settlement = req.header("x-settlement");
    const aggregator = req.header("x-aggregator");

    const response = await fetch(api + req.path, {
      headers: {
        "x-chain-id": chainId,
        "x-settlement": settlement,
        "x-aggregator": aggregator,
      },
    });

    console.log(req.path, { response });

    switch (req.path) {
      case "/auth/nonce": {
        const nonce = await response.text();
        res.json(nonce);
        break;
      }
      case "/quote_tokens": {
        const data = await response.json();
        res.json(data);
        break;
      }
      default:
        res.status(response.status).send("");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Order Service Proxy listening at http://localhost:${port}`);
});
