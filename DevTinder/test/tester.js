const axios = require("axios");

const users = [
  {
    firstName: "Rakesh",
    lastName: "Mishra",
    emailId: "rakesh1@gmail.com",
    password: "Pass@123",
    age: 28,
    gender: "male",
    skills: ["java", "springboot", "mysql"],
    about: "Backend developer interested in scalable APIs."
  },
  {
    firstName: "Lavanya",
    lastName: "Reddy",
    emailId: "lavanya1@gmail.com",
    password: "Pass@123",
    age: 25,
    gender: "female",
    skills: ["react", "typescript", "redux"],
    about: "Frontend engineer building modern web applications."
  }
];

async function seedUsers() {
    for (const user of users) {
        try {
            const response = await axios.post(
                "http://localhost:3000/signup",
                user
            );

            console.log(`✅ Created ${user.firstName}`);
        } catch (err) {
            console.log(
                `❌ Failed ${user.emailId}:`,
                err.response?.data || err.message
            );
        }
    }
}

seedUsers();