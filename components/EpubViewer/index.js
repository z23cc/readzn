import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import styles from './styles.module.css';

const EpubViewer = dynamic(() => import('epubjs').then(mod => {
  const Epub = mod.default;
  // eslint-disable-next-line react/display-name
  return ({
    url,
    location,
    onLocationChange,
    currentPage,
    setCurrentPage,
    totalPages,
    setTotalPages,
    fontSize
  }) => {
    const viewerRef = useRef(null);
    const touchStartX = useRef(null);
    const [rendition, setRendition] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!viewerRef.current) return;

      const book = new Epub(url);
      let mounted = true;

      const initBook = async () => {
        try {
          await book.ready;

          if (!mounted) return;

          const rendition = book.renderTo(viewerRef.current, {
            flow: 'paginated',
            width: '100%',
            height: '100%'
          });

          const spine = book.spine;
          if (spine && spine.length > 0) {
            let startLocation = typeof location === 'string' ? location : '0';
            if (location) {
              if (typeof location === 'object') {
                startLocation = location.start;
              } else {
                startLocation = location;
              }
            }

            await rendition.display(startLocation);
            if (mounted) {
              setRendition(rendition);
              setLoading(false);
            }
          } else {
            setError('No sections found in the book');
          }
        } catch (error) {
          console.error('Error loading book:', error);
          setError(error.message || 'Failed to load book');
        }
      };

      initBook();

      return () => {
        mounted = false;
      };
    }, [url, location, setTotalPages]);

    useEffect(() => {
      if (!rendition) return;

      rendition.on('relocated', (location) => {
        setCurrentPage(location.start.displayed.page);
        setTotalPages(location.start.displayed.total);
      });

      const handleKeyPress = (e) => {
        if (e.key === 'ArrowLeft') rendition.prev();
        if (e.key === 'ArrowRight') rendition.next();
      };

      document.addEventListener('keyup', handleKeyPress);
      return () => {
        document.removeEventListener('keyup', handleKeyPress);
      };
    }, [rendition, setCurrentPage, setTotalPages]);

    useEffect(() => {
      if (!rendition) return;

      const handleLocationChange = (epubcfi) => {
        onLocationChange && onLocationChange(epubcfi);
      };

      rendition.on('locationChanged', handleLocationChange);
      return () => {
        rendition.off('locationChanged', handleLocationChange);
      };
    }, [rendition, onLocationChange]);

    useEffect(() => {
      if (!rendition) return;
      rendition.themes.fontSize(`${fontSize}%`);
    }, [rendition, fontSize]);

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      touchStartX.current = touch.clientX;
    };

    const handleTouchMove = (e) => {
      if (!touchStartX.current) return;
      const touch = e.touches[0];
      const deltaX = touchStartX.current - touch.clientX;
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) rendition.next();
        else rendition.prev();
        touchStartX.current = null;
      }
    };

    const handleTouchEnd = () => {
      touchStartX.current = null;
    };

    if (error) {
      return <div className={styles.error}>{error}</div>;
    }

    return (
      <div
        ref={viewerRef}
        className={styles.epubViewer}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}>
              <div className={styles.loadingCircle}></div>
            </div>
            <div className={styles.loadingText}>Loading...</div>
          </div>
        )}
        <div
          className={`${styles.clickArea} ${styles.left}`}
          onClick={() => rendition && rendition.prev()}
        />
        <div
          className={`${styles.clickArea} ${styles.right}`}
          onClick={() => rendition && rendition.next()}
        />
        <div className={styles.pageInfo}>
          {currentPage} / {totalPages}
        </div>
        <div className={styles.navigationButtons}>
          <button
            className={`${styles.navigationButton} ${styles.prev}`}
            onClick={() => rendition && rendition.prev()}
          >
            ←
          </button>
          <button
            className={`${styles.navigationButton} ${styles.next}`}
            onClick={() => rendition && rendition.next()}
          >
            →
          </button>
        </div>
      </div>
    );
  };
}), { ssr: false });

EpubViewer.propTypes = {
  url: PropTypes.string.isRequired,
  location: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onLocationChange: PropTypes.func,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
  setTotalPages: PropTypes.func.isRequired,
  fontSize: PropTypes.number.isRequired
};

export default EpubViewer;