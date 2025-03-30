import { useState } from 'react';
import styles from '@/styles/CopyButton.module.css';

export default function CopyButton({ text, tooltipText }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <div className={styles.copyButtonContainer}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        className={styles.copyButton}
        onClick={handleCopy}
        aria-label="复制链接"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </button>
      {showTooltip && (
        <div className={styles.tooltip}>
          <span className={styles.tooltipText}>{tooltipText || text}</span>
          <span className={styles.tooltipStatus}>{copied ? '已复制!' : '点击复制'}</span>
        </div>
      )}
    </div>
  );
}