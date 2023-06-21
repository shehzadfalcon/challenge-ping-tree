var redis = require("../lib/redis");
var dayjs = require("dayjs");
const TargetService = require("../services/targets.service");

// create a target
exports.createTarget = async (req, res) => {
  try {
    let body = req.body;
    //create target
    await TargetService.createTargets(body);
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false });
  }
};

// get targets
exports.getTargets = async (req, res, next) => {
  try {
    let data = await TargetService.getTargets();
    res.json({ data });
  } catch (error) {
    res.json({ success: false });
  }
};

// get a target
exports.getTarget = async (req, res, next) => {
  try {
    let id = req.params.id;
    let data = await TargetService.getTarget(id);
    res.json({ data });
  } catch (error) {
    res.json({ success: false });
  }
};

// update a target
exports.updateTarget = async (req, res, next) => {
  try {
    let id = req.params.id;
    let body = req.body;
    let data = await TargetService.updateTarget(id, body);
    res.json({ data });
  } catch (error) {
    res.json({ success: false });
  }
};

// update a target
exports.targetDecision = async (req, res, next) => {
  try {
    let body = req.body;
    const date1 = dayjs(body.timestamp).format("YYYY-MM-DD");
    let geoState = body.geoState; //geoState
    let publisher = body.publisher; //publisher
    let data = await TargetService.getTargets();
    if (data && data?.targets?.length > 0) {
      let filteredTarget = data.targets.find(
        (item) => item.accept.geoState.$in.includes(geoState) == true
      );

      if (filteredTarget) {
        let dataPerDay = await TargetService.getTargetPerDayCount(
          filteredTarget.id,
          date1,
          publisher
        );
        // let same = date1.diff(date2, "d");

        let maxAcceptsPerDay = filteredTarget.maxAcceptsPerDay;
        if (dataPerDay == null) {
          let bodyPerDay = {
            count: 0,
            date: date1,
            publisher: publisher,
          };
          //create per day
          await TargetService.createPerDayCount(filteredTarget.id, bodyPerDay);
        } else if (dataPerDay !== null) {
          const dataPerDayDate = dayjs(dataPerDay.date);
          const date2 = dayjs(body.timestamp);
          let same = dataPerDayDate.diff(date2, "d");
          if (dataPerDay.count < maxAcceptsPerDay && same == 0) {
            dataPerDay["count"]++; //increment in per day count
            await TargetService.createPerDayCount(
              filteredTarget.id,
              dataPerDay
            );
          }
        }
        let count = dataPerDay?.count || 0;
        let remainingTarget = data.targets.reduce(function (prev, current) {
          return prev.value > current.value ? prev : current;
        });

        return res.json({ url: remainingTarget.url, count: count });
      } else {
        return res.json({ decision: "reject" });
      }
    } else {
      res.json({ data });
    }
  } catch (error) {
    console.log("Error-->", error.message);
    res.json({ success: false });
  }
};
