import PropTypes from 'prop-types'
import cn from 'classnames'
import useTheme from '@/lib/theme'
import useLinkTest from '@/lib/hooks/useLinkTest'
import styles from '@/styles/LinkStatus.module.css'

/**
 * 链接状态指示器组件
 * 
 * @param {object} props - 组件属性
 * @param {string} props.url - 要测试的链接URL
 * @param {number} [props.timeout=5000] - 超时时间（毫秒）
 * @param {string} [props.className] - 额外的CSS类名
 */
export default function LinkStatus({ url, timeout = 5000, className }) {
  const { dark } = useTheme()
  const { linkStatus, linkSpeed, speedLevel } = useLinkTest(url, timeout)

  return (
    <div className={cn(styles.linkStatusContainer, {
      [styles.linkStatusTesting]: linkStatus === 'testing',
      [styles.linkStatusOnline]: linkStatus === 'online',
      [styles.linkStatusOffline]: linkStatus === 'offline'
    }, className, { 'dark': dark })}>
      <div className={styles.linkStatusIndicator}></div>
      <div className={styles.linkStatusInfo}>
        <span className={styles.linkStatusText}>
          {linkStatus === 'testing' && '正在测试链接...'}
          {linkStatus === 'online' && '连接正常'}
          {linkStatus === 'offline' && '连接不通'}
        </span>
        {linkStatus === 'online' && linkSpeed && (
          <span className={styles.linkSpeedText}>{speedLevel} ({linkSpeed}ms)</span>
        )}
        {linkStatus === 'offline' && (
          <span className={styles.linkSpeedText}>请更换科学网络尝试</span>
        )}
      </div>
    </div>
  )
}

LinkStatus.propTypes = {
  url: PropTypes.string.isRequired,
  timeout: PropTypes.number,
  className: PropTypes.string
}