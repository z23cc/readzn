import React from 'react';
import styles from '@/styles/SiteInfo.module.css';

const SiteInfo = () => {
  return (
    <div className={styles.siteInfoSection}>
      <div className={styles.siteInfoContent}>
        <h3 className={styles.siteInfoTitle}>技术开源</h3>
        <p className={styles.siteInfoText}>本站基础技术开源采用 <span className={styles.siteInfoHighlight}>MIT开源协议</span>，旨在分享Notion的创新思路，与生产环境可能存在差异但基础原理是一样的，非常适合学习和个人项目使用。</p>
        <p className={styles.siteInfoText}>后台管理基于 <a href="https://www.notion.com/zh-cn" target="_blank" rel="noopener noreferrer" className={styles.siteInfoHighlight}>Notion</a>，无需复杂的CMS系统零成本维护，轻量级部署方案让您可以专注于内容创作，特别适合博客、文档站点和个人知识库的搭建。</p>
        <p className={styles.siteInfoText}>如果您对本站技术实现感兴趣，欢迎访问我们的<a href="https://github.com/ChrisHyperFunc/readzn" target="_blank" rel="noopener noreferrer" className={styles.siteInfoHighlight} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>GitHub<svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg></a>了解更多信息。</p>
      </div>
    </div>
  );
};

export default SiteInfo;