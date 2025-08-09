import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Header.module.css';

export default function Header({navBarTitle, fullWidth}) {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <Image src="/logo.png" alt="hub.z23.cc Logo" width={40} height={40}/>
        </Link>
        <div className={styles.titleContainer}>
          <h1>{navBarTitle || "阅读指南"}</h1>
          <span className={styles.domain}>hub.z23.cc</span>
          <span className={styles.slogan}>爱读书，会读书，读好书</span>
        </div>

      </div>
      <nav className={styles.nav}>
        <ul>
          <li><Link title="Home" href="/">首页</Link></li>
          {/* <li><Link title="Featured Books" href="/featured-books">好书推荐</Link></li> */}
          {/* <li><Link title="Online Epub Reader" href="/online-reader">在线ePub</Link></li> */}
          <li><Link title="Online Epub Reader" href="https://reader.readzn.com/" target='_blank'>在线ePub</Link></li>
          {/* <li><Link title="Browse our latest articles" href="/articles">Kindle专栏</Link></li> */}
          {/* <li><Link title="Explore Tao Books" href="/tao-books">阅读器测评</Link></li> */}
          {/* <li><Link title="Online Books Converter" href="/book-converter">在线格式转换</Link></li> */}
          <li><Link title="Donate Support" href="/donate-support" target='_blank'>捐赠</Link></li>
          <li><Link title="Contact Us" href="/contact">关于我们</Link></li>
          <li>
            <a
              href="https://github.com/z23cc/readzn"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.githubLink}
            >
              <svg height="24" width="24" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
