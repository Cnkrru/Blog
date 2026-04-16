var e=`---
title: 代码高亮测试
date: 2026-04-03
category: 测试
tags: [测试, 代码高亮]
description: 本文用于测试代码高亮功能，支持 JavaScript、Python、CSS、HTML、SQL、Java 等多种编程语言的语法高亮显示。
keywords: 代码高亮, 语法高亮, JavaScript, Python, CSS, HTML, SQL, Java, 测试
---

# 代码高亮测试

本文用于测试代码高亮功能，支持多种编程语言的语法高亮。

## JavaScript

\`\`\`javascript
async function fetchData(url) {
  try {
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('获取数据失败:', error)
    throw error
  }
}

// 使用Promise.all处理多个请求
const [users, posts] = await Promise.all([
  fetch('/api/users'),
  fetch('/api/posts')
])

console.log('用户数:', users.length)
console.log('文章数:', posts.length)
\`\`\`

## Python

\`\`\`python

class BlogPost:
    def __init__(self, title, content, author):
        self.title = title
        self.content = content
        self.author = author
        self.created_at = datetime.now()

    def get_excerpt(self, length=100):
        """获取文章摘要"""
        if len(self.content) <= length:
            return self.content
        return self.content[:length] + '...'

    def __str__(self):
        return f"{self.title} by {self.author}"

# 创建实例
post = BlogPost(
    title="Python测试",
    content="这是一篇关于Python的测试文章...",
    author="博客作者"
)
print(post.get_excerpt())
\`\`\`

## CSS

\`\`\`css
/* 响应式卡片组件 */
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.card-content {
  color: #666;
  line-height: 1.6;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .card {
    padding: 15px;
  }

  .card-title {
    font-size: 1.1rem;
  }
}
\`\`\`

## HTML

\`\`\`html
<!-- 文章卡片组件 -->
<article class="article-card">
  <header class="card-header">
    <h2 class="card-title">{{ article.title }}</h2>
    <div class="card-meta">
      <time datetime="{{ article.date }}">{{ article.formattedDate }}</time>
      <span class="card-category">{{ article.category }}</span>
    </div>
  </header>

  <div class="card-body">
    <p class="card-excerpt">{{ article.excerpt }}</p>
  </div>

  <footer class="card-footer">
    <div class="card-tags">
      <span v-for="tag in article.tags" :key="tag" class="tag">
        {{ tag }}
      </span>
    </div>
    <a :href="article.url" class="read-more">阅读更多 →</a>
  </footer>
</article>
\`\`\`

## SQL

\`\`\`sql
-- 博客数据库查询示例
SELECT
    p.id,
    p.title,
    p.created_at,
    u.username as author,
    COUNT(c.id) as comment_count,
    GROUP_CONCAT(t.name) as tags
FROM posts p
INNER JOIN users u ON p.user_id = u.id
LEFT JOIN comments c ON p.id = c.post_id
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
WHERE p.status = 'published'
    AND p.created_at >= '2026-01-01'
GROUP BY p.id, p.title, p.created_at, u.username
ORDER BY p.created_at DESC
LIMIT 10;
\`\`\`

## Java

\`\`\`java
// Java博客服务类
@Service
public class BlogService {

    private final PostRepository postRepository;
    private final UserService userService;

    public BlogService(PostRepository postRepository, UserService userService) {
        this.postRepository = postRepository;
        this.userService = userService;
    }

    public Page<Post> getPublishedPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return postRepository.findByStatus("published", pageable);
    }

    public Optional<Post> getPostBySlug(String slug) {
        return postRepository.findBySlug(slug);
    }
}
\`\`\`

---

代码高亮功能测试完成！所有主流编程语言的语法都能正确高亮显示。`;export{e as default};