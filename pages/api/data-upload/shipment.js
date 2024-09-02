import { reports_api_request } from "@/src/api/request";
import { fileDownloadUrl } from "@/src/helpers/s3Upload.helpers";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const filePath = fileDownloadUrl(req.body.file_name);
    let success = false;
    await fetch(filePath)
      .then((res) => {
        success = res.status >= 200 && res.status <= 299;
      })
      .catch((error) => {
        success = false;
      });

    if (success) {
      await reports_api_request
        .post("/upload/shipment", req.body)
        .then((r) => {
          if (r.status === 200) {
            res
              .status(200)
              .json({ success: true, message: "Started processing the file" });
          } else {
            res.status(200).json({
              success: false,
              message: `Error processing the file ${req.body.file_name}`,
            });
          }
        })
        .catch((err) => {
          res.status(401).json({ message: err });
        });
    } else {
      res.status(401).json({ message: "File not found. Please upload again." });
    }
  }
}
