import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta
            name="description"
            content="KTHKIT - Den kompletta verktygslådan för KTH-studenten.
             Räkna betygssnitt, ladda ned gamla tentor, se tentastatistik och mer."
          />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="KTHKIT">
          <meta property="og:description" content="KTHKIT - Den kompletta verktygslådan för KTH-studenten. 
          Räkna betygssnitt, ladda ned gamla tentor, se tentastatistik och mer" />
          <meta property="og:url" content="https://kthkit.se" />
          <meta property="og:image" content="/static/logo_og.png" />
          <meta
            name="google-site-verification"
            content="5tYS8uhSbcanS0LFMN2dA9qEev0Y17Rdwl-JPhFcy7s"
          />
          <meta name="msapplication-TileColor" content="#fafafa" />
          <meta
            name="msapplication-config"
            content="/static/favicon/browserconfig.xml"
          />
          <meta key="themeColor" name="theme-color" content="#fafafa" />

          <meta key="IE" httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/static/favicon/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/favicon/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/static/favicon/favicon-16x16.png"
          />
          <link rel="manifest" href="/static/favicon/site.webmanifest" />
          <link
            rel="mask-icon"
            href="/static/favicon/safari-pinned-tab.svg"
            color="#fafafa"
          />
          <link rel="shortcut icon" href="/static/favicon/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
