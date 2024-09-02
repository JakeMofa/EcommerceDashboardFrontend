import Head from "next/head";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Vendo</title>
        <meta name="description" content="Vendo Velocity" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main>{children}</main>
    </>
  );
}
