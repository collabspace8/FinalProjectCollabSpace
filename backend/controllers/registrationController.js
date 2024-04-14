//const bcrypt = require("bcrypt");
const { client } = require("../connect");

// Registration
exports.createUser = async (req, res) => {
  try {
    // Extract user data from request body
    const { fullname, phone, email, role, username, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      fullname,
      phone,
      email,
      role,
      username,
      password,
    };

    const db = client.db("CollabSpacedb");
    const collection = db.collection("Register");
    const result = await collection.insertOne(newUser);

    res
      .status(201)
      .json({ message: "User created successfully", data: result.ops[0] });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to register user", error: error.message });
  }
};

// Login
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  console.log("Attempting login with:", username, password);

  try {
    // Define db and collection again for this function's scope
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Register");

    const user = await collection.findOne({ username });
    console.log("User found in database:", user);

    if (!user) {
      console.log("No user found for username:", username);
      return res.status(401).json({ message: "Invalid username or password." });
    }

    if (password === user.password) {
      console.log("Passwords match, login successful.");
      const { password, ...userWithoutPassword } = user;
      return res
        .status(200)
        .json({ message: "Login successful", user: userWithoutPassword });
    } else {
      console.log("Passwords do not match.");
      return res.status(401).json({ message: "Invalid username or password." });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
