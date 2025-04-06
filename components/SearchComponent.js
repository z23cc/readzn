import { useState, useEffect } from 'react';
import styles from '@/styles/SearchComponent.module.css';
import Link from 'next/link';
import LazyImage from './LazyImage';
import DefaultCover from './DefaultCover';
import secureFetch from '@/lib/client/fetch';

const SearchComponent = ({ postsToShow, initialSearchValue = '' }) => {
  const [searchValue, setSearchValue] = useState(initialSearchValue);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchSite, setSearchSite] = useState('一单书');
  const [externalSearchUrl, setExternalSearchUrl] = useState('');
  const [showExternalContent, setShowExternalContent] = useState(false);
  const [isExternalLoading, setIsExternalLoading] = useState(false);
  const [currentSiteCategory, setCurrentSiteCategory] = useState('电子书');
  const [recommendedBook, setRecommendedBook] = useState(null);
  const [placeholderText, setPlaceholderText] = useState('');
  const [isRandomLoading, setIsRandomLoading] = useState(false);

  // 预定义推荐书籍列表（按分类）
  const recommendedBooks = {
    '电子书': [
      { title: '小米创业思考', rating: '8.2', ratingText: "豆瓣{ratingTerm}分" },
      { title: '如何找到想做的事', rating: '7.5', ratingText: "豆瓣新书{ratingTerm}分" },
      // 其他电子书...
    ],
    '漫画绘本': [
      { title: '火影忍者' },
      { title: '海贼王' },
      { title: '进击的巨人' },
      { title: '鬼灭之刃' },
      { title: '名侦探柯南' },
      { title: '哆啦A梦' },
      { title: '蜡笔小新' },
      { title: '灌篮高手' },
      { title: '死神' },
      { title: '龙珠' }
    ],
    '小说': [
      { title: '剑来' },
      { title: '我的武魂是盘古' },
      { title: '我把全修真界卷哭了' },
      { title: '大奉打更人' },
      { title: '顶A校草的阴郁beta室友' },
      { title: '问鼎仙缘' },
      { title: '向阳小镇' },
      { title: '大爱仙尊' },
      { title: '沉船' },
      { title: '凡人修仙传' },
      { title: '仙逆' },
      { title: '一念永恒' }
    ],
    '学术期刊': [
      { title: '人工智能发展趋势' },
      { title: '区块链技术应用' },
      { title: '气候变暖研究' },
      { title: '新冠疫情影响' },
      { title: '量子计算前沿' },
      { title: '脑科学研究进展' },
      { title: '可持续发展策略' },
      { title: '生物技术创新' },
      { title: '数字经济转型' },
      { title: '教育科技融合' }
    ]
  };

  // 预定义搜索站点
  const searchSites = [
    { id: '一单书', category: '电子书', name: '一单书', placeholder: '在一单书搜索...', url: 'https://yidanshu.com/sobook/{searchTerm}' },
    { id: 'Z-Library', category: '电子书', name: 'Z-Library', placeholder: '在Z-Library搜索...', url: 'https://zh.101ml.sbs/s/{searchTerm}?' },
    { id: '书海旅人', category: '电子书', name: '书海旅人', placeholder: '在书海旅人搜索...', url: 'https://bookplusapp.top/books?key={searchTerm}' },
    { id: '读书派', category: '电子书', name: '读书派', placeholder: '在读书派搜索...', url: 'https://www.dushupai.com/search.html?k={searchTerm}' },
    { id: '爱悦读', category: '电子书', name: '爱悦读', placeholder: '在爱悦读搜索...', url: 'https://www.iyd.wang/?s={searchTerm}' },
    { id: '包子漫画', category: '漫画绘本', name: '包子漫画', placeholder: '在包子漫画搜索...', url: 'https://cn.baozimhcn.com/search?q={searchTerm}' },
    { id: 'GoDa漫画', category: '漫画绘本', name: 'GoDa漫画', placeholder: '在GoDa漫画搜索...', url: 'https://godamh.com/s/{searchTerm}' },
    { id: 'MYCOMIC', category: '漫画绘本', name: 'MYCOMIC', placeholder: '在MYCOMIC搜索...', url: 'https://mycomic.com/cn/comics?q={searchTerm}' },
    { id: '漫本', category: '漫画绘本', name: '漫本', placeholder: '在漫本搜索...', url: 'https://www.manben.com/search?title={searchTerm}&language=1' },
    { id: '漫自由', category: '漫画绘本', name: '漫自由', placeholder: '在漫自由搜索...', url: 'https://mhx12.com/m/comic/search?q={searchTerm}' },
    { id: '动漫之家', category: '漫画绘本', name: '动漫之家', placeholder: '在动漫之家搜索...', url: 'https://manhua.dmzj.com/tags/search.shtml?s={searchTerm}' },
    { id: '拷贝漫画', category: '漫画绘本', name: '拷贝漫画', placeholder: '在拷贝漫画搜索...', url: 'https://www.mangacopy.com/search?q={searchTerm}&q_type=' },
    { id: '笔趣阁', category: '小说', name: '笔趣阁', placeholder: '在笔趣阁搜索...', url: 'https://www.mfxs0.cn/?pbcode/so/{searchTerm}' },
    { id: '新书阁', category: '小说', name: '新书阁', placeholder: '在新书阁搜索...', url: 'https://www.xinshuge.xyz/search/{searchTerm}.html' },
    { id: '万本小说', category: '小说', name: '万本小说', placeholder: '在万本小说搜索...', url: 'https://www.10000txt.com/search.php?q={searchTerm}' },
    { id: '知轩藏书', category: '小说', name: '知轩藏书', placeholder: '在知轩藏书搜索...', url: 'https://zxcs.info/search/index/init.html?q={searchTerm}&modelid=0' },
    { id: '起点中文网', category: '小说', name: '起点中文网', placeholder: '在起点中文网搜索...', url: 'https://www.qidian.com/search?kw={searchTerm}' },
    { id: '知网', category: '学术期刊', name: '中国知网', placeholder: '在中国知网搜索...', url: 'https://kns.cnki.net/kns8/defaultresult/index?kw={searchTerm}' },
    { id: '万方', category: '学术期刊', name: '万方数据', placeholder: '在万方数据搜索...', url: 'https://www.wanfangdata.com.cn/search/searchList.do?searchType=all&searchWord={searchTerm}' },
    { id: '维普', category: '学术期刊', name: '维普期刊', placeholder: '在维普期刊搜索...', url: 'http://qikan.cqvip.com/Qikan/Search/Index?key={searchTerm}' }
  ];

  // 随机获取推荐书籍
  const getRandomBook = (category) => {
    if (recommendedBooks[category] && recommendedBooks[category].length > 0) {
      const randomIndex = Math.floor(Math.random() * recommendedBooks[category].length);
      return recommendedBooks[category][randomIndex];
    }
    return null;
  };

  // 获取随机书籍推荐
  const fetchRandomBook = async () => {
    // 只有电子书类别支持随机选书API
    if (currentSiteCategory !== '电子书') {
      return;
    }

    setIsRandomLoading(true);
    try {
      // 使用Next.js API路由代理请求，避免CORS问题
      const proxyUrl = `/api/proxy?url=${encodeURIComponent('https://xiayibendushenme.com/api/bookbeans/random')}`;
      // 使用安全fetch函数，自动处理加密响应
      const data = await secureFetch(proxyUrl);

      if (Array.isArray(data) && data.length > 0) {
        const randomBook = data[0];
        // 更新搜索框placeholder
        const selectedSite = searchSites.find(site => site.id === searchSite);
        if (selectedSite) {
          const cleanTitle = randomBook.title.replace(/[《》]/g, '');
          setPlaceholderText(`在${selectedSite.name}搜索《${cleanTitle}》评级${randomBook.score}星`);
        }

        // 更新推荐书籍
        const bookTitle = randomBook.title.replace(/《|》/g, ''); // 移除书名中的书名号
        setRecommendedBook({
          title: bookTitle,
          rating: randomBook.score,
          ratingText: `评级${randomBook.score}星`
        });

        // 如果搜索框不为空，则将推荐书籍的标题设置为搜索框的值
        if (searchValue && searchValue.trim() !== '') {
          setSearchValue(bookTitle);
        }
      }
    } catch (error) {
      console.error('获取随机书籍数据失败:', error);
    } finally {
      setIsRandomLoading(false);
    }
  };

  // 从豆瓣API获取新书数据并更新推荐书籍和placeholder
  // 使用sessionStorage缓存数据，避免页面内多次请求API
  const fetchDoubanBooks = async () => {
    try {
      // 检查sessionStorage中是否已有缓存数据
      const cachedData = sessionStorage.getItem('doubanBooksCache');

      if (cachedData) {
        // 如果有缓存数据，直接使用
        const parsedData = JSON.parse(cachedData);
        // 更新推荐书籍列表
        recommendedBooks['电子书'] = parsedData;
        // 更新当前分类的推荐书籍和placeholder
        updateRecommendedBookAndPlaceholder(currentSiteCategory, searchSite);
        return;
      }

      // 如果没有缓存数据，则请求API
      // 使用Next.js API路由代理请求，避免CORS问题
      const proxyUrl = `/api/proxy?url=${encodeURIComponent('https://xiayibendushenme.com/api/doubannews')}`;
      // 使用安全fetch函数，自动处理加密响应
      const data = await secureFetch(proxyUrl);

      if (Array.isArray(data) && data.length > 0) {
        // 将API返回的书籍添加到电子书类别中，确保不重复
        const updatedBooks = [...recommendedBooks['电子书']];

        data.forEach(book => {
          // 检查是否已存在相同标题的书籍
          const existingBookIndex = updatedBooks.findIndex(item => item.title === book.title);

          if (existingBookIndex === -1) {
            // 如果不存在，添加新书
            updatedBooks.push({
              title: book.title,
              rating: book.rating
            });
          }
        });

        // 更新推荐书籍列表
        recommendedBooks['电子书'] = updatedBooks;

        // 将数据缓存到sessionStorage
        sessionStorage.setItem('doubanBooksCache', JSON.stringify(updatedBooks));

        // 更新当前分类的推荐书籍和placeholder
        updateRecommendedBookAndPlaceholder(currentSiteCategory, searchSite);
      }
    } catch (error) {
      console.error('获取豆瓣新书数据失败:', error);
      // 即使API请求失败，也尝试使用现有的推荐书籍更新placeholder
      updateRecommendedBookAndPlaceholder(currentSiteCategory, searchSite);
    }
  };

  // 统一更新推荐书籍和placeholder的函数
  const updateRecommendedBookAndPlaceholder = (category, siteId) => {
    // 确保使用最新的推荐书籍列表
    // 对于电子书分类，确保包含从豆瓣API获取的书籍
    const cachedData = sessionStorage.getItem('doubanBooksCache');
    if (category === '电子书' && cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          // 临时更新recommendedBooks以确保包含豆瓣数据
          recommendedBooks['电子书'] = parsedData;
        }
      } catch (error) {
        console.error('解析缓存的豆瓣书籍数据失败:', error);
      }
    }

    // 获取该分类的随机推荐书籍
    const newRecommendedBook = getRandomBook(category);
    setRecommendedBook(newRecommendedBook);

    // 更新placeholder
    if (newRecommendedBook) {
      const sitesInCategory = searchSites.filter(site => site.category === category);
      const selectedSite = siteId ?
        searchSites.find(site => site.id === siteId) :
        (sitesInCategory.length > 0 ? sitesInCategory[0] : null);

      if (selectedSite) {
        setPlaceholderText(`在${selectedSite.name}搜索《${newRecommendedBook.title}》${newRecommendedBook.rating ? ` 豆瓣新书${newRecommendedBook.rating}分` : ''}`);
      }
    }
  };

  // 在组件加载时初始化推荐书籍
  useEffect(() => {
    // 先从豆瓣API获取新书数据，然后再更新推荐书籍和placeholder
    fetchDoubanBooks();

    // 不需要清除timer，因为没有使用setTimeout
  }, []);


  // 处理搜索输入
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (searchSite === '站内') {
      setShowSearchResults(value.trim() !== '');
      setShowExternalContent(false);
    }
  };

  // 清除搜索
  const clearSearch = () => {
    setSearchValue('');
    setShowSearchResults(false);
    setShowExternalContent(false);
    setExternalSearchUrl('');
  };

  // 处理站点分类切换
  const handleCategoryChange = (category) => {
    setCurrentSiteCategory(category);
    // 选择该分类下的第一个站点
    const sitesInCategory = searchSites.filter(site => site.category === category);
    const newSiteId = sitesInCategory.length > 0 ? sitesInCategory[0].id : null;

    if (newSiteId) {
      setSearchSite(newSiteId);
    }

    setShowSearchResults(false);
    setShowExternalContent(false);
    setExternalSearchUrl('');

    // 使用统一函数更新推荐书籍和placeholder
    updateRecommendedBookAndPlaceholder(category, newSiteId);
  };

  // 处理站点选择变化
  const handleSiteChange = (siteId) => {
    setSearchSite(siteId);
    setShowSearchResults(false);
    setShowExternalContent(false);
    setExternalSearchUrl('');

    // 使用统一函数更新placeholder
    const selectedSite = searchSites.find(site => site.id === siteId);
    if (selectedSite) {
      // 如果有推荐书籍，使用推荐书籍更新placeholder
      if (recommendedBook) {
        setPlaceholderText(`在${selectedSite.name}搜索《${recommendedBook.title}》${recommendedBook.rating ? ` 豆瓣新书${recommendedBook.rating}分` : ''}`);
      } else {
        // 如果没有推荐书籍，使用默认placeholder
        setPlaceholderText(selectedSite.placeholder);
        // 尝试获取该分类的推荐书籍
        updateRecommendedBookAndPlaceholder(currentSiteCategory, siteId);
      }
    }

    // 如果搜索框有内容，自动触发搜索
    if (searchValue.trim() !== '') {
      // 延迟执行以确保状态更新
      setTimeout(() => {
        if (siteId === '站内') {
          // 在新标签页打开站内搜索结果
          const searchParams = new URLSearchParams();
          searchParams.append('q', searchValue);
          window.open(`/search?${searchParams.toString()}`, '_blank');
        } else {
          const selectedSite = searchSites.find(site => site.id === siteId);
          if (selectedSite && selectedSite.url) {
            const url = selectedSite.url.replace('{searchTerm}', encodeURIComponent(searchValue));
            // 在新标签页打开外部搜索
            window.open(url, '_blank');
          }
        }
      }, 0);
    }
    // 如果搜索框为空但有推荐书籍，使用推荐书籍作为搜索词
    else if (recommendedBook) {
      // 延迟执行以确保状态更新
      setTimeout(() => {
        if (siteId === '站内') {
          // 在新标签页打开站内搜索结果
          const searchParams = new URLSearchParams();
          searchParams.append('q', recommendedBook.title);
          window.open(`/search?${searchParams.toString()}`, '_blank');
        } else {
          const selectedSite = searchSites.find(site => site.id === siteId);
          if (selectedSite && selectedSite.url) {
            const url = selectedSite.url.replace('{searchTerm}', encodeURIComponent(recommendedBook.title));
            // 在新标签页打开外部搜索
            window.open(url, '_blank');
          }
        }
      }, 0);
    }
  };

  // 处理搜索提交
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // 如果搜索框为空但有推荐书籍，则使用推荐书籍作为搜索词
    if (searchValue.trim() === '' && recommendedBook) {
      setSearchValue(recommendedBook.title);
      // 使用推荐书籍进行搜索
      performSearch(recommendedBook.title);
      return;
    } else if (searchValue.trim() === '') {
      return;
    }

    // 使用用户输入的搜索词进行搜索
    performSearch(searchValue);
  };

  // 执行搜索
  const performSearch = (searchTerm) => {
    if (searchSite === '站内') {
      // 在新标签页打开站内搜索结果
      const searchParams = new URLSearchParams();
      searchParams.append('q', searchTerm);
      window.open(`/search?${searchParams.toString()}`, '_blank');
    } else {
      const selectedSite = searchSites.find(site => site.id === searchSite);
      if (selectedSite && selectedSite.url) {
        const url = selectedSite.url.replace('{searchTerm}', encodeURIComponent(searchTerm));
        // 在新标签页打开外部搜索
        window.open(url, '_blank');
      }
    }
  };

  // 搜索结果
  let searchResults = [];
  if (searchValue.trim() !== '' && searchSite === '站内' && postsToShow) {
    searchResults = postsToShow.filter(post => {
      const tagContent = post.tags ? post.tags.join(' ') : '';
      const searchContent = post.title + post.summary + tagContent;
      return searchContent.toLowerCase().includes(searchValue.toLowerCase());
    }).map(post => ({
      ...post,
      image: post.cover ? "https://cdn.jsdelivr.net/gh/ChrisHyperFunc/static-storage@main" + post.cover : null
    }));
  }

  return (
    <div>
      <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
        {/* 站点分类选择器 */}
        <div className={styles.categorySelectorWrapper}>
          <div className={styles.categorySelector}>
            {/* 获取所有不重复的分类 */}
            {Array.from(new Set(searchSites.map(site => site.category))).map(category => (
              <button
                key={category}
                type="button"
                className={`${styles.categoryBtn} ${currentSiteCategory === category ? styles.categoryBtnActive : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {/* 为不同分类添加不同图标 */}
                {category === '电子书' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                )}
                {category === '漫画绘本' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                )}
                {category === '小说' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                  </svg>
                )}
                {category === '学术期刊' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                )}
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 搜索站点选择器 */}
        <div className={styles.searchSiteSelector}>
          {searchSites
            .filter(site => site.category === currentSiteCategory)
            .map(site => (
              <button
                key={site.id}
                type="button"
                className={`${styles.siteSelectorBtn} ${searchSite === site.id ? styles.siteSelectorBtnActive : ''}`}
                onClick={() => handleSiteChange(site.id)}
              >
                {site.name}
              </button>
            ))}
        </div>

        {/* 搜索输入框和按钮 */}
        <div className={styles.searchInputWrapper}>
          <div className={styles.inputWithIcon}>
            {/* 随机选书图标 */}
            <button
              type="button"
              className={styles.randomBookBtn}
              onClick={fetchRandomBook}
              aria-label="随机选书"
              title="随机选书"
              disabled={isRandomLoading || currentSiteCategory !== '电子书'}
            >
              {isRandomLoading ? (
                <span className={styles.randomLoading}></span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 2v6h6"></path>
                  <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
                  <path d="M21 22v-6h-6"></path>
                  <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
                </svg>
              )}
            </button>
            <input
              type="text"
              className={styles.searchInput}
              placeholder={placeholderText || '搜索...'}
              value={searchValue}
              onChange={handleSearchInput}
            />
            {searchValue && (
              <button
                type="button"
                className={styles.clearSearchBtn}
                onClick={clearSearch}
                aria-label="清除搜索"
              >
                ×
              </button>
            )}
          </div>
          <button type="submit" className={styles.searchSubmitBtn}>
            搜索
          </button>
        </div>
      </form>

      {/* 搜索结果区域 */}
      {showSearchResults && searchResults.length > 0 && (
        <div className={styles.searchResults}>
          <div className={styles.searchResultsHeader}>
            <h2>搜索结果: {searchResults.length} 个资源</h2>
            <button className={styles.backButton} onClick={clearSearch}>返回</button>
          </div>
          <div className={styles.resourceGrid}>
            {searchResults.map(post => (
              <div key={post.id} className={styles.resourceCard}>
                <div className={styles.cardImage}>
                  {post.image ? (
                    <LazyImage src={post.image} alt={post.title} width={300} height={120} crossOrigin="anonymous" />
                  ) : (
                    <DefaultCover title={post.title} />
                  )}
                  {post.up && <div className={styles.officialRecommend}>官方推荐</div>}
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{post.title}</h3>
                  <p className={styles.cardDescription}>{post.summary}</p>
                  {post.tags && post.tags.length > 0 && (
                    <div className={styles.cardTags}>
                      {post.tags.map(tag => (
                        <Link href={`/tag/${tag}`} key={tag}>
                          <span className={styles.cardTag}>{tag}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                  <Link href={`/sites/${post.slug}`} className={styles.cardLink}>
                    查看详情
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 搜索结果为空 */}
      {showSearchResults && searchResults.length === 0 && (
        <div className={styles.searchResults}>
          <div className={styles.searchResultsHeader}>
            <h2>搜索结果</h2>
            <button className={styles.backButton} onClick={clearSearch}>返回</button>
          </div>
          <div className={styles.noResults}>没有找到相关资源</div>
        </div>
      )}

      {/* 外部内容区域 */}
      {showExternalContent && (
        <div className={styles.searchResults}>
          <div className={styles.searchResultsHeader}>
            <h2>搜索结果: {searchSite}</h2>
            <button className={styles.backButton} onClick={clearSearch}>返回</button>
          </div>
          <div className={styles.externalContentWrapper}>
            <iframe
              src={externalSearchUrl}
              className={styles.externalContent}
              onLoad={() => setIsExternalLoading(false)}
              title="外部搜索结果"
            ></iframe>
            {isExternalLoading && (
              <div className={styles.loadingIndicator}>
                <div className={styles.loadingSpinner}></div>
                <p>正在加载搜索结果...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
