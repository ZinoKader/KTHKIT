import React, { useState } from "react";
import Link from "next/link";
import classnames from "classnames";
import Layout from "../components/Layout";
import styles from "./index.module.scss";

const Home = ({ ctx }) => {
  return (
    <Layout title="Den kompletta verktygslådan för KTH-studenter" ctx={ctx}>
      <section className="section">
        <div className={styles.container}>
          <h1 className="title">Välj tjänst</h1>
          <div className="tile is-ancestor">
            <Link href="/">
              <div className="tile is-4 is-parent">
                <div
                  className={classnames(
                    "tile",
                    "is-child",
                    "box",
                    styles.serviceTile
                  )}
                >
                  <p className="subtitle">Gamla tentor</p>
                  <p>Se och ladda ned gamla tentor (kommer snart)</p>
                </div>
              </div>
            </Link>
            <Link href="/statistics">
              <div className="tile is-4 is-parent">
                <div
                  className={classnames(
                    "tile",
                    "is-child",
                    "box",
                    styles.serviceTile
                  )}
                >
                  <p className="subtitle">Tentastatistik</p>
                  <p>Se tentastatistik</p>
                </div>
              </div>
            </Link>
            <Link href="/grades">
              <div className="tile is-4 is-parent">
                <div
                  className={classnames(
                    "tile",
                    "is-child",
                    "box",
                    styles.serviceTile
                  )}
                >
                  <p className="subtitle">Räkna betygssnitt</p>
                  <p>Räkna ut ditt betygssnitt</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
