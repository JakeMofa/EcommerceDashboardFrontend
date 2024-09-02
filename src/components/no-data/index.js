import { useState, useEffect } from "react";
import { NoDataWrapper } from "./style";
import { NoDataSvg } from "@/src/assets";

const NoData = (props) => {
  const [isClient, setIsClient] = useState(false);

  const {
    message,
    showNew = false,
    opacities,
    isLink = false,
    addNewTitle,
    height,
    ...rest
  } = props;

  const checkHeight = () => {
    return isClient ? window.innerHeight : 0;
  };

  useEffect(() => {
    setIsClient(true);

    window.addEventListener("resize", (e) => {
      checkHeight();
    });
    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);

  return (
    <NoDataWrapper
      style={{
        ...props.style,
        height: height || `calc(${checkHeight()}px - 180px)`,
      }}
    >
      <div>
        <div
          style={{
            transform: "translate(-50%, -50%)",
            top: "50%",
            left: "50%",
            position: "absolute",
            textAlign: "center",
          }}
        >
          <NoDataSvg />
          <div
            style={{
              fontSize: "14px",
              color: "#363a3e",
              opacity: "0.51",
              paddingTop: "3px",
              fontWeight: "bold",
              letterSpacing: "-0.36px",
            }}
          >
            {message || "Nothing to see here !"}
          </div>
          {showNew ? (
            <div
              {...rest}
              className="lineHover"
              style={{
                fontSize: "13.5px",
                color: "#ef7db2",
                paddingTop: "3px",
                fontWeight: "normal",
                letterSpacing: "-0.36px",
                display: "flex",
                justifyContent: "center",
                opacity: opacities,
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  color: "#ef7db2",
                  marginRight: "5px",
                  marginBottom: "2px",
                }}
              >
                {addNewTitle || "Add new"}
              </span>
              <span className="pluseIconStyle">+</span>
            </div>
          ) : null}
          {isLink ? (
            <div
              {...rest}
              style={{
                fontSize: "13.5px",
                paddingTop: "3px",
                fontWeight: "normal",
                letterSpacing: "-0.36px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <p
                style={{
                  color: "#007bff",
                  cursor: "pointer",
                  marginRight: "15px",
                }}
                target="_blank"
                to={{ pathname: isLink }}
              >
                {addNewTitle || "Add new"}
              </p>{" "}
              <span
                className="plusButton"
                style={{
                  position: "relative",
                  fontSize: "22.5px",
                  top: "-5px",
                  color: "#007bff",
                  cursor: "default",
                }}
              >
                +
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </NoDataWrapper>
  );
};

export default NoData;
