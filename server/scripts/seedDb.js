const pool = require('../config/db');
const bcrypt = require('bcrypt');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seed with clean, realistic data...');

    // 1. Clean up existing data (Child tables first)
    console.log('Cleaning up old data...');
    await pool.query('DELETE FROM comments');
    await pool.query('DELETE FROM posts');
    await pool.query('DELETE FROM users');
    
    // Reset Auto Increment (Optional, specific to MySQL)
    // await pool.query('ALTER TABLE users AUTO_INCREMENT = 1');
    // await pool.query('ALTER TABLE posts AUTO_INCREMENT = 1');
    // await pool.query('ALTER TABLE comments AUTO_INCREMENT = 1');


    // 2. Create Users (Authors)
    console.log('Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Realistic user profiles from Unsplash for avatars
    const usersData = [
      {
        name: 'Sarah Chen', 
        email: 'sarah@devblog.com', 
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', 
        bio: 'Senior Frontend Engineer. Passionate about React, UI/UX, and accessibility.'
      },
      {
        name: 'Alex Kumar', 
        email: 'alex@devblog.com', 
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', 
        bio: 'Full Stack Developer & Open Source contributor. Writing about Node.js and Cloud Architecture.'
      },
      {
        name: 'Elena Rodriguez', 
        email: 'elena@devblog.com', 
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', 
        bio: 'Product Designer who codes. Sharing insights on design systems and creative coding.'
      }
    ];

    const userIds = [];

    for (const user of usersData) {
        const [res] = await pool.query(
          'INSERT INTO users (name, email, password, profile_picture, bio) VALUES (?, ?, ?, ?, ?)',
          [user.name, user.email, hashedPassword, user.avatar, user.bio]
        );
        userIds.push(res.insertId);
        console.log(`Created user: ${user.name}`);
    }

    // 3. Create Posts (Realistic Content)
    console.log('Creating posts...');
    
    const postsData = [
      {
        title: "The Future of React: Server Components Explained",
        excerpt: "Understanding how React Server Components are changing the way we build modern web applications and improve performance.",
        tags: ["React", "Frontend", "Performance"],
        authorIdx: 0, // Sarah
        content: `React Server Components (RSC) represent a major shift in how we think about building React applications...`
      },
      {
        title: "Microservices vs Monolith: A Practical Guide",
        excerpt: "When should you actually break up your monolith? A pragmatic look at architecture decisions for growing teams.",
        tags: ["Architecture", "Backend", "DevOps"],
        authorIdx: 1, // Alex
        content: "The debate between microservices and monolithic architectures continues to be a hot topic..."
      },
      {
        title: "Designing for Accessibility in 2026",
        excerpt: "Why accessibility isn't just a compliance checklist but a core part of great user experience design.",
        tags: ["Design", "Accessibility", "UX"],
        authorIdx: 2, // Elena
        content: "Web accessibility (a11y) is often treated as an afterthought, but it should be fundamental..."
      },
      {
        title: "Why I Switched from VS Code to Zed",
        excerpt: "A deep dive into the new generation of high-performance code editors and why speed matters for developer productivity.",
        tags: ["Productivity", "Tools", "Opinion"],
        authorIdx: 1, // Alex
        content: "I have been a loyal VS Code user for years, but recently I decided to try Zed..."
      },
      {
        title: "Mastering CSS Grid Layouts",
        excerpt: "Stop struggling with layout. Learn the power of CSS Grid and how to build complex responsive designs with ease.",
        tags: ["CSS", "Design", "Tutorial"],
        authorIdx: 2, // Elena
        content: "CSS Grid has revolutionized web layout, allowing for two-dimensional positioning..."
      },
      {
        title: "Node.js Performance Optimization Tips",
        excerpt: "Practical techniques to speed up your Node.js backend, from loop optimization to proper caching strategies.",
        tags: ["Node.js", "Backend", "Performance"],
        authorIdx: 1, // Alex
        content: "Performance is critical for backend services. In this article, we explore several ways to optimize..."
      },
      {
        title: "The State of JavaScript in 2026",
        excerpt: "A look at the latest ECMAScript features and the evolving ecosystem of tools and frameworks.",
        tags: ["JavaScript", "Web Development"],
        authorIdx: 0, // Sarah
        content: "JavaScript continues to evolve at a rapid pace..."
      },
      {
        title: "Building Design Systems that Scale",
        excerpt: "How to create a consistent design language across multiple products and teams without losing your mind.",
        tags: ["Design System", "UI", "Process"],
        authorIdx: 2, // Elena
        content: "A design system is more than just a component library..."
      },
      {
        title: "Introduction to Rust for Web Developers",
        excerpt: "Why Rust is becoming a popular choice for web tooling and how you can get started with it today.",
        tags: ["Rust", "WebAssembly", "Learning"],
        authorIdx: 1, // Alex
        content: "Rust has been voted the most loved programming language for several years in a row..."
      },
      {
        title: "Handling State in Complex React Apps",
        excerpt: "Comparing Redux, Zustand, Recoil, and Context API. Which one should you choose for your next project?",
        tags: ["React", "State Management"],
        authorIdx: 0, // Sarah
        content: "State management remains one of the most challenging aspects of frontend development..."
      },
      {
        title: "Deploying with Docker and Kubernetes",
        excerpt: "A beginner-friendly guide to containerization and orchestration for modern web deployments.",
        tags: ["DevOps", "Docker", "Kubernetes"],
        authorIdx: 1, // Alex
        content: "Containers have changed how we deploy software..."
      },
      {
        title: "The Psychology of Color in UI Design",
        excerpt: "How color choices affect user perception, emotion, and conversion rates in digital products.",
        tags: ["Design", "Psychology", "UI"],
        authorIdx: 2, // Elena
        content: "Color is one of the most powerful tools in a designer's arsenal..."
      },
      {
        title: "GraphQL vs REST: Making the Right Choice",
        excerpt: "Analyzing the pros and cons of GraphQL and REST APIs for different types of applications.",
        tags: ["API", "Backend", "GraphQL"],
        authorIdx: 0, // Sarah
        content: "The choice between GraphQL and REST often depends on specific project requirements..."
      },
      {
        title: "10 Tips for Better Code Reviews",
        excerpt: "How to give and receive constructive feedback to improve code quality and team culture.",
        tags: ["Culture", "Productivity", "Engineering"],
        authorIdx: 0, // Sarah
        content: "Code reviews are a vital part of the software engineering process..."
      }
    ];

    const createdPostIds = [];

    for (const post of postsData) {
        const [res] = await pool.query(
          'INSERT INTO posts (title, excerpt, content, tags, author_id, created_at) VALUES (?, ?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL ? DAY))',
          [
            post.title, 
            post.excerpt, 
            post.content, 
            JSON.stringify(post.tags), 
            userIds[post.authorIdx],
            Math.floor(Math.random() * 30) // Random date within last 30 days
          ]
        );
        createdPostIds.push(res.insertId);
        console.log(`Created post: ${post.title}`);
    }

    // 4. Create Comments
    console.log('Creating comments...');
    
    // Add some interaction to the first few posts
    if (createdPostIds.length > 0) {
        // Comment on first post
        await pool.query(
            'INSERT INTO comments (content, post_id, user_id, created_at) VALUES (?, ?, ?, DATE_SUB(NOW(), INTERVAL 2 HOUR))',
            ['This is exactly what I needed to read today. Thanks for sharing!', createdPostIds[0], userIds[1]]
        );
        
        // Comment on second post
        const [c] = await pool.query(
            'INSERT INTO comments (content, post_id, user_id, created_at) VALUES (?, ?, ?, DATE_SUB(NOW(), INTERVAL 5 HOUR))',
            ['Great insights on the architecture trade-offs.', createdPostIds[1], userIds[2]]
        );
        
        // Reply
        await pool.query(
            'INSERT INTO comments (content, post_id, user_id, parent_id, created_at) VALUES (?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL 4 HOUR))',
            ['Glad you found it helpful!', createdPostIds[1], userIds[1], c.insertId]
        );
    }

    console.log('✅ Database seeded successfully!');
    if (require.main === module) process.exit(0);
    return { success: true, message: 'Database seeded successfully' };

  } catch (err) {
    console.error('❌ Seeding failed:', err);
    if (require.main === module) process.exit(1);
    throw err;
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
