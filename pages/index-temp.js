import { useEffect } from "react";
import { useRouter } from "next/router";
import { isClient } from "@/src/helpers/isClient";
import { cookies } from "@/src/constants/cookies";
import jwt_decode from "jwt-decode";
import { getCookie } from "cookies-next";

export default function Home() {
  // const router = useRouter();

  // useEffect(() => {
  //   const user = JSON.parse(isClient ? localStorage.getItem("user") : {});
  //   user?.access_token
  //     ? user.role === "User"
  //       ? router.push("/dashboard")
  //       : router.push("/brands")
  //     : router.push("/login");

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  return "HOME";
}

// export async function getServerSideProps({ req, res }) {
//   const tokenCookie = getCookie(cookies.TOKEN, { req, res });
//   const brandId = getCookie(cookies.BRAND_ID, { req, res });
//   if (tokenCookie) {
//     if (brandId) {
//       return {
//         props: {},
//         redirect: {
//           destination: "/sales-analytics/sales",
//           permanent: false,
//         },
//       };
//     }

//     var decoded = jwt_decode(tokenCookie);

//     const isUser = decoded.role === "User";

//     return {
//       props: {},
//       redirect: {
//         destination: isUser ? "/dashboard" : "/brands",
//         permanent: false,
//       },
//     };
//   } else {
//     return {
//       props: {},
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }
// }
