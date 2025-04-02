import React from 'react';
import styles from '@/styles/DefaultCover.module.css';

/**
 * 生成苹果风格的默认封面组件
 * @param {Object} props
 * @param {string} props.title - 网站标题
 * @param {string} props.className - 额外的CSS类名
 */
const DefaultCover = ({ title, className }) => {
  // 从标题生成随机但一致的颜色
  const generateColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // 生成柔和的苹果风格颜色
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 85%)`; // 使用高亮度、中等饱和度的颜色
  };

  // 获取标题的首字母或前两个字符作为图标
  const getInitials = (title) => {
    if (!title) return '?';

    // 如果是中文，取前两个字符
    if (/[\u4e00-\u9fa5]/.test(title)) {
      return title.substring(0, 2);
    }

    // 如果是英文，取首字母缩写（最多两个字母）
    const words = title.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }

    return title.substring(0, 2).toUpperCase();
  };

  const backgroundColor = generateColor(title);
  const initials = getInitials(title);

  return (
    <div
      className={`${styles.defaultCover} ${className || ''}`}
      style={{ backgroundColor }}
    >
      <div className={styles.initialsContainer}>
        <span className={styles.initials}>{initials}</span>
      </div>
      <div className={styles.titleContainer}>
        <span className={styles.title}>{title}</span>
      </div>
    </div>
  );
};

export default DefaultCover;
