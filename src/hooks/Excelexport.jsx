import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const fileType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

const formatData = (rows) => {
  return rows.map((d) => {
    const data = {};
    for (let [key, value] of Object.entries(d)) {
      if (
        typeof value === "string" &&
        (value.startsWith("$") || value.startsWith("-$"))
      ) {
        data[key] = {
          t: "n",
          v: Number(value.replaceAll(/[$,-]/g, "")),
          z: '"$" #0.00',
        };
      } else if (typeof value === "string" && value?.endsWith("%")) {
        data[key] = { t: "n", v: Number(value.slice(0, -1)), z: '0.00"%"' };
      } else if (typeof value === "string" && value.match(/^[0-9,-.]+$/)) {
        const num = Number(value.replaceAll(",", ""));
        data[key] = isNaN(num)
          ? value
          : { t: "n", v: Number(value.replaceAll(",", "")), z: "#,##0" };
      } else {
        data[key] = value;
      }
    }

    return data;
  });
};

export const ExportToExcel = ({
  columns = [],
  secondColumn,
  rows = [],
  loading,
  fileName,
  sheets = [],
  buttonText = "Export",
}) => {
  const exportToCSV = (rows, fileName) => {
    if (sheets?.length > 0) {
      const sheetsWB = sheets.reduce(
        (acc, item) => {
          const ws = XLSX.utils.json_to_sheet(formatData(item.rows) || []);
          /* custom headers */
          XLSX.utils.sheet_add_aoa(ws, [item.columns || []], {
            origin: "A1",
          });
          acc.Sheets[item.title || "data"] = ws;
          acc.SheetNames.push(item.title || "data");
          return acc;
        },
        { Sheets: {}, SheetNames: [] }
      );

      const excelBuffer = XLSX.write(sheetsWB, {
        bookType: "xlsx",
        type: "array",
      });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName + fileExtension);
    } else {
      const ws = XLSX.utils.json_to_sheet(formatData(rows));
      /* custom headers */
      XLSX.utils.sheet_add_aoa(
        ws,
        [columns || [], secondColumn].filter(Boolean),
        {
          origin: "A1",
        }
      );
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName + fileExtension);
    }
  };

  return (
    <button
      className="btn btn-light btn-active-light-dark btn-sm fw-bolder me-3"
      onClick={(e) => exportToCSV(rows, fileName)}
      disabled={loading}
    >
      {buttonText}
    </button>
  );
};

export const exportToExcel = ({
  columns = [],
  rows = [],
  loading,
  fileName,
}) => {
  const ws = XLSX.utils.json_to_sheet(formatData(rows));
  /* custom headers */
  XLSX.utils.sheet_add_aoa(ws, [columns], {
    origin: "A1",
  });
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName + fileExtension);
};
