import { cookies } from "@/src/constants/cookies";
import { NextResponse } from "next/server";

const validatebrandID = async (req, res, { breakAll }) => {
  const url = req.nextUrl;
  const BRAND_ID = req.cookies.get(cookies.BRAND_ID)?.value;

  if (!BRAND_ID) {
    url.pathname = "/brands";
    return NextResponse.redirect(url);
  }
  return res;
};

export default validatebrandID;
