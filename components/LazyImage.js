import { useState, useEffect } from 'react';
import Image from 'next/image';
import DefaultCover from './DefaultCover';

/**
 * 懒加载图片组件
 * 只有当组件进入视口时才加载真实图片，初始状态显示默认封面
 * @param {Object} props
 * @param {string} props.src - 图片源URL
 * @param {string} props.alt - 图片替代文本
 * @param {string} props.title - 用于生成默认封面的标题
 * @param {string} props.layout - Next.js Image布局模式
 * @param {string} props.objectFit - 图片适应方式
 * @param {Object} props.rest - 其他传递给Image组件的属性
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
        <Image
          src={src}
          alt={alt || title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
          priority={false}
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
