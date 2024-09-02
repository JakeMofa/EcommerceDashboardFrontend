import request from "@/src/api/request";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const res = await request.get(
      `${process.env.NEXT_PUBLIC_ADVERTISING_RETURN_URL}?${
        req.url.split("?")[1]
      }`
    );
  }
  res.redirect(
    307,
    `/brands/edit?brandId=${req.query.state}&activeTab=advertisingCredentials`
  );
}
