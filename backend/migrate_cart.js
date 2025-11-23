require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const Cart = require("./models/cart");
const Book = require("./models/books");

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/book-store";

const SAMPLE_BOOKS = [
  {
    title: "Sách demo 1",
    author: "Tác giả A",
    price: 120000,
    desc: "Cuốn sách demo dùng để seed dữ liệu cart.",
    language: "vi",
    url: "https://picsum.photos/seed/book1/300/400",
  },
  {
    title: "Sách demo 2",
    author: "Tác giả B",
    price: 150000,
    desc: "Cuốn sách demo thứ hai.",
    language: "vi",
    url: "https://picsum.photos/seed/book2/300/400",
  },
  {
    title: "Sample Book 3",
    author: "Author C",
    price: 98000,
    desc: "English sample book for testing carts.",
    language: "en",
    url: "https://picsum.photos/seed/book3/300/400",
  },
];

async function ensureSampleUsers(minCount = 3) {
  const current = await User.countDocuments();
  if (current >= minCount) return 0;

  const toCreate = minCount - current;
  const createdUsers = [];
  for (let i = 0; i < toCreate; i++) {
    const suffix = `${Date.now()}_${i}`;
    const user = new User({
      username: `demo_user_${suffix}`,
      email: `demo_user_${suffix}@example.com`,
      password: await bcrypt.hash("password123", 10),
      address: "123 Demo Street",
    });
    createdUsers.push(await user.save());
  }
  console.log(`Seeded ${createdUsers.length} demo users.`);
  return createdUsers.length;
}

async function ensureSampleBooks(minCount = 5) {
  const current = await Book.countDocuments();
  if (current >= minCount) return 0;

  const toCreate = minCount - current;
  const created = [];
  for (let i = 0; i < toCreate; i++) {
    const sample = SAMPLE_BOOKS[i % SAMPLE_BOOKS.length];
    const suffix = `${Date.now()}_${i}`;
    created.push(
      await Book.create({
        ...sample,
        title: `${sample.title} #${suffix}`,
        url: sample.url.replace(/seed\/[^/]+/, `seed/book${suffix}`),
      })
    );
  }
  console.log(`Seeded ${created.length} demo books.`);
  return created.length;
}

function getRandomElements(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

async function seedSampleData() {
  await ensureSampleUsers();
  await ensureSampleBooks();

  const users = await User.find().select("_id").limit(5);
  const books = await Book.find().select("_id").limit(10);

  let added = 0;
  for (const user of users) {
    const selectedBooks = getRandomElements(books, 3);
    for (const book of selectedBooks) {
      await Cart.updateOne(
        { user: user._id, book: book._id },
        { $setOnInsert: { quantity: 1 } },
        { upsert: true }
      );
      added += 1;
    }
  }

  return added;
}

async function migrate(seedIfEmpty = false) {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  const users = await User.find({ cart: { $exists: true, $not: { $size: 0 } } }).select("cart");

  let inserted = 0;
  for (const user of users) {
    const userId = user._id;
    const cartItems = (user.cart || []).map((id) => id?.toString()).filter(Boolean);

    for (const bookId of cartItems) {
      const bookExists = await Book.exists({ _id: bookId });
      if (!bookExists) {
        console.warn(`Skip non-existing book ${bookId} for user ${userId}`);
        continue;
      }

      try {
        await Cart.updateOne(
          { user: userId, book: bookId },
          { $setOnInsert: { quantity: 1 } },
          { upsert: true }
        );
        inserted += 1;
      } catch (err) {
        console.error(`Failed to migrate cart item ${bookId} for user ${userId}:`, err.message);
      }
    }

    await User.updateOne({ _id: userId }, { $unset: { cart: "" } });
  }

  if (inserted === 0 && seedIfEmpty) {
    const seeded = await seedSampleData();
    console.log(`No existing carts found. Seeded ${seeded} cart items.`);
  } else {
    console.log(`Migration complete. Inserted/updated cart items: ${inserted}`);
  }
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
}

migrate(process.argv.includes("--seed"))
  .catch((err) => {
    console.error("Migration failed:", err);
    mongoose.disconnect();
  });
