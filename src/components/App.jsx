import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Searchbar from './SearchBar/Searchbar.jsx';
import ImageGallery from './ImageGallery/ImageGallery.jsx';
import Loader from './Loader/Loader.jsx';
import Button from './Button/Button.jsx';
import Modal from './Modal/Modal.jsx';
import styles from './App.module.css';

const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');

  const fetchImages = useCallback(async () => {
    if (!query) return;

    setLoading(true);

    try {
      const response = await axios.get(
        `https://pixabay.com/api/?q=${query}&page=${page}&key=45476172-6bbda7ba5ec4a4fe36c5c9968&image_type=photo&orientation=horizontal&per_page=12`
      );
      if (response.data.hits.length === 0) {
        toast.error('No images found. Please try a different query.');
      }
      setImages(prevImages => [...prevImages, ...response.data.hits]);
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while fetching images.');
    } finally {
      setLoading(false);
    }
  }, [query, page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleSearchSubmit = (newQuery) => {
    setQuery(newQuery);
    setImages([]);
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleImageClick = (largeImageURL) => {
    setLargeImageURL(largeImageURL);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setLargeImageURL('');
  };

  return (
    <div className={styles.App}>
      <Searchbar onSubmit={handleSearchSubmit} />
      <ImageGallery images={images} onImageClick={handleImageClick} />
      {loading && <Loader />}
      {images.length > 0 && !loading && <Button onClick={handleLoadMore} />}
      {showModal && <Modal largeImageURL={largeImageURL} onClose={closeModal} />}
      <ToastContainer />
    </div>
  );
};

export default App;
