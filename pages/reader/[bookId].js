import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '@/styles/Reader.module.css';
import EpubViewer from '@/components/EpubViewer';
import {useConfig} from '@/lib/config'


export default function Reader() {
  const BLOG = useConfig();
  const router = useRouter();
  const { bookId } = router.query;
  const [location, setLocation] = useState(null);
  const [fontSize, setFontSize] = useState(100); // 基准字体大小
  const [theme, setTheme] = useState('light'); // 主题模式
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);


  // 定义BooksData对象，用于快速跟进bookId匹配书籍的url地址
  const BooksData = {};

  // window.open(`/reader/${filename}?furl=${encodeURIComponent(urlInput)}`, '_blank');
  // 从网页参数furl获取URL
  const epubFileUrl = router.query.furl;

  BooksData[bookId] = {
    title: bookId,
    url: epubFileUrl
  }

  console.log(epubFileUrl);


  // 从localStorage加载阅读进度
  useEffect(() => {
    if (bookId) {
      const savedLocation = localStorage.getItem(`book-${bookId}-location`);
      if (savedLocation) {
        try {
          // 尝试解析为 JSON 对象
          const locationData = JSON.parse(savedLocation);
          setLocation(locationData);
        } catch (e) {
          // 如果解析失败，说明存储的是字符串，直接使用
          setLocation(savedLocation);
        }
      }

      const savedFontSize = localStorage.getItem(`book-${bookId}-fontSize`);
      if (savedFontSize) setFontSize(parseInt(savedFontSize));

      const savedTheme = localStorage.getItem(`book-${bookId}-theme`);
      if (savedTheme) setTheme(savedTheme);
    }
  }, [bookId]);

  // 保存阅读进度
  const handleLocationChange = (newLocation) => {
    if (newLocation) {
      // 如果 newLocation 是对象，先转换为字符串
      const locationString = typeof newLocation === 'object'
        ? JSON.stringify(newLocation)
        : newLocation;
      localStorage.setItem(`book-${bookId}-location`, locationString);
    }
  };

  // 字体大小调整
  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize);
    localStorage.setItem(`book-${bookId}-fontSize`, newSize.toString());
  };

  // 主题切换
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem(`book-${bookId}-theme`, newTheme);
  };

  if (!bookId) return null;

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <Head>
        <title>{BooksData[bookId]?.title || `Reading ${bookId}`}</title>
        <meta name="description" content={BooksData[bookId]?.description || `Read ${bookId} online for free`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="book" />
        <meta property="og:url" content={`${BLOG.link}/reader/${bookId}`} />
        <meta property="og:title" content={BooksData[bookId]?.title || `Reading ${bookId}`} />
        <meta property="og:description" content={BooksData[bookId]?.description || `Read ${bookId} online for free`} />
        {BooksData[bookId]?.cover && <meta property="og:image" content={BooksData[bookId].cover} />}

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`${BLOG.link}/reader/${bookId}`} />
        <meta property="twitter:title" content={BooksData[bookId]?.title || `Reading ${bookId}`} />
        <meta property="twitter:description" content={BooksData[bookId]?.description || `Read ${bookId} online for free`} />
        {BooksData[bookId]?.cover && <meta property="twitter:image" content={BooksData[bookId].cover} />}

        {/* Structured Data for Book */}
        {BooksData[bookId] && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Book",
                "name": BooksData[bookId].title,
                "author": {
                  "@type": "Person",
                  "name": BooksData[bookId].author || "Unknown"
                },
                "url": `${BLOG.link}/reader/${bookId}`,
                "image": BooksData[bookId].cover,
                "description": BooksData[bookId].description
              })
            }}
          />
        )}
      </Head>

      <div className={styles.toolbar}>
        <button onClick={() => router.push('/epub-online')} className={styles.backButton}>
          <img src="/favicon.png" alt={`${BLOG.link} Logo`} />
          <span>{BooksData[bookId]?.title || `Reading ${bookId}`}</span>
        </button>
        <div className={styles.controls}>
          <div className={styles.fontSizeControl}>
            <button
              onClick={() => handleFontSizeChange(Math.max(50, fontSize - 10))}
              className={styles.controlButton}
            >
              A-
            </button>
            <button
              onClick={() => handleFontSizeChange(Math.min(300, fontSize + 10))}
              className={styles.controlButton}
            >
              A+
            </button>
          </div>
          <button
            onClick={() => handleThemeChange(theme === 'light' ? 'dark' : 'light')}
            className={styles.controlButton}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>

      <div className={styles.readerContainer}>
        <EpubViewer
          url={epubFileUrl}
          location={location}
          onLocationChange={handleLocationChange}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          setTotalPages={setTotalPages}
          fontSize={fontSize}
        />
      </div>
    </div>
  );
}
