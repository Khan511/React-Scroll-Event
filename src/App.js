import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { FaSearch } from "react-icons/fa";
import Photo from "./Photo";

// const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`
const client_id = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const mounted = useRef(false);

  const fetchData = async () => {
    setLoading(true);

    let url;

    if (query) {
      url = `${searchUrl}${client_id}&page=${page}&query=${query}`;
    } else {
      url = `${mainUrl}${client_id}&page=${page}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();

      setPhotos((prevData) => {
        if (query && page === 1) {
          setLoading(false);
          return data.results;
        }
        if (query) {
          setLoading(false);
          return [...prevData, ...data.results];
        } else {
          setLoading(false);
          return [...prevData, ...data];
        }
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query) return;
    if (page === 1) {
      fetchData();

      return;
    }
    setPage(1);
  };

  // useEffect(() => {
  //   if (!mounted.current) {
  //     mounted.current = true;
  //     return;
  //   }
  //   console.log("second");
  // }, []);

  useEffect(() => {
    const scrollEvent = window.addEventListener("scroll", () => {
      if (
        !loading &&
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2
      ) {
        setPage((prevPage) => {
          return prevPage + 1;
        });
      }
    });
    console.log("useEffect 2");
    return window.removeEventListener("scroll", scrollEvent);
  }, []);

  return (
    <main>
      <section className="search">
        <form className="search-form">
          <input
            type="text"
            placeholder="Search..."
            className="form-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="submit-btn" onClick={handleSubmit}>
            {<FaSearch />}
          </button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photos.map((photo) => {
            return <Photo key={photo.id} {...photo} />;
          })}
        </div>
        {loading && <h2 className="loading">Loading...</h2>}
      </section>
    </main>
  );
}

export default App;
