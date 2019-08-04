import React, { useState, useEffect } from "react";
import Router from "next/router";
import classnames from "classnames";
import Layout from "../../components/Layout";
import { getProfile } from "../../api/api";
import {
  setProfileState,
  setProfileCookies,
  setAuthState,
  redirectIfLoggedOut
} from "../../utils/login-tools";
import {
  profile_picture_placeholder_path,
  kth_profile_edit_url
} from "../../global/global";
import "./styles.scss";

const Profile = ({ ctx }) => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState(
    profile_picture_placeholder_path
  );
  const [isEditingProfile, setEditingProfile] = useState("false");
  const [loading, setLoading] = useState("false");
  const [refreshFailed, setRefreshFailed] = useState("false");

  useEffect(() => {
    setAuthState(ctx, setEmail, () => {});
    setProfileState(ctx, setFullName, setProfileImageUrl);
  }, []);

  const refreshProfile = () => {
    setLoading(true);
    getProfile(email)
      .then(({ data }) => {
        setProfileCookies(ctx, data.givenName, data.familyName, data.image);
        setEditingProfile(false);
        window.location.href = "/profile"; // trigger client side refresh
      })
      .catch(() => {
        setEditingProfile(false);
        setRefreshFailed(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Layout title="Din profil" ctx={ctx}>
      <section className="section">
        <div className="container">
          <h1 className="title">Din profil</h1>
          <div className="card">
            <div className="card-content">
              <div className="profileCardContainer">
                <figure className="image is-64x64">
                  <img className="is-rounded" src={profileImageUrl} />
                </figure>
                <p>{fullName}</p>
                {fullName.length === 0 && (
                  <p className="help">
                    Din KTH-profil är <b>privat</b>. För att KTHKIT ska fungera
                    optimalt behöver din profil vara <b>publik</b>. Att ladda
                    upp en profilbild kan inte skada heller... <br></br>
                    <i>speciellt när man ser ut som du</i>
                    <span>&nbsp;🔥</span>
                  </p>
                )}
                <button
                  className={classnames("button", "is-small", "is-dark", {
                    "is-success": isEditingProfile === true,
                    "is-loading": loading === true
                  })}
                  onClick={() => {
                    isEditingProfile === true
                      ? refreshProfile()
                      : window.open(kth_profile_edit_url(email), "_blank");
                    setEditingProfile(true);
                    setRefreshFailed(false);
                  }}
                >
                  {isEditingProfile === true
                    ? "Hämta uppdaterad profildata"
                    : "Uppdatera din profil"}
                </button>
                {refreshFailed === true && (
                  <p className="help is-danger">Kunde inte hämta profildata</p>
                )}
                <p className="help">
                  Du uppdaterar din profil på KTH:s hemsida
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

Profile.getInitialProps = async ctx => {
  redirectIfLoggedOut(ctx, Router);
};

export default Profile;
