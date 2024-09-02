import Image from "next/image";

const CommonLeftSide = () => {
  return (
    <div
      className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6  flex-column d-flex"
      style={{ backgroundImage: "url(/images/background.png)" }}
    >
      <div
        className="d-flex flex-column position-xl-fixed top-0 bottom-0 w-xl-700px scroll-y hideScroll"
        style={{ margin: "auto" }}
      >
        <div className="d-flex flex-row-fluid flex-column text-center p-10 pt-lg-20 justify-content-center">
          <div className="py-9 mb-2">
            {/* <Image
              alt="Logo"
              src="/images/symbol.png"
              width={70}
              height={70}
              className="shimmer"
              priority
            /> */}
            <Image
              alt="Logo"
              src="/images/VendoVelocity_Horiz_White_Org.png"
              width={400}
              height={70}
              className="shimmer"
              priority
            />
          </div>
          <h1
            className="fs-2qx pb-5 pb-md-4 fw-normal"
            style={{ color: "white" }}
          >
            Welcome to <b className="fw-boldest">Vendo!</b>
          </h1>
          <p className="fw-normal fs-3" style={{ color: "white" }}>
            An Intelligent tool for Data Analytics
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommonLeftSide;
