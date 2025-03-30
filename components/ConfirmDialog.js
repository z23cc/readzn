import { useState, useEffect } from 'react';
import styles from '@/styles/ConfirmDialog.module.css';

export default function ConfirmDialog({ isOpen, title, message, confirmText, cancelText, onConfirm, onCancel }) {
  const [isVisible, setIsVisible] = useState(false);

  // 处理动画效果
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // 动画持续时间
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 如果弹窗未打开，不渲染任何内容
  if (!isVisible && !isOpen) return null;

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.visible : styles.hidden}`} onClick={onCancel}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {message && <p className={styles.message}>{message}</p>}
        </div>
        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onCancel}>
            {cancelText || '取消'}
          </button>
          <button className={styles.confirmButton} onClick={onConfirm}>
            {confirmText || '确认'}
          </button>
        </div>
      </div>
    </div>
  );
}