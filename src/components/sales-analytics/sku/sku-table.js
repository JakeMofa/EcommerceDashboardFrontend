import {
  currencyFormat,
  numberFormat,
  percentageFormat,
} from "@/src/helpers/formatting.helpers";
import Details from "@/src/components/Details";

export default function SkuTable({ loading, details, showDSP }) {
  return (
    <div className="row gx-5 gx-xl-5">
      <div className="col-xl-12 mb-5 mb-xl-5">
        <div className="card card-flush h-xl-100">
          <div className="card-body py-3 pt-5">
            <div className="row g-3">
              <Details
                loading={loading}
                data={[
                  {
                    title: "Ordered Revenue",
                    value: currencyFormat(details?.totalOrderedProductSales),
                  },
                  {
                    title: "Total Sessions",
                    value: numberFormat(details?.totalSession),
                  },
                  {
                    title: "Session %",
                    value: percentageFormat(details?.totalSessionPercentage),
                  },
                  {
                    title: "Total Page Views",
                    value: numberFormat(details?.totalPageViews),
                  },
                  {
                    title: "Page View %",
                    value: percentageFormat(details?.avgPageViewPercentage),
                  },
                  {
                    title: "Buy Box % (avg)",
                    value: percentageFormat(details?.avgBuyBox),
                  },
                  {
                    title: "Units Ordered",
                    value: numberFormat(details?.totalUnitOrdered),
                  },
                  {
                    title: "Conversion Rate",
                    value: percentageFormat(details?.avgUnitSession),
                  },
                  {
                    title: "Total Orders",
                    value: numberFormat(details?.totalOrderItems),
                  },
                  {
                    title: "Ad Spend",
                    value: currencyFormat(details?.spend),
                  },
                  {
                    title: "Ad Sales",
                    value: currencyFormat(details?.revenue),
                  },
                  {
                    title: "TACOS",
                    value: percentageFormat(details?.tacos),
                  },
                  ...(showDSP
                    ? [
                        {
                          title: "DSP Spend",
                          value: currencyFormat(details?.dsp_spend),
                        },
                        {
                          title: "DSP Sales",
                          value: currencyFormat(details?.dsp_revenue),
                        },
                      ]
                    : []),
                  {
                    title: "PPC Spend",
                    value: currencyFormat(details?.ppc_spend),
                  },
                  {
                    title: "PPC Sales",
                    value: currencyFormat(details?.ppc_revenue),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
