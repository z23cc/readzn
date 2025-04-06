import Script from 'next/script'
import { useConfig } from '@/lib/config'

const Scripts = () => {
  const BLOG = useConfig()

  return (
    <>
      {BLOG.analytics && BLOG.analytics.provider === 'ackee' && (
        <Script
          src={BLOG.analytics.ackeeConfig.tracker}
          data-ackee-server={BLOG.analytics.ackeeConfig.dataAckeeServer}
          data-ackee-domain-id={BLOG.analytics.ackeeConfig.domainId}
        />
      )}
      {BLOG.analytics && BLOG.analytics.provider === 'ga' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${BLOG.analytics.gaConfig.measurementId}`}
          />
          <Script strategy="lazyOnload" id="ga">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${BLOG.analytics.gaConfig.measurementId}', {
                page_path: window.location.pathname,
              });`}
          </Script>
        </>
      )}
      {/* 注入加密配置环境变量到客户端 */}
      <Script strategy="beforeInteractive" id="encryption-config">
        {`window.ENV_API_ENCRYPTION_ENABLED = "${process.env.API_ENCRYPTION_ENABLED || 'false'}";
          window.ENV_API_ENCRYPTION_ALGORITHM = "${process.env.API_ENCRYPTION_ALGORITHM || 'aes-256-cbc'}";
          window.ENV_API_ENCRYPTION_SECRET_KEY = "${process.env.API_ENCRYPTION_SECRET_KEY || 'default-secret-key-please-change-in-env'}";
          window.ENV_API_ENCRYPTION_IV = "${process.env.API_ENCRYPTION_IV || 'default-iv-16byte'}";
        `}
      </Script>
    </>
  )
}

export default Scripts
