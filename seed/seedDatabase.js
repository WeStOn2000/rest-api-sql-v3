const fs = require('fs');
const path = require('path');
const db = require('../models');
const dataPath = path.join(__dirname, 'data.json');

const seedDatabase = async () => {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Seed users
    const users = await db.User.bulkCreate(data.users);

    // Seed courses 
    const courses = data.courses.map(course => ({
      ...course,
      userId: users.find(user => user.id === course.userId).id
    }));
    await db.Course.bulkCreate(courses);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding the database:', error);
  }
};

seedDatabase();
