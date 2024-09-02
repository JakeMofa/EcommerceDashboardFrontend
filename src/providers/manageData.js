import _ from "lodash";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultDateRange, defaultWeek, defaultYear } from "../config";
import { factoryDaily, factoryMonthly, factoryWeekly } from "./factory";
import { useRouter } from "next/router";
import dayjs from "dayjs";

const initialState = {
  dailyTab: {
    data: [],
    dayRange: [],
  },
  weeklyTab: {
    data: [],
    weekRange: [],
  },
  monthlyTab: {
    data: [],
  },
  forecastTab: {
    data: [],
  },
};

const ManageDataContext = createContext(initialState);

const ManageDataProvider = ({ value, children }) => {
  const [values, setValues] = useState(initialState);
  const { push, query } = useRouter();

  const { daily, weekly, monthly, forecast } = values;

  const [weeklyFilter, setWeeklyFilter] = useState(defaultDateRange());
  const [dailyFilter, setDailyFilter] = useState(defaultDateRange());
  const computedDaily = useMemo(
    () => factoryDaily(value?.daily || []),
    [value?.daily]
  );
  const computedWeekly = useMemo(
    () => factoryWeekly(value?.weekly || []),
    [value?.weekly]
  );

  useEffect(() => {
    const { dayRange } = computedDaily;
    const { q, dBrandId } = query;
    if (q) {
      const parsed = JSON.parse(q || "{}");
      setDailyFilter([dayjs(parsed.from), dayjs(parsed.to)]);
    } else {
      // console.log(dayRange);
      if (dBrandId) {
        push({
          pathname: "/data/daily",
          query: {
            ...query,
            q: {
              from: dayRange[0].toISOString(),
              to: dayRange[1].toISOString(),
            },
          },
        });
      }
      setDailyFilter(dayRange);
    }
  }, [setDailyFilter, computedDaily, query, push]);

  useEffect(() => {
    if (value?.forecast) {
      setValues((s) => ({
        ...s,
        forecast: { ...s.forecast, data: value?.forecast },
      }));
    }
  }, [value?.forecast]);

  useEffect(() => {
    const { daily, dayRange } = computedDaily;
    if (daily) {
      setValues((s) => ({
        ...s,
        daily: { ...s.daily, data: daily, dayRange },
      }));
    }
  }, [computedDaily]);

  useEffect(() => {
    const { weekly, weekRange } = computedWeekly;
    if (weekly) {
      setValues((s) => ({
        ...s,
        weekly: { ...s.weekly, data: weekly, weekRange },
      }));
    }
  }, [computedWeekly]);

  useEffect(() => {
    if (value?.monthly) {
      const { monthly, dayRange } = factoryMonthly(value?.monthly);
      setValues((s) => ({
        ...s,
        monthly: { ...s.monthly, data: monthly, dayRange },
      }));
    }
  }, [value?.monthly]);

  const dailyTab = useMemo(() => {
    return {
      dailyFilter,
      setDailyFilter,
      daily,
      updateEndDate: (id, date) => {
        const update = daily.data.filter((fid) => {
          if (fid.id === id) {
            return {
              ...fid,
              vendoContractEndDate: date,
            };
          }
          return fid;
        });
        setValues((s) => ({
          ...s,
          dailyTab: {
            ...s.dailyTab,
            data: update,
          },
        }));
        return date;
      },
    };
  }, [daily, dailyFilter]);

  const weeklyTab = useMemo(() => {
    return {
      weekly,
      weeklyFilter,
      setWeeklyFilter,
      updateEndDate: (id, date) => {
        const update = weekly.data.filter((fid) => {
          if (fid.id === id) {
            return {
              ...fid,
              vendoContractEndDate: date,
            };
          }
          return fid;
        });
        setValues((s) => ({
          ...s,
          weeklyTab: {
            ...s.weeklyTab,
            data: update,
          },
        }));
        return date;
      },
    };
  }, [weekly, weeklyFilter]);

  const monthlyTab = useMemo(() => {
    return {
      monthly,
      updateEndDate: (id, date) => {
        const update = monthly.data.filter((fid) => {
          if (fid.id === id) {
            return {
              ...fid,
              vendoContractEndDate: date,
            };
          }
          return fid;
        });
        setValues((s) => ({
          ...s,
          monthlyTab: {
            ...s.monthlyTab,
            data: update,
          },
        }));
        return date;
      },
    };
  }, [monthly]);

  const forecastTab = useMemo(() => {
    return { forecast };
  }, [forecast]);

  return (
    <ManageDataContext.Provider
      value={{ dailyTab, weeklyTab, monthlyTab, forecastTab }}
    >
      {children}
    </ManageDataContext.Provider>
  );
};

export default ManageDataProvider;

const useManageData = () => {
  return useContext(ManageDataContext);
};

export { useManageData };
