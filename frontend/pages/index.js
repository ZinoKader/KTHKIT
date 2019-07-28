import React, { useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import "./index.scss";

const Home = ({ ctx }) => {
  return (
    <Layout ctx={ctx}>
      <section className="section">
        <div className="container">
          <h1 className="title">Välj tjänst</h1>
          <div className="tile is-ancestor">
            <Link href="/login">
              <div className="tile is-4 is-parent">
                <div className="tile is-child box">
                  <p className="subtitle">Gamla tentor</p>
                  <p>Se och ladda ned gamla tentor från hela X kurser</p>
                </div>
              </div>
            </Link>
            <Link href="/login">
              <div className="tile is-4 is-parent">
                <div className="tile is-child box">
                  <p className="subtitle">Tentastatistik</p>
                  <p>Se tentastatistik</p>
                </div>
              </div>
            </Link>
            <Link href="/grades">
              <div className="tile is-4 is-parent">
                <div className="tile is-child box">
                  <p className="subtitle">Räkna snitt</p>
                  <p>Räkna ut ditt snittbetyg</p>
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
