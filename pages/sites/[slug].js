import { clientConfig } from '@/lib/server/config'

import { useRouter } from 'next/router'
import cn from 'classnames'
import { getAllPosts, getPostBlocks } from '@/lib/notion'
import { useLocale } from '@/lib/locale'
import { useConfig } from '@/lib/config'
import { createHash } from 'crypto'
import Layout from '@/components/Layout'
import SitesPost from '@/components/SitesPost'
import Comments from '@/components/Comments'
import styles from '@/styles/Container.module.css';
import { NextSeo } from 'next-seo'

export default function BlogPost({ post, blockMap, emailHash }) {
  const router = useRouter()
  const BLOG = useConfig()
  const locale = useLocale()

  // TODO: It would be better to render something
  if (router.isFallback) return null

  const fullWidth = post.fullWidth ?? false

  return (
    <Layout>
      <NextSeo
        title={post.title}
        description={post.summary}
        canonical={`${BLOG.link}/${post.slug}`}
        openGraph={{
          title: post.title,
          description: post.summary,
          url: `${BLOG.link}/${post.slug}`,
          type: 'article',
          images: [
            {
              url: `${BLOG.ogImageGenerateURL}/${encodeURIComponent(
                post.title
              )}.png?theme=dark&md=1&fontSize=125px&images=https%3A%2F%2Fhub.z23.cc%2Ffavicon.png`,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ],
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />
      <div className={styles.baseContainer}>
        <SitesPost
          post={post}
          blockMap={blockMap}
          emailHash={emailHash}
          fullWidth={fullWidth}
        />
        {/* Back and Top */}
        <div
          className={cn(
            'px-4 flex justify-between font-medium text-gray-500 dark:text-gray-400 my-5',
            fullWidth ? 'md:px-24' : 'mx-auto max-w-2xl'
          )}
        >
          <a>
            <button
              onClick={() => router.push(BLOG.path || '/')}
              className="mt-2 cursor-pointer hover:text-black dark:hover:text-gray-100"
            >
              ← {locale.POST.BACK}
            </button>
          </a>
          <a>
            <button
              onClick={() => window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })}
              className="mt-2 cursor-pointer hover:text-black dark:hover:text-gray-100"
            >
              ↑ {locale.POST.TOP}
            </button>
          </a>
        </div>

        <Comments frontMatter={post} />
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  const posts = await getAllPosts({ includePages: true })
  return {
    paths: posts.map(row => ({ params: { slug: row.slug } })),
    fallback: false
  }
}

export async function getStaticProps({ params: { slug } }) {
  const posts = await getAllPosts({ includePages: true })
  const post = posts.find(t => t.slug === slug)

  if (!post) return { notFound: true }

  const blockMap = await getPostBlocks(post.id)
  const emailHash = createHash('md5')
    .update(clientConfig.email)
    .digest('hex')
    .trim()
    .toLowerCase()

  return {
    props: { post, blockMap, emailHash }
  }
}
