import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import ConfirmDialog from '@/components/ConfirmDialog';
import CopyButton from '@/components/CopyButton';
import styles from '@/styles/OnlineReader.module.css';

export default function EpubOnline() {
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // 图书馆相关状态
  const [books, setBooks] = useState([]);
  const [readingRecords, setReadingRecords] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [sortBy, setSortBy] = useState('dateAdded'); // 'dateAdded', 'title', 'lastRead'
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');

  // 确认对话框状态
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    onConfirm: () => { }
  });

  // 处理URL输入变化
  const handleUrlChange = (e) => {
    setUrlInput(e.target.value);
    setError('');
  };

  // 处理URL提交
  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!urlInput) {
      setError('请输入有效的ePub文件URL');
      return;
    }

    // 验证URL是否为HTTPS
    if (!urlInput.startsWith('https://')) {
      setError('URL必须以https://开头');
      return;
    }

    // 验证URL是否为ePub文件
    if (!urlInput.toLowerCase().endsWith('.epub')) {
      setError('URL必须指向.epub文件');
      return;
    }

    //截取URL中的文件名
    const filename = urlInput.split('/').pop();
    const bookId = filename;

    // 创建新书籍对象
    const newBook = {
      id: bookId,
      title: filename,
      url: urlInput,
      dateAdded: new Date().toISOString(),
      coverColor: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}` // 随机颜色
    };


    // 跳转新的标签页阅读器页面，使用bookId和urlInput作为参数
    window.open(`/reader/${bookId}?furl=${encodeURIComponent(urlInput)}`, '_blank');

    // 根据ID去重
    const isDuplicate = books.some(book => book.id === bookId);
    if (!isDuplicate) {
      // 添加到图书馆
      const updatedBooks = [...books, newBook];
      setBooks(updatedBooks);
      // 更新localStorage
      localStorage.setItem('epub-library-books', JSON.stringify(updatedBooks));
    }

  };

  // 处理文件上传
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 验证文件类型
    if (file.type !== 'application/epub+zip' && !file.name.toLowerCase().endsWith('.epub')) {
      setError('请上传有效的ePub文件');
      return;
    }

    setError('');

    const fileUrl = URL.createObjectURL(file);

    //截取URL中的文件名
    const filename = file.name;
    const bookId = filename;

    // 创建新书籍对象
    const newBook = {
      id: bookId,
      title: filename,
      url: fileUrl,
      dateAdded: new Date().toISOString(),
      coverColor: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}` // 随机颜色
    };

    // 跳转新的标签页阅读器页面，使用bookId和fileUrl作为参数
    window.open(`/reader/${bookId}?furl=${encodeURIComponent(fileUrl)}`, '_blank');

    // 根据ID去重
    const isDuplicate = books.some(book => book.id === bookId);
    if (!isDuplicate) {
      // 添加到图书馆
      const updatedBooks = [...books, newBook];
      setBooks(updatedBooks);
      // 更新localStorage
      localStorage.setItem('epub-library-books', JSON.stringify(updatedBooks));
    }
  };

  // 从localStorage加载图书馆数据
  useEffect(() => {
    // 检查是否支持localStorage
    if (typeof window !== 'undefined') {
      try {
        // 加载图书馆数据
        const savedBooks = localStorage.getItem('epub-library-books');
        if (savedBooks) {
          setBooks(JSON.parse(savedBooks));
        }

        // 加载阅读记录
        const savedRecords = localStorage.getItem('epub-reading-records');
        if (savedRecords) {
          setReadingRecords(JSON.parse(savedRecords));
        }

        // 检查是否已经显示过警告
        const warningShown = localStorage.getItem('epub-library-warning-shown');
        if (!warningShown) {
          setShowWarning(true);
        }
      } catch (error) {
        console.error('Error loading library data:', error);
      }
    }
  }, []);

  // 确认警告
  const confirmWarning = () => {
    localStorage.setItem('epub-library-warning-shown', 'true');
    setShowWarning(false);
  };

  // 删除书籍
  const deleteBook = (bookId) => {
    setConfirmDialog({
      isOpen: true,
      title: '删除确认',
      message: '确定要从图书馆中删除这本书吗？',
      confirmText: '删除',
      onConfirm: () => {
        const updatedBooks = books.filter(book => book.id !== bookId);
        setBooks(updatedBooks);
        localStorage.setItem('epub-library-books', JSON.stringify(updatedBooks));
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // 清除所有阅读记录
  const clearAllRecords = () => {
    setConfirmDialog({
      isOpen: true,
      title: '清除确认',
      message: '确定要清除所有阅读记录吗？',
      confirmText: '清除',
      onConfirm: () => {
        setReadingRecords([]);
        localStorage.setItem('epub-reading-records', JSON.stringify([]));
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // 清除特定书籍的阅读记录
  const clearBookRecord = (bookId) => {
    setConfirmDialog({
      isOpen: true,
      title: '清除确认',
      message: '确定要清除这本书的阅读记录吗？',
      confirmText: '清除',
      onConfirm: () => {
        const updatedRecords = readingRecords.filter(record => record.bookId !== bookId);
        setReadingRecords(updatedRecords);
        localStorage.setItem('epub-reading-records', JSON.stringify(updatedRecords));
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // 排序书籍
  const sortedBooks = [...books].sort((a, b) => {
    if (sortBy === 'dateAdded') {
      return new Date(b.dateAdded) - new Date(a.dateAdded);
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'lastRead') {
      // 查找最后阅读记录
      const aRecord = readingRecords.find(record => record.bookId === a.id);
      const bRecord = readingRecords.find(record => record.bookId === b.id);
      const aDate = aRecord ? new Date(aRecord.lastRead) : new Date(0);
      const bDate = bRecord ? new Date(bRecord.lastRead) : new Date(0);
      return bDate - aDate;
    }
    return 0;
  });


  return (
    <Layout>
      <Head>
        <title>在线ePub阅读器 - 阅读指南</title>
        <meta name="description" content="上传本地ePub文件或输入HTTPS链接，在线阅读电子书。" />
        <meta name="keywords" content="epub阅读器,在线阅读,电子书,epub" />
      </Head>

      <div className={styles.container}>
        <div className={styles.uploadContainer}>
          <h1 className={styles.title}>在线ePub阅读器</h1>
          <p className={styles.description}>
            上传本地ePub文件或输入HTTPS链接，开始阅读您的电子书
          </p>

          <div className={styles.uploadOptions}>
            <div className={styles.uploadOption}>
              <h2>上传本地文件</h2>
              <div
                className={styles.dropArea}
                onClick={() => fileInputRef.current.click()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    const input = fileInputRef.current;
                    input.files = e.dataTransfer.files;
                    handleFileUpload({ target: input });
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                <svg className={styles.uploadIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p>点击或拖放ePub文件到此处</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="application/epub+zip,.epub"
                  className={styles.fileInput}
                />
              </div>
            </div>

            <div className={styles.divider}>
              <span>或</span>
            </div>

            <div className={styles.uploadOption}>
              <h2>输入HTTPS链接</h2>
              <form onSubmit={handleUrlSubmit} className={styles.urlForm}>
                <input
                  type="url"
                  value={urlInput}
                  onChange={handleUrlChange}
                  placeholder="https://example.com/book.epub"
                  className={styles.urlInput}
                />
                <button type="submit" className={styles.submitButton}>
                  开始阅读
                </button>
              </form>
              <p className={styles.urlNote}>链接必须以https://开头并指向.epub文件</p>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}
        </div>

        {/* 图书馆部分 */}
        <div className={styles.librarySection}>
          <div className={styles.header}>
            <h1 className={styles.title}>我的图书馆</h1>
            <div className={styles.controls}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索书籍..."
                className={styles.searchInput}
              />
              <div className={styles.viewToggle}>
                <button
                  className={`${styles.viewButton} ${view === 'grid' ? styles.active : ''}`}
                  onClick={() => setView('grid')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z" fill="currentColor" />
                  </svg>
                </button>
                <button
                  className={`${styles.viewButton} ${view === 'list' ? styles.active : ''}`}
                  onClick={() => setView('list')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" fill="currentColor" />
                  </svg>
                </button>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.sortSelect}
              >
                <option value="dateAdded">添加日期</option>
                <option value="title">书名</option>
                <option value="lastRead">最近阅读</option>
              </select>
            </div>
          </div>

          {books.length === 0 ? (
            <div className={styles.emptyLibrary}>
              <svg className={styles.emptyIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="96" height="96">
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M19 3l4 5v11a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8l4-5h14zm-8 2H7l-2 3h6V5zm8 0h-4v3h6l-2-3zM5 14h14v2H5v-2z" fill="currentColor" />
              </svg>
              <h2>您的图书馆还没有书籍</h2>
              <p>通过上方的上传功能添加书籍到您的图书馆</p>
            </div>
          ) : (
            <div className={view === 'grid' ? styles.booksGrid : styles.booksList}>
              {sortedBooks
                .filter(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((book) => {
                  // 查找该书的阅读记录
                  const record = readingRecords.find(r => r.bookId === book.id);
                  const progress = record ? Math.round(record.progress * 100) : 0;
                  const lastRead = record ? new Date(record.lastRead).toLocaleDateString() : '未读';

                  // 判断是HTTPS链接还是本地文件
                  const isHttps = book.url.startsWith('https://');
                  const linkTypeLabel = isHttps ? 'HTTPS链接' : '本地文件';

                  return (
                    <div key={book.id} className={view === 'grid' ? styles.bookCard : styles.bookRow}>
                      {view === 'grid' && (
                        <div className={styles.bookCover} style={{ backgroundColor: book.coverColor || '#1e90ff' }}>
                          <span className={styles.bookInitial}>{book.title.charAt(0)}</span>
                          <div className={styles.linkTypeTag}>{linkTypeLabel}</div>
                        </div>
                      )}
                      <div className={styles.bookInfo}>
                        <div className={styles.bookTitleContainer}>
                          <h3 className={styles.bookTitle}>{book.title}</h3>
                          {view !== 'grid' && <div className={styles.linkTypeTag}>{linkTypeLabel}</div>}
                          <CopyButton text={book.url} tooltipText={`${linkTypeLabel}: ${book.url}`} />
                        </div>
                        <div className={styles.bookMeta}>
                          {view === 'grid' && (
                            <div className={styles.progressBar}>
                              <div
                                className={styles.progressFill}
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          )}
                          <div className={styles.bookDetails}>
                            <span>进度: {progress}%</span>
                            <span>最近阅读: {lastRead}</span>
                            <span>添加于: {new Date(book.dateAdded).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className={styles.bookActions}>
                          <Link
                            href={`/reader/${book.id}?furl=${encodeURIComponent(book.url)}`}
                            target='_blank'
                            className={styles.readButton}
                          >
                            继续阅读
                          </Link>
                          <button
                            onClick={() => deleteBook(book.id)}
                            className={styles.deleteButton}
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {readingRecords.length > 0 && (
            <div className={styles.recordsSection}>
              <div className={styles.recordsHeader}>
                <h2>阅读记录</h2>
                <button onClick={clearAllRecords} className={styles.clearButton}>
                  清除所有记录
                </button>
              </div>
              <div className={styles.recordsList}>
                {readingRecords.map((record) => {
                  // 查找对应的书籍
                  const book = books.find(b => b.id === record.bookId) || { title: '未知书籍' };
                  return (
                    <div key={record.bookId} className={styles.recordItem}>
                      <div className={styles.recordInfo}>
                        <h3>{book.title}</h3>
                        <div className={styles.recordDetails}>
                          <span>阅读进度: {Math.round(record.progress * 100)}%</span>
                          <span>最近阅读: {new Date(record.lastRead).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className={styles.recordActions}>
                        {books.find(b => b.id === record.bookId) && (
                          <Link
                            href={`/reader/${record.bookId}?furl=${encodeURIComponent(books.find(b => b.id === record.bookId).url)}`}
                            className={styles.continueButton}
                          >
                            继续阅读
                          </Link>
                        )}
                        <button
                          onClick={() => clearBookRecord(record.bookId)}
                          className={styles.clearRecordButton}
                        >
                          清除记录
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 本地存储提示 */}
          <div className={styles.storageNotice || styles.emptyLibrary}>
            <h2>温馨提示</h2>
            <p>您的图书馆数据将存储在浏览器的本地存储中。请注意以下事项：</p>
            <ul className={styles.storageNoticeList}>
              <li>- 清除浏览器数据可能会导致您的图书馆数据丢失</li>
              <li>- 不同浏览器或设备之间的数据不会同步</li>
              <li>- 建议定期备份重要的电子书文件</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 确认对话框 */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />

    </Layout>
  );
}
