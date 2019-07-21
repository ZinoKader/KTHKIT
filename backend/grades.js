const { parse } = require("url");
const { getGrades } = require("./chromium");
const axios = require("axios");

module.exports = async function(req, res) {
  try {
    const { username, password } = parse(req.url, true).query;
    const grades = await getGrades(username, password);

    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(grades, null, 2));
  } catch (e) {
    console.error(e.message);
    res.setHeader("Content-Type", "text/html");
    res.status(500).send("<h1>API request invalid</h1>");
  }
};
