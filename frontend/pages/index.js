import React, { useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import "./index.scss";

const Home = ({ ctx }) => {
  return (
    <Layout title="Den kompletta verktygslådan för KTH-studenter" ctx={ctx}>
      <section className="section">
        <div className="container">
          <h1 className="title">Välj tjänst</h1>
          <div className="tile is-ancestor">
            <Link href="/login">
              <div className="tile is-4 is-parent">
                <div className="tile is-child box serviceTile">
                  <p>Se och ladda ned gamla tentor från hela X kurser</p>
                  <p className="subtitle">Gamla tentor</p>
                </div>
              </div>
            </Link>
            <Link href="/statistics">
              <div className="tile is-4 is-parent">
                <div className="tile is-child box serviceTile">
                  <p>Se tentastatistik</p>
                  <p className="subtitle">Tentastatistik</p>
                </div>
              </div>
            </Link>
            <Link href="/grades">
              <div className="tile is-4 is-parent">
                <div className="tile is-child box serviceTile">
                  <p>Räkna ut ditt betygssnitt</p>
                  <p className="subtitle">Räkna betygssnitt</p>
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
