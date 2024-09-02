import _ from "lodash";

export const monthFilterPipe = (months) =>
  Array.isArray(months)
    ? months.map((item) => _.toNumber(item))
    : months
    ? [_.toNumber(months)]
    : [];

export const brandsFilterPipe = (brands) =>
  Array.isArray(brands)
    ? brands.map((item) => _.toNumber(item))
    : brands
    ? [_.toNumber(brands)]
    : [];
