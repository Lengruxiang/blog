import { createClient } from '@libsql/client';

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

const client = tursoUrl
  ? createClient({ url: tursoUrl, authToken: tursoToken })
  : createClient({ url: 'file:blog.db' });

await client.executeMultiple(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    cover_image TEXT DEFAULT NULL,
    views INTEGER DEFAULT 0,
    is_sticky INTEGER DEFAULT 0,
    category TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    author TEXT NOT NULL DEFAULT '匿名',
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
  );
`);

// Add columns if they don't exist (migration for existing databases)
try {
  await client.execute('ALTER TABLE posts ADD COLUMN views INTEGER DEFAULT 0');
} catch {}
try {
  await client.execute('ALTER TABLE posts ADD COLUMN is_sticky INTEGER DEFAULT 0');
} catch {}
try {
  await client.execute('ALTER TABLE posts ADD COLUMN category TEXT DEFAULT \'\'');
} catch {}

export async function getAllPosts({ page = 1, limit = 10, category = '' } = {}) {
  const offset = (page - 1) * limit;
  let sql = 'SELECT p.*, (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count FROM posts p';
  const args = [];

  if (category) {
    sql += ' WHERE p.category = ?';
    args.push(category);
  }

  sql += ' ORDER BY p.is_sticky DESC, p.created_at DESC LIMIT ? OFFSET ?';
  args.push(limit, offset);

  const result = await client.execute({ sql, args });
  return result.rows;
}

export async function getTotalPostsCount(category = '') {
  let sql = 'SELECT COUNT(*) as count FROM posts';
  const args = [];
  if (category) {
    sql += ' WHERE category = ?';
    args.push(category);
  }
  const result = await client.execute({ sql, args });
  return Number(result.rows[0].count);
}

export async function getPostById(id) {
  const result = await client.execute({ sql: 'SELECT * FROM posts WHERE id = ?', args: [id] });
  return result.rows[0] ?? null;
}

export async function incrementPostViews(id) {
  await client.execute({ sql: 'UPDATE posts SET views = views + 1 WHERE id = ?', args: [id] });
}

export async function createPost({ title, content, cover_image, category }) {
  const result = await client.execute({
    sql: 'INSERT INTO posts (title, content, cover_image, category) VALUES (?, ?, ?, ?)',
    args: [title, content, cover_image || null, category || ''],
  });
  return getPostById(Number(result.lastInsertRowid));
}

export async function updatePost(id, { title, content, cover_image, category, is_sticky }) {
  const post = await getPostById(id);
  if (!post) return null;

  await client.execute({
    sql: `UPDATE posts SET
      title = ?, content = ?, cover_image = ?, category = ?,
      is_sticky = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
    args: [
      title ?? post.title,
      content ?? post.content,
      cover_image !== undefined ? cover_image : post.cover_image,
      category !== undefined ? category : (post.category || ''),
      is_sticky !== undefined ? (is_sticky ? 1 : 0) : post.is_sticky,
      id,
    ],
  });
  return getPostById(id);
}

export async function deletePost(id) {
  return client.execute({ sql: 'DELETE FROM posts WHERE id = ?', args: [id] });
}

export async function getAllPhotos(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const result = await client.execute({
    sql: 'SELECT * FROM photos ORDER BY created_at DESC LIMIT ? OFFSET ?',
    args: [limit, offset],
  });
  return result.rows;
}

export async function addPhoto(filename, original_name) {
  return client.execute({
    sql: 'INSERT INTO photos (filename, original_name) VALUES (?, ?)',
    args: [filename, original_name],
  });
}

export async function getCommentsByPostId(post_id) {
  const result = await client.execute({
    sql: 'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC',
    args: [post_id],
  });
  return result.rows;
}

export async function createComment({ post_id, author, content }) {
  return client.execute({
    sql: 'INSERT INTO comments (post_id, author, content) VALUES (?, ?, ?)',
    args: [post_id, author || '匿名', content],
  });
}

export default client;
