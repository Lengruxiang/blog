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

export async function getAllPosts() {
  const result = await client.execute('SELECT * FROM posts ORDER BY created_at DESC');
  return result.rows;
}

export async function getPostById(id) {
  const result = await client.execute({ sql: 'SELECT * FROM posts WHERE id = ?', args: [id] });
  return result.rows[0] ?? null;
}

export async function createPost({ title, content, cover_image }) {
  const result = await client.execute({
    sql: 'INSERT INTO posts (title, content, cover_image) VALUES (?, ?, ?)',
    args: [title, content, cover_image || null],
  });
  return getPostById(Number(result.lastInsertRowid));
}

export async function updatePost(id, { title, content, cover_image }) {
  const post = await getPostById(id);
  if (!post) return null;

  await client.execute({
    sql: `UPDATE posts SET title = ?, content = ?, cover_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    args: [
      title ?? post.title,
      content ?? post.content,
      cover_image !== undefined ? cover_image : post.cover_image,
      id,
    ],
  });
  return getPostById(id);
}

export async function deletePost(id) {
  return client.execute({ sql: 'DELETE FROM posts WHERE id = ?', args: [id] });
}

export async function getAllPhotos() {
  const result = await client.execute('SELECT * FROM photos ORDER BY created_at DESC');
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
