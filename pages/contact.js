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
            <p>本质创立于2025年，源于对「知识无界，阅读无限」的执着追求，致力于打造一个解决阅读烦恼的一站式平台。我们关注读者的核心需求：</p>
            <ul>
              <li>资源分散：优质电子书和学术文献分布广泛，难以快速获取；</li>
              <li>获取门槛高：专业资料的访问受限，阻碍知识流通；</li>
              <li>选择困难：面对众多阅读平台，缺乏可靠的筛选依据；</li>
              <li>工具费用：高质量的阅读工具被高昂的订阅费用挡在门外。</li>
            </ul>
            <p>为此，我们打造了一个精心策划的「阅读指南」平台，提供以下服务：</p>
            <ul>
              <li>持续追踪并评估全球200+个优质电子书平台；</li>
              <li>严格筛选最稳定可靠的图书和学术资源库；</li>
              <li>定期更新资源链接，确保访问顺畅；</li>
              <li>提供详细的平台测评和使用指南；</li>
              <li>提供完全免费精美且功能强大的各类工具。</li>
            </ul>
            <p>我们的使命是：通过精选全球优质阅读资源和工具，希望为每位用户带来愉悦、高效的阅读体验。</p>
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
