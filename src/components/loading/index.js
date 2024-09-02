import React from "react";
import { LoadingWrapper } from "./style";

export default function Loading(props) {
  return (
    <LoadingWrapper>
      <table id="example" className="table-loader display" width="80%">
        <thead>
          <tr>
            {[...Array(props.months || 6).keys()]?.map((_, i) => (
              <th
                key={i}
                style={{
                  height: "35px",
                  border: "1px dashed #b3b3b3",
                  boxShadow: "0px 0px 10px #dfdfdf",
                }}
              ></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(17).keys()]?.map((_, i) => (
            <tr key={i}>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </LoadingWrapper>
  );
}
