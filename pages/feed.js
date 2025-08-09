import Layout from '@/components/Layout'
import { getAllPosts } from '@/lib/notion'

export async function getStaticProps() {
  const posts = await getAllPosts({ includePages: false })
  const latestPosts = posts.slice(0, 10)

  return {
    props: {
      posts: latestPosts
    }
  }
}

const Feed = ({ posts }) => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">RSS Feed</h1>
        <p className="text-gray-600 mb-8">
          RSS feed functionality is available in the full deployment.
          Here are the latest posts:
        </p>

        <div className="space-y-4">
          {posts.map((post, index) => (
            <div key={index} className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-2">
                <a href={`/sites/${post.slug}`} className="hover:text-blue-600">
                  {post.title}
                </a>
              </h2>
              <p className="text-gray-600 text-sm mb-2">
                {new Date(post.date).toLocaleDateString()}
              </p>
              <p className="text-gray-700">{post.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Feed
