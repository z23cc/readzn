import { useState, useEffect } from 'react'

/**
 * 自定义Hook，用于测试链接的可用性和速度
 * 
 * @param {string} url - 要测试的链接URL
 * @param {number} timeout - 超时时间（毫秒），默认5000ms
 * @returns {object} - 返回链接测试状态和结果
 */
export default function useLinkTest(url, timeout = 5000) {
  // 链接状态相关状态
  const [linkStatus, setLinkStatus] = useState('testing') // 'testing', 'online', 'offline'
  const [linkSpeed, setLinkSpeed] = useState(null) // 毫秒
  const [isTestingLink, setIsTestingLink] = useState(true)

  // 测试链接可用性和速度
  useEffect(() => {
    if (!url || url === '#') {
      setLinkStatus('offline')
      setIsTestingLink(false)
      return
    }

    const testLink = async () => {
      const startTime = Date.now()
      let isCompleted = false

      // 设置超时
      const timeoutId = setTimeout(() => {
        if (!isCompleted) {
          isCompleted = true
          setLinkStatus('offline')
          setIsTestingLink(false)
        }
      }, timeout) // 超时时间

      try {
        // 使用fetch API发送HEAD请求检测链接状态
        const response = await fetch(url, {
          method: 'HEAD',
          mode: 'no-cors' // 避免跨域问题
        })

        if (!isCompleted) {
          isCompleted = true
          clearTimeout(timeoutId)

          const endTime = Date.now()
          const duration = endTime - startTime

          setLinkSpeed(duration)
          setLinkStatus('online')
          setIsTestingLink(false)
        }
      } catch (error) {
        if (!isCompleted) {
          isCompleted = true
          clearTimeout(timeoutId)

          setLinkStatus('offline')
          setIsTestingLink(false)
        }
      }
    }

    testLink()

    // 清理函数
    return () => {
      setIsTestingLink(false)
    }
  }, [url, timeout])

  return {
    linkStatus,
    linkSpeed,
    isTestingLink,
    // 链接速度评估
    speedLevel: linkSpeed ? 
      (linkSpeed < 1000 ? '速度极快' : 
       linkSpeed < 2000 ? '速度良好' : 
       '速度一般') : 
      null
  }
}