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
            <meta name="description" content="KTHKIT - Den kompletta verktygslådan för KTH-studenten.
             Räkna snittbetyg, ladda ned gamla tentor, se tentastatistik och mer." />
            <link rel="apple-touch-icon" sizes="180x180" href="/static/favicon/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/static/favicon/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/static/favicon/favicon-16x16.png" />
            <link rel="manifest" href="/static/favicon/site.webmanifest" />
            <link rel="mask-icon" href="/static/favicon/safari-pinned-tab.svg" color="#fafafa" />
            <link rel="shortcut icon" href="/static/favicon/favicon.ico" />
            <meta name="msapplication-TileColor" content="#fafafa" />
            <meta name="msapplication-config" content="/static/favicon/browserconfig.xml" />
            <meta key="themeColor" name="theme-color" content="#fafafa" />

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
