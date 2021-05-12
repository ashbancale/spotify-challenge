import React, { useState, useEffect } from "react";
import DiscoverBlock from "./DiscoverBlock/components/DiscoverBlock";
import "../styles/_discover.scss";
import axios from "axios";
import spotify from "../../../config";

export default function Discover() {
  const spotApi = spotify.api;
  const [token, setToken] = useState("");
  const [newReleases, setNewReleases] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios(spotApi.authUrl, {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        authorization:
          "basic " + btoa(spotApi.clientId + ":" + spotApi.clientSecret),
      },
      data: "grant_type=client_credentials",
      method: "POST",
    })
      .then((autRes) => {
        setToken(autRes.data.access_token);

        axios(spotApi.baseUrl + "/browse/new-releases", {
          method: "GET",
          headers: { authorization: "Bearer " + autRes.data.access_token },
        })
          .then((newReleaseRes) => {
            setNewReleases(newReleaseRes.data.albums.items);
          })
          .catch((err) => {
            console.log("release err --", err);
          });

        axios(spotApi.baseUrl + "/browse/featured-playlists", {
          method: "GET",
          headers: { authorization: "Bearer " + autRes.data.access_token },
        })
          .then((playlistsRes) => {
            setPlaylists(playlistsRes.data.playlists.items);
          })
          .catch((err) => {
            console.log("playlist err --", err);
          });

        axios(spotApi.baseUrl + "/browse/categories", {
          method: "GET",
          headers: { authorization: "Bearer " + autRes.data.access_token },
        })
          .then((categoriesRes) => {
            setCategories(categoriesRes.data.categories.items);
          })
          .catch((err) => {
            console.log("category err --", err);
          });
      })
      .catch((err) => {
        console.log("token err --", err);
      });
  }, [
    spotApi.authUrl,
    spotApi.baseUrl,
    spotApi.clientId,
    spotApi.clientSecret,
  ]);

  return (
    <div className="discover">
      <DiscoverBlock
        text="RELEASED THIS WEEK"
        id="released"
        data={newReleases}
      />
      <DiscoverBlock text="FEATURED PLAYLISTS" id="featured" data={playlists} />
      <DiscoverBlock
        text="BROWSE"
        id="browse"
        data={categories}
        imagesKey="icons"
      />
    </div>
  );
}
