/* global require */
import App, { Container } from "next/app";
import Head from "next/head";
import React from "react";
import { setGlobal } from "reactn";

setGlobal({
  email: "",
  password: "",
  fullname: "",
  profileimageurl: ""
});

const MyApp = ({ Component, pageProps }) => {
  return (
    <Container>
      <Component {...pageProps}>
        <Head>
          <meta name="description" content="ÄNDRA SEN!!!" />
          <meta key="themeColor" name="theme-color" content="#ffffff" />
          <meta key="IE" httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
      </Component>
    </Container>
  );
};

export default MyApp;
