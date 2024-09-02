import React from "react";
import moment from "moment/moment";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <div className="footer pb-4 d-flex flex-lg-column" id="kt_footer">
        <div className="container-fluid d-flex flex-column flex-md-row flex-stack">
          <div className="text-dark order-2 order-md-1">
            <span className="text-gray-400 fw-bold me-1">
              Copyright © {moment(new Date()).format("YYYY")}&nbsp;
              <span className="text-muted text-hover-primary fw-bolder me-2 fs-6">
                Vendo
              </span>
              | All rights reserved.
            </span>
          </div>

          <ul className="menu menu-gray-600 menu-hover-primary fw-bold order-1">
            <li className="menu-item">
              <p className="menu-link px-2">
                <Link href="/support">Support</Link>
              </p>
            </li>
            <li className="menu-item">
              {/* <p className="menu-link px-2">Purchase</p> */}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
