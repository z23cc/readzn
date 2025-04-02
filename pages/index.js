import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/BookGuide.module.css';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from "next/link";
import { useConfig } from "@/lib/config";
import { getAllPosts } from '@/lib/notion';
import { clientConfig } from '@/lib/server/config';
import BookmarkPrompt from '@/components/BookmarkPrompt';
import SiteInfo from '@/components/SiteInfo';
import LinkStatus from '@/components/LinkStatus';

export async function getStaticProps() {
  const posts = await getAllPosts({ includePages: false, owner: 'resource_nav' })
  // const postsToShow = posts.slice(0, clientConfig.postsPerPage)
  const postsToShow = posts
  const totalPosts = posts.length
  const showNext = totalPosts > clientConfig.postsPerPage
  return {
    props: {
      postsToShow,
      showNext
    },
    revalidate: 1
  }
}

export default function Home({ postsToShow }) {
  const BLOG = useConfig();
  const [activeCategory, setActiveCategory] = useState('zlibrary专栏');
  const [searchValue, setSearchValue] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchSite, setSearchSite] = useState('一单书');
  const [externalSearchUrl, setExternalSearchUrl] = useState('');
  const [showExternalContent, setShowExternalContent] = useState(false);
  const [isExternalLoading, setIsExternalLoading] = useState(false);
  const [searchInNewTab, setSearchInNewTab] = useState(true);

  // 预定义搜索站点
  const searchSites = [
    { id: '一单书', name: '一单书', placeholder: '在一单书搜索...', url: 'https://yidanshu.com/sobook/{searchTerm}' },
    { id: '百度', name: '百度', placeholder: '在百度搜索...', url: 'https://www.baidu.com/s?wd={searchTerm}' },
    { id: 'Google', name: 'Google', placeholder: '在Google搜索...', url: 'https://www.google.com/search?q={searchTerm}' },
    { id: '站内', name: '站内搜索', placeholder: '搜索资源...' }
  ];

  // 滚动到指定区域
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; // 偏移量，考虑到固定导航栏的高度
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setActiveCategory(id);
  };

  // 菜单分类
  const categories = [];
  // 资源网站数据
  const resources = {};

  // 搜索结果
  let searchResults = [];
  if (searchValue.trim() !== '' && searchSite === '站内') {
    searchResults = postsToShow.filter(post => {
      const tagContent = post.tags ? post.tags.join(' ') : '';
      const searchContent = post.title + post.summary + tagContent;
      return searchContent.toLowerCase().includes(searchValue.toLowerCase());
    }).map(post => ({
      ...post,
      image: post.cover ? "https://cdn.jsdelivr.net/gh/ChrisHyperFunc/static-storage@main" + post.cover : "https://cdn.jsdelivr.net/gh/ChrisHyperFunc/static-storage@main/img/default.png"
    }));
  }

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

  // 处理站点选择变化
  const handleSiteChange = (siteId) => {
    setSearchSite(siteId);
    setShowSearchResults(false);
    setShowExternalContent(false);
    setExternalSearchUrl('');
  };

  // 切换搜索结果显示模式
  const toggleSearchMode = () => {
    setSearchInNewTab(!searchInNewTab);
  };

  // 处理搜索提交
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim() === '') return;

    if (searchSite === '站内') {
      if (searchInNewTab) {
        // 在新标签页打开站内搜索结果
        const searchParams = new URLSearchParams();
        searchParams.append('q', searchValue);
        window.open(`/search?${searchParams.toString()}`, '_blank');
      } else {
        // 在当前页面显示搜索结果
        setShowSearchResults(true);
        setShowExternalContent(false);
      }
    } else {
      const selectedSite = searchSites.find(site => site.id === searchSite);
      if (selectedSite && selectedSite.url) {
        const url = selectedSite.url.replace('{searchTerm}', encodeURIComponent(searchValue));
        if (searchInNewTab) {
          // 在新标签页打开外部搜索
          window.open(url, '_blank');
        } else {
          // 使用代理API在当前页面加载外部搜索结果
          const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
          setExternalSearchUrl(proxyUrl);
          setShowSearchResults(false);
          setShowExternalContent(true);
          setIsExternalLoading(true);
        }
      }
    }
  };

  // 遍历postsToShow，填充菜单和资源网站数据
  postsToShow.forEach(post => {
    if (post.categories && post.categories.length > 0) {
      post.categories.forEach(category => {
        if (!categories.find(cat => cat.id === category)) {
          categories.push({ id: category, name: category });
        }
        // 检查resources[category]是否存在，如果不存在则初始化为空数组
        if (!resources[category]) {
          resources[category] = [];
        }
        resources[category].push({
          id: post.id,
          title: post.title,
          description: post.summary,
          image: post.cover ? "https://cdn.jsdelivr.net/gh/ChrisHyperFunc/static-storage@main" + post.cover : "https://cdn.jsdelivr.net/gh/ChrisHyperFunc/static-storage@main/img/default.png",
          link: post.link,
          tags: post.tags,
          slug: post.slug,
          up: post.up
        });
      });
    }
  });

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>阅读指南 - 发现优质阅读资源</title>
          <meta name="description" content="发现和探索全球优质的电子书、有声读物、学术论文和杂志资源网站，让阅读更便捷。" />
          <meta name="keywords" content="阅读指南, 电子书资源, Z-Library, 学术论文, 有声读物, 免费电子书, 阅读资源导航" />
          <link rel="icon" href="/favicon.png" />
          <link rel="icon" href="/favicon.dark.png" media="(prefers-color-scheme: dark)" />

          {/* Open Graph标签 */}
          <meta property="og:title" content="阅读指南 - 发现优质阅读资源" />
          <meta property="og:description" content="发现和探索全球优质的电子书、有声读物、学术论文和杂志资源网站，让阅读更便捷。" />
          <meta property="og:image" content="/og-image.jpg" />
          <meta property="og:url" content={`${BLOG.link}`} />

          {/* Twitter Cards */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="阅读指南 - 发现优质阅读资源" />
          <meta name="twitter:description" content="发现和探索全球优质的电子书、有声读物、学术论文和杂志资源网站，让阅读更便捷。" />

          {/* 规范链接 */}
          <link rel="canonical" href={`${BLOG.link}`} />
        </Head>

        {/* 顶部横幅 */}
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>阅读指南</h1>
          <p className={styles.heroSubtitle}>发现和探索全球优质的阅读资源，让知识触手可及</p>
          <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
            <div className={styles.searchSiteSelector}>
              {searchSites.map(site => (
                <button
                  key={site.id}
                  type="button"
                  className={`${styles.siteSelectorBtn} ${searchSite === site.id ? styles.siteSelectorBtnActive : ''}`}
                  onClick={() => handleSiteChange(site.id)}
                >
                  {site.name}
                </button>
              ))}
              <button
                type="button"
                className={styles.searchModeToggle}
                onClick={toggleSearchMode}
                title={searchInNewTab ? "在新标签页打开搜索结果" : "在当前页面显示搜索结果"}
              >
                {searchInNewTab ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                  </svg>
                )}
              </button>
            </div>
            <div className={styles.searchInputWrapper}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder={searchSites.find(site => site.id === searchSite)?.placeholder || "搜索资源..."}
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
              <button type="submit" className={styles.searchSubmitBtn}>搜索</button>
            </div>
          </form>
        </div>

        {/* 站内搜索结果 */}
        {showSearchResults && (
          <div className={styles.searchResults}>
            <div className={styles.searchResultsHeader}>
              <h2>搜索结果: {searchResults.length} 个资源</h2>
              <button onClick={clearSearch} className={styles.backButton}>返回全部资源</button>
            </div>
            <div className={styles.resourceGrid}>
              {searchResults.length > 0 ? (
                searchResults.map((resource, index) => (
                  <div key={index} className={styles.resourceCard}>
                    <div className={styles.cardImage}>
                      <Image src={resource.image} alt={resource.title} layout="fill" objectFit="cover" />
                      {resource.up && resource.up.includes('up') && (
                        <div className={styles.officialRecommend}>✓ 官方推荐</div>
                      )}
                    </div>
                    <div className={styles.cardContent}>
                      <h3 className={styles.cardTitle}>{resource.title}</h3>
                      <p className={styles.cardDescription}>{resource.summary || resource.description}</p>
                      <div className={styles.cardTags}>
                        {resource.tags && resource.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className={styles.cardTag}>{tag}</span>
                        ))}
                      </div>
                      <LinkStatus url={resource.link || '#'} />
                      <a href={`/sites/${resource.slug}`} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>立即访问</a>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noResults}>没有找到匹配的资源，请尝试其他关键词</div>
              )}
            </div>
          </div>
        )}

        {/* 外部搜索结果 - 使用iframe嵌入 */}
        {showExternalContent && (
          <div className={styles.searchResults}>
            <div className={styles.searchResultsHeader}>
              <h2>外部搜索结果: {searchSite}</h2>
              <button onClick={clearSearch} className={styles.backButton}>返回全部资源</button>
            </div>
            <div className={styles.externalContentWrapper}>
              {isExternalLoading && (
                <div className={styles.loadingIndicator}>
                  <div className={styles.loadingSpinner}></div>
                  <p>正在加载搜索结果...</p>
                </div>
              )}
              <iframe
                src={externalSearchUrl}
                className={styles.externalContent}
                onLoad={() => setIsExternalLoading(false)}
                title={`${searchSite}搜索结果`}
              />
            </div>
          </div>
        )}

        {/* 主内容区域 - 仅在非搜索状态和非外部内容状态下显示 */}
        {!showSearchResults && !showExternalContent && (
        <main className={styles.main}>
          {/* 左侧菜单 */}
          <aside className={styles.sidebar}>
            <h2 className={styles.sidebarTitle}>资源分类</h2>
            <ul className={styles.menuList}>
              {categories.map((category) => (
                <li key={category.id} className={styles.menuItem}>
                  <a
                    href={`#${category.id}`}
                    className={`${styles.menuLink} ${activeCategory === category.id ? styles.menuLinkActive : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(category.id);
                    }}
                  >
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* 右侧内容区域 */}
          <div className={styles.content}>
            {categories.map((category) => (
              <section key={category.id} id={category.id} className={styles.section}>
                <h2 className={styles.sectionTitle}>{category.name}</h2>
                <div className={styles.resourceGrid}>
                  {resources[category.id]?.map((resource, index) => (
                    <div key={index} className={styles.resourceCard}>
                      <div className={styles.cardImage}>
                        <Image src={resource.image} alt={resource.title} layout="fill" objectFit="cover" />
                        {resource.up && resource.up.includes('up') && (
                          <div className={styles.officialRecommend}>✓ 官方推荐</div>
                        )}
                      </div>
                      <div className={styles.cardContent}>
                        <h3 className={styles.cardTitle}>{resource.title}</h3>
                        <p className={styles.cardDescription}>{resource.description}</p>
                        <div className={styles.cardTags}>
                          {resource.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className={styles.cardTag}>{tag}</span>
                          ))}
                        </div>
                        {/* 添加链接状态指示器 */}
                        <LinkStatus url={resource.link || '#'} />
                        <a href={`/sites/${resource.slug}`} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>立即访问</a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>
        )}

        {/* 收藏提示框 */}
        <BookmarkPrompt />

        {/* MIT开源协议和Notion后台管理信息 */}
        <SiteInfo />
      </div>
    </Layout>
  );
}
