import { Provider } from "react-redux";
import { Inter } from "next/font/google";
import store from "@/src/store";
import "@/styles/globals.css";
import "@/styles/style.css";
import Layout from "@/src/layouts/Layout";
import AuthProvider from "@/src/providers/auth";
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps, router }) {
  const authWrapper = (page) =>
    router.route === "/login" ? page : <AuthProvider>{page}</AuthProvider>;

  useEffect(() => {
    const handleStart = () => {
      NProgress.start();
    };

    const handleStop = () => {
      NProgress.done();
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  return (
    <div className={inter.className}>
      {authWrapper(
        <Layout>
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        </Layout>
      )}
    </div>
  );
}
