const { parse } = require("url");
const axios = require("axios");

const profileApiUrl = "https://api.kth.se/api/profile/1.1/";

module.exports = async function(req, res) {
  try {
    const { username } = parse(req.url, true).query;
    const response = await axios.get(profileApiUrl + username);

    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(response.data, null, 2));
  } catch (e) {
    console.error(e.message);
    res.setHeader("Content-Type", "text/html");
    res.status(500).send("<h1>API request invalid</h1>");
  }
};
