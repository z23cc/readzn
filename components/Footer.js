import styles from '@/styles/Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>&copy; 2025 阅读指南. All rights reserved.</p>
      <ul>
        <li><Link href="/privacy">Privacy Policy</Link></li>
        <li><Link href="/contact">Contact</Link></li>
      </ul>
    </footer>
  );
}
