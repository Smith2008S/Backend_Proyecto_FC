module.exports = function proTweet(ansTweetAPI) {
  return new Promise(function (resolve, reject) {
    try {
      var statuses = ansTweetAPI.statuses;
      res = [];
      for (const item of statuses) res.push({text: item.text});
      resolve(res);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
