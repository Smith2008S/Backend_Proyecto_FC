const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

// "nl_version": "2020-04-30",
// "nl_api_key": "Zf0vXkfcizlhQ0LdxNUiBL4HrfmxvbOKabxbS846fy3S",
// "nl_url": "https://api.eu-gb.natural-language-understanding.watson.cloud.ibm.com/instances/153394d7-56b3-4dd7-abe6-e0deffe7f886",
// "nl_model_id": "43c58670-f917-43b6-afda-470724a251ca",

function callNLUnderstanding(params, text) {
  return new Promise(function (resolve, reject) {
    if (params.nl_api_key !== "") {
      console.log("Text uploaded\nAnalyzing text...");
      const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: params.nl_version,
        authenticator: new IamAuthenticator({
          apikey: params.nl_api_key,
        }),
        url: params.nl_url,
      });

      const analyzeParams = {
        text: text,
        features: {
          entities: {
            model: params.nl_model_id,
          },
          relations: {
            model: params.nl_model_id,
          },
        },
      };

      naturalLanguageUnderstanding
        .analyze(analyzeParams)
        .then((analysisResults) => {
          resolve(analysisResults.result);
        })
        .catch((err) => {
          console.log("error:", err);
          reject(err);
        });
    } else {
      console.log("Null NL Api key");
    }
  });
}

module.exports = callNLUnderstanding;
