import { getManageDataSalesForecast } from "@/helper/getManageDataSalesForecast";
import { getManageDataSalesDaily } from "@/helper/getManageDataSalesDaily";
import { getManageDataSalesWeekly } from "@/helper/getManageDataSalesWeekly";
import { getManageDataSalesMonthly } from "@/helper/getManageDataSalesMonthly";
import DashboardLayout from "@/src/layouts/DashboardLayout";
import ManageDataLayout from "@/src/layouts/ManageData";
import ManageDataProvider from "@/src/providers/manageData";

export const getServerSideProps = async (ctx) => {
  const pathname = ctx.req.url;

  if (pathname.includes("forecast")) {
    try {
      const forecast = await getManageDataSalesForecast(ctx);
      return {
        props: {
          forecast: forecast.data,
        },
      };
    } catch (error) {
      return { notFound: true };
    }
  }
  if (pathname.includes("daily")) {
    try {
      const daily = await getManageDataSalesDaily(ctx);
      return {
        props: {
          daily: daily.data,
        },
      };
    } catch (error) {
      return { notFound: true };
    }
  }

  if (pathname.includes("weekly")) {
    try {
      const weekly = await getManageDataSalesWeekly(ctx);
      return {
        props: {
          weekly: weekly.data,
        },
      };
    } catch (error) {
      return { notFound: true };
    }
  }

  if (pathname.includes("monthly")) {
    try {
      const monthly = await getManageDataSalesMonthly(ctx);
      return {
        props: {
          monthly: monthly.data,
        },
      };
    } catch (error) {
      return { notFound: true };
    }
  }

  if (pathname === "/data") {
    return {
      props: {},
      redirect: {
        destination: "/data/forecast",
      },
    };
  }
  return { props: {} };
};

export default function Page(props) {
  return (
    <>
      <DashboardLayout>
        <ManageDataProvider
          value={{
            daily: props.daily || null,
            weekly: props.weekly || null,
            monthly: props.monthly || null,
            forecast: props.forecast || null,
          }}
        >
          <ManageDataLayout />
        </ManageDataProvider>
      </DashboardLayout>
    </>
  );
}
