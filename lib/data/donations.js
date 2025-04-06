/**
 * 捐赠记录数据
 */

export const donations = [
  {
    id: 1,
    name: 'HanZ',
    amount: 20,
    message: '加油！体验很好',
    date: '2025-04-05T15:20:00Z'
  },
  {
    id: 2,
    name: 'Lin.',
    amount: 2,
    message: '感觉非常不错，正是我所需要的',
    date: '2025-04-06T08:20:00Z'
  },
];

/**
 * 获取最新捐赠记录
 * @param {number} limit - 限制返回的记录数量
 * @param {number} page - 页码，从1开始
 * @returns {Object} - 包含按日期排序的最新捐赠记录和总记录数
 */
export function getLatestDonations(limit = 10, page = 1) {
  const sortedDonations = [...donations].sort((a, b) => new Date(b.date) - new Date(a.date));
  const startIndex = (page - 1) * limit;
  const paginatedDonations = sortedDonations.slice(startIndex, startIndex + limit);

  return {
    donations: paginatedDonations,
    total: sortedDonations.length,
    hasMore: startIndex + limit < sortedDonations.length
  };
}

/**
 * 按捐赠者名称分组并累计金额
 * @param {Array} donationList - 捐赠记录列表
 * @returns {Array} - 按名称分组并累计金额后的捐赠记录
 */
function aggregateDonationsByName(donationList) {
  // 使用Map按名称分组并累计金额
  const donationMap = new Map();

  donationList.forEach(donation => {
    const name = donation.name;

    if (donationMap.has(name)) {
      // 如果已存在该捐赠者，累加金额
      const existingDonation = donationMap.get(name);
      existingDonation.amount += donation.amount;

      // 保留最新的一条留言和日期
      if (new Date(donation.date) > new Date(existingDonation.date)) {
        existingDonation.message = donation.message;
        existingDonation.date = donation.date;
      }
    } else {
      // 如果不存在，创建新记录
      donationMap.set(name, { ...donation });
    }
  });

  // 将Map转换回数组
  return Array.from(donationMap.values());
}

/**
 * 获取本月捐赠排行榜
 * @param {number} limit - 限制返回的记录数量
 * @param {number} page - 页码，从1开始
 * @returns {Object} - 包含本月捐赠金额排行和总记录数
 */
export function getMonthlyDonations(limit = 10, page = 1) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // 先筛选出本月的捐赠记录
  const monthlyDonations = [...donations].filter(donation => {
    const donationDate = new Date(donation.date);
    return donationDate.getMonth() === currentMonth &&
           donationDate.getFullYear() === currentYear;
  });

  // 按名称分组并累计金额
  const sortedDonations = aggregateDonationsByName(monthlyDonations)
    .sort((a, b) => b.amount - a.amount);

  const startIndex = (page - 1) * limit;
  const paginatedDonations = sortedDonations.slice(startIndex, startIndex + limit);

  return {
    donations: paginatedDonations,
    total: sortedDonations.length,
    hasMore: startIndex + limit < sortedDonations.length
  };
}

/**
 * 获取本年捐赠排行榜
 * @param {number} limit - 限制返回的记录数量
 * @param {number} page - 页码，从1开始
 * @returns {Object} - 包含本年捐赠金额排行和总记录数
 */
export function getYearlyDonations(limit = 10, page = 1) {
  const now = new Date();
  const currentYear = now.getFullYear();

  // 先筛选出本年的捐赠记录
  const yearlyDonations = [...donations].filter(donation => {
    const donationDate = new Date(donation.date);
    return donationDate.getFullYear() === currentYear;
  });

  // 按名称分组并累计金额
  const sortedDonations = aggregateDonationsByName(yearlyDonations)
    .sort((a, b) => b.amount - a.amount);

  const startIndex = (page - 1) * limit;
  const paginatedDonations = sortedDonations.slice(startIndex, startIndex + limit);

  return {
    donations: paginatedDonations,
    total: sortedDonations.length,
    hasMore: startIndex + limit < sortedDonations.length
  };
}
