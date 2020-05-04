const router = require("express").Router();
const callNLUnderstanding = require("../utils/watsonNL");
const proDataNL = require("../utils/proDataNL");
const callTwitter = require("../utils/twitterAPI");
const proTweet = require("../utils/proTweet");
const params = require("../params");
const fs = require("fs");

// Watson NLU Route for analize text
router.post("/upload-text", async function (req, res) {
  const inputText = req.body.text;
  console.log(inputText);

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
          for (const item of tweetAns) {
            await callNLUnderstanding(params, item).then((ans) =>
              proDataNL(ans).then((finalRes) => {
                if (finalRes.text != "vacio")
                  finalJson.push({ tweet: item, analysis: finalRes });
              })
            );
          }
        })
      );

      res.json((finalJson));
    }
  } catch (err) {
    res.status(500).json({ message: "No se pudo analizar el texto ingresado" });
  }
});

router.get("/getTweets/:hashtag", async function (req, res) {
  const hashTag = req.params.hashtag;

  try {
    if (!hashTag) {
      res.send({
        status: false,
        message: "No hashtag detected",
      });
    } else {
      let finalJson = [];
      await callTwitter(params, hashTag).then((ans) => {
        for (const i of ans.statuses) {
          if (!finalJson.includes(i.text)) finalJson.push(i.text);
        }
      });
      fs.writeFile("./doc22.txt", finalJson, (err) => {
        if (err) console.log(err);
      });
      res.json(finalJson);
    }
  } catch (err) {
    res.status(500).json({ message: "No se pudo analizar el texto ingresado" });
  }
});

module.exports = router;
