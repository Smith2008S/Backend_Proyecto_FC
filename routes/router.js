const router = require("express").Router();
const callNLUnderstanding = require("../utils/watsonNL");
const proDataNL = require("../utils/proDataNL");
const callTwitter = require("../utils/twitterAPI");
const proTweet = require("../utils/proTweet");
const params = require("../params");

// Watson NLU Route for analize text
router.post("/upload-text", async function (req, res) {
  const inputText = req.body.text;

  try {
    if (!inputText) {
      res.send({
        status: false,
        message: "No text uploaded",
      });
    } else {
      await callNLUnderstanding(params, inputText).then((ans) =>
        proDataNL(ans).then((finalRes) => res.json(finalRes))
      );
      console.log("\nDone!");
    }
  } catch (err) {
    res.status(500).json({ message: "No se pudo analizar el texto ingresado" });
  }
});

// Route for retrieve tweets
router.get("/tweets/:hashtag", async function (req, res) {
  const hashTag = req.params.hashtag;

  try {
    if (!hashTag) {
      res.send({
        status: false,
        message: "No hashtag detected",
      });
    } else {
      let finalJson = [];
      await callTwitter(params, hashTag).then((ans) =>
        proTweet(ans).then(async (tweetAns) => {
          console.log(tweetAns);
          for (const item of tweetAns) {
            await callNLUnderstanding(params, item.text).then((ans) =>
              proDataNL(ans).then((finalRes) => finalJson.push(finalRes))
            );
          }
        })
      );
      res.json(finalJson);
    }
  } catch (err) {
    res.status(500).json({ message: "No se pudo analizar el texto ingresado" });
  }
});

module.exports = router;
