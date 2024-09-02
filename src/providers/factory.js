import dayjs from "dayjs";
import _ from "lodash";

const factoryDaily = (daily = []) => {
  console.log(daily);
  if (Array.isArray(daily)) {
    const computedDaily = (daily || [])?.reduce((acc, item) => {
      if (item.avg !== null) {
        acc.push(item);
      }
      return acc;
    }, []);

    const getDailyFilter = () => {
      const sortedDates = _.chain(computedDaily)
        .map((item) => Object.keys(item.perDate))
        .flattenDeep()
        .uniq()
        .sortBy(function (o) {
          return new Date(o).getTime();
        })
        .value();
      console.log(sortedDates);
      return [
        dayjs(sortedDates[0]),
        dayjs(sortedDates[sortedDates.length - 1]),
      ];
    };
    console.log(getDailyFilter());
    return {
      daily: computedDaily,
      dayRange: getDailyFilter(),
    };
  }
  return {
    daily: [],
    dayRange: [dayjs(), dayjs()],
  };
};

const factoryWeekly = (weekly = []) => {
  const computedWeekly = weekly?.reduce((acc, item) => {
    if (Object.keys(item.perWeek).length !== 0) {
      acc.push(item);
    }
    return acc;
  }, []);

  const getWeeklyFilter = () => {
    const sortedDates = _.chain(computedWeekly)
      .map((item) => Object.keys(item.perWeek))
      .flattenDeep()
      .uniq()
      .sort((a, b) => _.toNumber(a) - _.toNumber(b))
      .value();
    return sortedDates;
  };

  return {
    weekly: computedWeekly,
    weekRange: getWeeklyFilter(),
  };
};

const factoryMonthly = (monthly = []) => {
  const computedMonthly = monthly.reduce((acc, item) => {
    if (Object.keys(item.perMonth).length !== 0) {
      acc.push(item);
    }
    return acc;
  }, []);

  const getMonthlyFilter = () => {
    const from = computedMonthly?.map((item) => item.from);
    const to = computedMonthly?.map((item) => item.to);
    const mostFrom = _.min(from, function (el) {
      return new Date(el).getTime();
    });
    const mostTo = _.max(to, function (el) {
      return new Date(el).getTime();
    });
    return [dayjs(mostFrom), dayjs(mostTo)];
  };

  return {
    monthly: computedMonthly,
    dayRange: getMonthlyFilter(),
  };
};

export { factoryDaily, factoryWeekly, factoryMonthly };
