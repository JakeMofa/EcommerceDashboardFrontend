import dayjs from "dayjs";

export const rangePresets = [
  { label: "Today", value: [dayjs(), dayjs()] },
  { label: "Yesterday", value: [dayjs().add(-1, "d"), dayjs().add(-1, "d")] },
  { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
  {
    label: "This Week",
    value: [dayjs().startOf("week"), dayjs().endOf("week")],
  },
  {
    label: "Last Week",
    value: [
      dayjs().add(-1, "week").startOf("week"),
      dayjs().add(-1, "week").endOf("week"),
    ],
  },
  {
    label: "Last 30 Days",
    value: [dayjs().add(-30, "d"), dayjs()],
  },
  {
    label: "This month",
    value: [dayjs().startOf("month"), dayjs().endOf("month")],
  },
  {
    label: "Last month",
    value: [
      dayjs().add(-1, "month").startOf("month"),
      dayjs().add(-1, "month").endOf("month"),
    ],
  },
  {
    label: "Year to Date",
    value: [dayjs().startOf("year"), dayjs()],
  },
  // {
  //   label: "Lifetime",
  //   value: [dayjs().startOf("years"), dayjs()],
  // },
];
