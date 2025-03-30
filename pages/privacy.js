import styles from '@/styles/Home.module.css';
import Layout from '@/components/Layout';
import Head from 'next/head';

export default function Privacy() {
  return (
    <Layout>
      <div className={styles.container}>
        <main className={`${styles.main} ${styles.privacy}`}>
          <h1>Privacy Policy</h1>

          <section className={styles.section}>
            <h2>Our Commitment to Privacy</h2>
            <p>At readzn.com, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>
          </section>

          <section className={styles.section}>
            <h2>Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide when you:</p>
            <ul>
              <li>Contact us through our website</li>
              <li>Subscribe to our newsletter</li>
              <li>Create an account</li>
              <li>Make a purchase</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>When you visit our website, we may automatically collect certain information about your device, including:</p>
            <ul>
              <li>IP address</li>
              <li>Browser type</li>
              <li>Operating system</li>
              <li>Pages visited</li>
              <li>Time and date of visits</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>How We Use Your Information</h2>
            <p>We use the collected information for various purposes:</p>
            <ul>
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information to improve our service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Data Protection</h2>
            <p>We implement appropriate technical and organizational measures to maintain the security of your personal information, including but not limited to:</p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication measures</li>
              <li>Regular backups and data recovery procedures</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Your Rights</h2>
            <p>Under GDPR and other applicable data protection laws, you have certain rights regarding your personal data:</p>
            <ul>
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure (&#34;right to be forgotten&#34;)</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Updates to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &#34;Last Updated&#34; date.</p>
            <p>Last Updated: March 12, 2025</p>
          </section>
        </main>
      </div>
    </Layout>
  );
}
