import { useState, useEffect } from 'react';
import DefaultCover from './DefaultCover';

/**
 * 懒加载图片组件
 * 只有当组件进入视口时才加载真实图片，初始状态显示默认封面
 * 直接使用img标签而不是Next.js的Image组件，避免服务器代理加载图片
 * 优化：移除crossOrigin属性，避免不必要的CORS预检请求，提高图片加载性能
 * 图片直接从CDN加载，而不是通过服务器代理，减少服务器负担
 * @param {Object} props
 * @param {string} props.src - 图片源URL
 * @param {string} props.alt - 图片替代文本
 * @param {string} props.title - 用于生成默认封面的标题
 * @param {string} props.objectFit - 图片适应方式
 * @param {Object} props.rest - 其他传递给img标签的属性
 */
const LazyImage = ({ src, alt, title, layout, objectFit, ...rest }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  // 直接使用title作为唯一ID的基础，因为title不会重复
  const uniqueId = `lazy-image-${title?.replace(/\s+/g, '-') || 'image'}`;

  useEffect(() => {
    // 如果浏览器不支持IntersectionObserver，直接加载图片
    if (!('IntersectionObserver' in window)) {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // 当组件进入视口时
        if (entries[0].isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // 提前200px开始加载
        threshold: 0.1,      // 当10%的元素可见时
      }
    );

    // 获取当前组件的DOM元素
    const element = document.getElementById(uniqueId);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, [uniqueId]);

  // 唯一ID已在组件初始化时生成

  // 处理图片加载完成事件
  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  // 处理图片加载错误事件
  const handleImageError = () => {
    setHasError(true);
  };

  return (
    <div id={uniqueId} style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* 当组件进入视口且图片未加载成功时显示默认封面 */}
      {(!isIntersecting || !isLoaded) && !hasError && (
        <DefaultCover title={title || alt} />
      )}

      {/* 当组件进入视口时加载真实图片 */}
      {isIntersecting && (
        <img
          src={src}
          alt={alt || title}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            objectFit: objectFit || 'cover',
            display: 'block',
            width: '100%',
            height: '100%',
            position: 'absolute'
          }}
          loading="lazy"
          {...rest}
        />
      )}

      {/* 如果图片加载失败，显示默认封面 */}
      {hasError && (
        <DefaultCover title={title || alt} />
      )}
    </div>
  );
};

export default LazyImage;
