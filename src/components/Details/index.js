import { Skeleton, Statistic } from "antd";
import Tooltip from "../../components/tooltip";
import dynamic from "next/dynamic";

const CountUp = dynamic(() => import("react-countup"), { ssr: false });

const checkFloor = (srt) => {
  if (srt > Math.floor(srt)) {
    return true;
  } else {
    return false;
  }
};

const formatter = (value) => (
  <CountUp
    decimals={checkFloor(value) ? 2 : 0}
    end={value}
    separator={checkFloor(value) ? "" : ","}
  />
);

export default function Details(props) {
  const { data = [], loading = true } = props;

  const getValue = (value, type) => {
    return String(value).replace(type ? /[^a-zA-Z0-9-. ]/g : /[^$-% ]/g, "");
  };

  return data?.map((d, i) =>
    loading ? (
      title2Loading()
    ) : (
      <div className="col-lg-2 col-md-4 col-sm-6 mb-1" key={i}>
        <h6 className="text-violet fw-bold fs-5">
          <Tooltip row={1} style={{ wordBreak: "normal" }}>
            {d?.title || "-"}
          </Tooltip>
        </h6>
        <h4 className="mb-0 fw-boldest d-flex align-items-center">
          {getValue(d?.value, false) !== "%" ? getValue(d?.value, false) : ""}
          <Statistic
            valueStyle={{
              fontWeight: 700,
              color: "#181c32",
              fontSize: "1.25rem",
              position: "relative",
            }}
            value={getValue(d?.value, true)}
            formatter={formatter}
          />
          {getValue(d?.value, false) === "%" ? "%" : ""}
        </h4>
      </div>
    )
  );
}

function title2Loading() {
  return <Skeleton.Input size="small" active={true} />;
}
