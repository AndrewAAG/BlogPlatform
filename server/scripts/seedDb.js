const pool = require('../config/db');
const bcrypt = require('bcrypt');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // 1. Clear existing data (optional, be careful in prod)
    // await pool.query('DELETE FROM comments');
    // await pool.query('DELETE FROM posts');
    // await pool.query('DELETE FROM users');

    // 2. Create Users
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    const users = [
      {
        name: 'Sarah Chen',
        email: 'sarah@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        name: 'Marcus Johnson',
        email: 'marcus@example.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      }
    ];

    const userIds = [];

    for (const user of users) {
      // Check if exist
      const [exists] = await pool.query('SELECT id FROM users WHERE email = ?', [user.email]);
      let userId;
      
      if (exists.length > 0) {
        userId = exists[0].id;
        console.log(`User ${user.name} already exists (ID: ${userId})`);
      } else {
        const [res] = await pool.query(
          'INSERT INTO users (name, email, password, profile_picture) VALUES (?, ?, ?, ?)',
          [user.name, user.email, password, user.avatar]
        );
        userId = res.insertId;
        console.log(`Created user: ${user.name} (ID: ${userId})`);
      }
      userIds.push(userId);
    }

    // 3. Create Posts
    const posts = [
      {
        title: 'Building Scalable React Applications with TypeScript',
        excerpt: 'Learn the best practices for structuring large-scale React applications using TypeScript, including proper type definitions, component patterns, and state management strategies.',
        content: 'Full content of the article goes here...',
        tags: JSON.stringify(['Engineering', 'React', 'TypeScript']),
        author_id: userIds[0]
      },
      {
        title: 'The Art of Writing Clean Code',
        excerpt: 'Discover the principles behind writing maintainable, readable code that your future self and teammates will thank you for.',
        content: 'Full content of the article goes here...',
        tags: JSON.stringify(['Engineering', 'Best Practices']),
        author_id: userIds[1]
      },
      {
        title: 'Lessons Learned from My First Year as a Developer',
        excerpt: 'A personal reflection on the challenges, victories, and unexpected lessons from transitioning into a software development career.',
        content: 'Full content of the article goes here...',
        tags: JSON.stringify(['Life', 'Career']),
        author_id: userIds[0]
      }
    ];

    for (const post of posts) {
      // Check if title exists to avoid duplicates during multiple runs
      const [exists] = await pool.query('SELECT id FROM posts WHERE title = ?', [post.title]);
      
      if (exists.length === 0) {
        await pool.query(
          'INSERT INTO posts (title, excerpt, content, tags, author_id) VALUES (?, ?, ?, ?, ?)',
          [post.title, post.excerpt, post.content, post.tags, post.author_id]
        );
        console.log(`Created post: ${post.title}`);
      } else {
        console.log(`Post "${post.title}" already exists`);
      }
    }

    // 4. Generate more dummy posts for pagination
    const categories = ['Engineering', 'Design', 'Product', 'Life', 'Tutorial'];
    const extraPostsCount = 20;

    for (let i = 1; i <= extraPostsCount; i++) {
        const title = `Dummy Post #${i} for Pagination Request`;
        const [exists] = await pool.query('SELECT id FROM posts WHERE title = ?', [title]);

        if (exists.length === 0) {
            await pool.query(
                'INSERT INTO posts (title, excerpt, content, tags, author_id) VALUES (?, ?, ?, ?, ?)',
                [
                    title,
                    `This is a shorter excerpt for dummy post number ${i}. It is used to test the pagination functionality of the home page.`,
                    `Full content for dummy post ${i}...`,
                    JSON.stringify([categories[i % categories.length], 'Testing']),
                    userIds[i % userIds.length] // Alternate authors
                ]
            );
            console.log(`Created extra post: ${title}`);
        }
    }

    console.log('✅ Seeding completed successfully!');
    process.exit(0);


  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
