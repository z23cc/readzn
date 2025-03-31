import Head from 'next/head';
import Layout from '@/components/Layout';
import styles from '@/styles/ContactUs.module.css';
import { useConfig } from '@/lib/config'
import BookmarkPrompt from '@/components/BookmarkPrompt';
import SiteInfo from '@/components/SiteInfo';

export default function Contact() {
  const BLOG = useConfig();
  return (
    <Layout>
      <Head>
        <title>关于我们 - 阅读指南</title>
        <meta name="description" content="阅读指南 - 免费电子书资源导航平台，提供Z-Library镜像站、学术论文数据库、优质杂志网站推荐，助力您的知识探索之旅。" />
      </Head>

      <div className={styles.contactContainer}>
        <div className={styles.contactHeader}>
          <h1>关于阅读指南</h1>
          <p>让知识触手可及，让阅读更加便捷</p>
          <div className={styles.aboutUs}>
            <h2>建站初衷</h2>
            <p>本质创立于2025年，源于对「知识无界，阅读无限」的执着追求，致力于打造一个解决阅读烦恼的一站式平台。我们关注阅读爱好者们的核心需求：</p>
            <ul>
              <li>资源分散：优质电子书和学术文献分布广泛，难以快速获取；</li>
              <li>获取门槛高：专业资料的访问受限，阻碍知识流通；</li>
              <li>选择困难：面对众多阅读平台，缺乏可靠的筛选依据；</li>
              <li>工具质量：免费工具操作复杂功能有限，高质量的工具又需高昂费用。</li>
            </ul>
            <p>为此，我们打造了一个精心策划的「阅读指南」平台，提供以下服务：</p>
            <ul>
              <li>持续追踪并评估全球200+个优质电子书平台；</li>
              <li>严格筛选最稳定可靠的图书和学术资源库；</li>
              <li>定期更新资源链接，确保访问顺畅；</li>
              <li>提供详细的平台测评和使用指南；</li>
              <li>提供完全免费精美且功能强大的各类工具。</li>
            </ul>
            <p>我们使命是：通过精选全球优质阅读资源和开发开源阅读工具，为人们带来愉悦、高效的阅读体验。</p>
            <h2>欢迎投稿</h2>
            <p>感谢大家支持，网站正在持续建设中，如果您遇到问题或Bug，欢迎联系我们或 <a href="https://github.com/ChrisHyperFunc/readzn/issues" target="_blank" rel="noopener noreferrer" className={styles.siteInfoHighlight} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>Github Issues<svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg></a></p>
            <p>我们欢迎大家投稿 <a href="https://github.com/ChrisHyperFunc/readzn/issues" target="_blank" rel="noopener noreferrer" className={styles.siteInfoHighlight} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>Github Issues</a>，提交任何您认为对读者有帮助的资源。为确保质量，内容会在审核通过后收录到平台。</p>
          </div>
        </div>

        <div className={styles.contactInfo}>
          <h2>联系我们</h2>
          <p>如有任何疑问，请通过以下方式联系我们：</p>
          <a href={`mailto:${BLOG.email}`} className={styles.emailLink}>{BLOG.email}</a>
          <p class="responseNote">我们承诺在48小时内回复您的消息。</p>
        </div>
      </div>

      {/* 收藏提示框 */}
      <BookmarkPrompt />

      {/* MIT开源协议和Notion后台管理信息 */}
      <SiteInfo />
    </Layout>
  );
}
