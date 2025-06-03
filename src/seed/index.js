// // seed/index.js
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import { faker } from "@faker-js/faker";
// import Client from "../models/ClientModel.js";
// import User from "../models/UserModel.js";
// import Subscribe from "../models/SubscribeModel.js";

// dotenv.config();

// // Connect to DB
// mongoose
//   .connect(
//     "mongodb+srv://alaaadelnn120:mojeb-ai-123@mojeb-ai.ozdpw26.mongodb.net/?retryWrites=true&w=majority&appName=mojeb-ai"
//   )
//   .then(() => console.log("DB Connected"))
//   .catch((err) => console.log("DB Error:", err));

// const createFakeClients = async (count = 50) => {
//   try {
//     await Client.deleteMany();
//     await User.deleteMany();
//     await Subscribe.deleteMany();

//     for (let i = 0; i < count; i++) {
//       const name = faker.company.name();
//       const email = faker.internet.email();
//       const password = faker.internet.password();

//       const user = await User.create({
//         fullName: name,
//         email,
//         password,
//         role: "client",
//       });

//       const client = await Client.create({
//         clientId: user._id,
//         name,
//         address: faker.location.streetAddress(),
//         phone: faker.phone.number(),
//         email,
//         website: faker.internet.url(),
//         description: faker.company.catchPhrase(),
//         size: faker.number.int({ min: 10, max: 1000 }),
//         industry: faker.company.buzzPhrase(),
//         commercialRegister: faker.string.alphanumeric(10),
//         taxId: faker.string.numeric(10),
//         planId: null,
//       });
//     }

//     console.log(`✅ Successfully seeded ${count} clients`);
//     process.exit();
//   } catch (error) {
//     console.error("❌ Seeding failed:", error);
//     process.exit(1);
//   }
// };

// createFakeClients();
