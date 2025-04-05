import { useState, useEffect } from 'react';
import { getLatestDonations, getMonthlyDonations, getYearlyDonations } from '@/lib/data/donations';
import styles from '@/styles/DonationRanking.module.css';

const DonationRanking = () => {
  const [activeTab, setActiveTab] = useState('latest');
  const [donations, setDonations] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 10;

  // 根据当前选中的标签获取相应的捐赠数据
  const getDonationsByTab = (currentPage = 1, isLoadMore = false) => {
    setLoading(true);
    let result;

    switch(activeTab) {
      case 'latest':
        result = getLatestDonations(limit, currentPage);
        break;
      case 'monthly':
        result = getMonthlyDonations(limit, currentPage);
        break;
      case 'yearly':
        result = getYearlyDonations(limit, currentPage);
        break;
      default:
        result = getLatestDonations(limit, currentPage);
    }

    if (isLoadMore) {
      setDonations(prev => [...prev, ...result.donations]);
    } else {
      setDonations(result.donations);
    }
    setHasMore(result.hasMore);
    setLoading(false);
  };

  // 加载更多数据
  const loadMore = () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    getDonationsByTab(nextPage, true);
  };

  // 切换标签时重置分页状态
  useEffect(() => {
    setPage(1);
    getDonationsByTab(1, false);
  }, [activeTab]);

  // 格式化日期显示
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className={styles.donationRankingContainer}>
      <h2 className={styles.rankingTitle}>捐赠排行榜</h2>

      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${activeTab === 'latest' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('latest')}
        >
          最新捐赠
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'monthly' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('monthly')}
        >
          本月榜单
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'yearly' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('yearly')}
        >
          年度榜单
        </button>
      </div>

      <div className={styles.rankingList}>
        {donations.length > 0 ? (
          <>
            <table className={styles.rankingTable}>
              <thead>
                <tr>
                  <th>排名</th>
                  <th>捐赠者</th>
                  <th>金额 (元)</th>
                  <th>留言</th>
                  <th>日期</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation, index) => (
                  <tr key={donation.id}>
                    <td className={styles.rankCell}>
                      <span className={`${styles.rankBadge} ${index < 3 ? styles[`top${index + 1}`] : ''}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td>{donation.name}</td>
                    <td className={styles.amountCell}>{donation.amount}</td>
                    <td className={styles.messageCell}>{donation.message}</td>
                    <td>{formatDate(donation.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.loadMoreContainer}>
              {hasMore ? (
                <button
                  className={styles.loadMoreButton}
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? '加载中...' : '加载更多'}
                </button>
              ) : (
                <p className={styles.noMoreData}>已显示全部数据</p>
              )}
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <p>暂无捐赠记录</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationRanking;
