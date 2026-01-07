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
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const usersData = [
      ['Sarah Chen', 'sarah@devblog.com', hashedPassword, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', 'Full-stack developer passionate about React and TypeScript. Building the future, one component at a time.'],
      ['Alex Kumar', 'alex@devblog.com', hashedPassword, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', 'Tech enthusiast and open source contributor. Love exploring new web technologies.'],
      ['Elena Rodriguez', 'elena@devblog.com', hashedPassword, 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', 'UX Designer turned Frontend Developer. Obsessed with pixel-perfect interfaces.'],
      ['David Kim', 'david@devblog.com', hashedPassword, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', 'Backend specialist scaling systems. Coffee lover.']
    ];

    const userIds = [];

    for (const user of usersData) {
      // Check if exist
      const [exists] = await pool.query('SELECT id FROM users WHERE email = ?', [user[1]]); // user[1] is email
      let userId;
      
      if (exists.length > 0) {
        userId = exists[0].id;
        console.log(`User ${user[0]} already exists (ID: ${userId})`); // user[0] is name
      } else {
        const [res] = await pool.query(
          'INSERT INTO users (name, email, password, profile_picture, bio) VALUES (?, ?, ?, ?, ?)',
          user
        );
        userId = res.insertId;
        console.log(`Created user: ${user[0]} (ID: ${userId})`);
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
    // 5. Create Comments
    console.log('--- Seeding Comments ---');
    // Clear existing comments first to ensure clean state
    await pool.query('DELETE FROM comments');
    
    // Get the first post ID
    const [firstPost] = await pool.query('SELECT id FROM posts ORDER BY id ASC LIMIT 1');

    if (firstPost.length > 0) {
        const postId = firstPost[0].id;
        
        // Additional users for comments (matching the design somewhat)
        const commentUsers = [
            { name: 'Elena Rodriguez', email: 'elena@example.com', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
            { name: 'David Kim', email: 'david@example.com', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
        ];

        const commentUserIds = [];
        for (const user of commentUsers) {
             const [exists] = await pool.query('SELECT id FROM users WHERE email = ?', [user.email]);
             if (exists.length > 0) {
                 commentUserIds.push(exists[0].id);
             } else {
                 const [res] = await pool.query('INSERT INTO users (name, email, password, profile_picture) VALUES (?, ?, ?, ?)', [user.name, user.email, hashedPassword, user.avatar]);
                 commentUserIds.push(res.insertId);
                 console.log(`Created comment user: ${user.name}`);
             }
        }
        
        // Combine all user IDs for variety
        // userIds[0] = Sarah (Author), userIds[1] = Marcus

        // 1. Top level comment by Marcus (userIds[1])
        const [c1] = await pool.query('INSERT INTO comments (content, post_id, user_id, created_at) VALUES (?, ?, ?, DATE_SUB(NOW(), INTERVAL 2 HOUR))', 
            ['Great article! The TypeScript patterns you mentioned are exactly what we implemented in our team. Really helped with onboarding new developers.', postId, userIds[1]]);
        console.log('Created top-level comment 1');

        // 2. Reply to c1 by Elena
        await pool.query('INSERT INTO comments (content, post_id, user_id, parent_id, created_at) VALUES (?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL 1 HOUR))',
            ['I\'ve been struggling with state management in large apps. The React Query suggestion is gold!', postId, commentUserIds[0], c1.insertId]);
        console.log('Created reply to comment 1');
        
        // 3. Threaded reply by Sarah (Author) to Elena
        await pool.query('INSERT INTO comments (content, post_id, user_id, parent_id, created_at) VALUES (?, ?, ?, ?, NOW())',
            ['Thanks! React Query has been a game-changer for us. Let me know if you want a deep-dive article on that topic.', postId, userIds[0], c1.insertId]); 
        console.log('Created reply from author');

        // 4. Another independent comment
        await pool.query('INSERT INTO comments (content, post_id, user_id) VALUES (?, ?, ?)',
            ['This is fantastic content. Looking forward to the next one!', postId, commentUserIds[1]]);
        
        console.log(`Seeded comments for Post ID ${postId}`);
    }
    process.exit(0);


  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
