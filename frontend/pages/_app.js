/* global require */
import App, { Container } from "next/app";
import Head from "next/head";
import React from "react";

export default class extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Component {...pageProps}>
          <Head>
            <meta name="description" content="ÄNDRA SEN!!!" />
            <meta key="themeColor" name="theme-color" content="#ffffff" />
            <meta key="IE" httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>
        </Component>
      </Container>
    );
  }
}
