require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const urlDatabase = {};

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/shorturl", (req, res) => {
  const originalUrl = req.body.url;
  const existingShortUrl = Object.keys(urlDatabase).find(key => urlDatabase[key] === originalUrl);
  if (existingShortUrl) {
    res.json({ original_url: originalUrl, short_url: existingShortUrl });
    return;
  }
  const shortUrl = Object.keys(urlDatabase).length + 1;
  urlDatabase[shortUrl] = originalUrl;
  res.json({ original_url: originalUrl, short_url: shortUrl });
});

app.get("/api/shorturl/:short_url", (req, res) => {
  const shortUrl = req.params.short_url;
  const originalUrl = urlDatabase[shortUrl];
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: "Invalid short URL" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
