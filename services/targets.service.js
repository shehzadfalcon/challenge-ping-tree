var redis = require("../lib/redis");
var dayjs = require("dayjs");

//get all
exports.getTargets = () => {
  return new Promise((resolve, reject) => {
    redis.get("targets", (err, data) => {
      if (err) {
        reject(err);
      }
      if (data !== null) {
        data = JSON.parse(data);
        resolve(data);
      } else {
        resolve(data);
      }
    });
  });
};
//get one
exports.getTarget = (id) => {
  return new Promise((resolve, reject) => {
    redis.get("targets", (err, data) => {
      if (err) {
        reject(err);
      }
      if (data !== null) {
        data = JSON.parse(data);
        let filteredData = data.targets.find((target) => target.id == id);

        resolve(filteredData);
      } else {
        resolve(data);
      }
    });
  });
};
//update one
exports.updateTarget = (id, body) => {
  return new Promise((resolve, reject) => {
    redis.get("targets", (err, data) => {
      if (err) {
        reject(err);
      }
      if (data !== null) {
        data = JSON.parse(data);
        let targetIndex = data.targets.findIndex((target) => target.id == id);
        if (targetIndex !== -1) {
          data.targets[targetIndex] = body;
          redis.setex("targets", 3600, JSON.stringify(data));
        }
        resolve(data);
      } else {
        resolve(data);
      }
    });
  });
};
//create
exports.createTargets = (body) => {
  return new Promise((resolve, reject) => {
    redis.get("targets", (err, data) => {
      if (err) {
        reject(err);
      }

      redis.setex("targets", 3600, JSON.stringify(body));
      resolve(null);
    });
  });
};

//get per day target
exports.getTargetPerDayCount = (id, date1, publisher) => {
  return new Promise((resolve, reject) => {
    redis.get(`targetPerDay${id}${date1}${publisher}`, (err, data) => {
      if (err) {
        reject(err);
      }
      if (data !== null) {
        data = JSON.parse(data);
        resolve(data);
      } else {
        resolve(data);
      }
    });
  });
};
//create per day target
//
exports.createPerDayCount = (id, body) => {
  return new Promise((resolve, reject) => {
    redis.setex(
      `targetPerDay${id}${body.date}${body.publisher}`,
      3600,
      JSON.stringify(body)
    );
    resolve(true);
  });
};
