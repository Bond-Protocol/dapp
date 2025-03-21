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

    const data = await response.json();
    logResponse({ status: response.status, path: req.path, content: data });
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/orders/address/*", async (req, res) => {
  try {
    const auth = req.header("Authorization");

    const response = await fetch(api + req.path, {
      headers: {
        ...getCommonHeaders(req),
        Authorization: auth,
      },
    });

    const data = await response.json();
    logResponse({ path: req.path, status: response.status, content: data });

    res.status(response.status).send(data);
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).send(error.message);
  }
});

app.post("/orders/address/*", async (req, res) => {
  try {
    const auth = req.header("Authorization");

    const response = await fetch(api + req.path, {
      method: "post",
      headers: {
        ...getCommonHeaders(req),
        Authorization: auth,
      },
    });

    logResponse({ path: req.path, status: response.status });

    res.status(response.status).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/orders/new", async (req, res) => {
  try {
    const auth = req.header("Authorization");

    const response = await fetch(api + req.path, {
      method: "post",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...getCommonHeaders(req),
        Authorization: auth,
      },
    });

    logResponse({ status: response.status, path: req.path });

    res.status(response.status).send("");
  } catch (error) {
    console.log({ message: error.message });
    res.status(500).send(error.message);
  }
});

app.get("/*", async (req, res) => {
  try {
    const response = await fetch(api + req.path, {
      headers: getCommonHeaders(req),
    });

    logResponse({ status: response.status, path: req.path });
    res.status(response.status);
    if (textPaths.some((p) => p.includes(req.path))) {
      const text = await response.text();
      console.log({ text });
      res.json(text);
    }

    if (jsonPaths.some((p) => req.path.includes(p))) {
      const data = await response.json();
      console.log({ data });
      res.json(data);
    }
  } catch (error) {
    console.log({ message: error.message });
    res.status(500).send(error.message);
  }
});

const jsonPaths = ["/quote_tokens", "/fees/estimate"];
const textPaths = ["/auth/nonce"];

function logResponse({ status, path, content }) {
  console.log(`Path: ${path} - ${status}`);
  if (content) console.log({ content });
}

function getCommonHeaders(req) {
  const chainId = req.header("x-chain-id");
  const settlement = req.header("x-settlement");
  const aggregator = req.header("x-aggregator");

  return {
    "x-chain-id": chainId,
    "x-settlement": settlement,
    "x-aggregator": aggregator,
  };
}

app.listen(port, () => {
  console.log(`Order Service Proxy listening at http://localhost:${port}`);
});
