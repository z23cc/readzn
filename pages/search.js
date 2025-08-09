import { getAllPosts, getAllTagsFromPosts } from '@/lib/notion'
import SearchLayout from '@/layouts/search'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Search({ tags, posts }) {
  const router = useRouter()
  const { q } = router.query
  const [searchQuery, setSearchQuery] = useState('')

  // 当URL参数变化时更新搜索查询
  useEffect(() => {
    if (q) {
      setSearchQuery(q)
    }
  }, [q])

  return <SearchLayout tags={tags} posts={posts} initialSearchValue={searchQuery} />
}

export async function getStaticProps() {
  const posts = await getAllPosts({ includePages: false })
  const tags = getAllTagsFromPosts(posts)
  return {
    props: {
      tags,
      posts
    }
  }
}
