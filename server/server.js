import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

/* CONFIGURATION */
dotenv.config();
const jwtSecretKey = process.env.TOKEN_SECRET; 
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "/Assets");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Initialize Database and Admin User
async function initializeApp() {
  const adminEmail = process.env.USER_NAME;
  const adminPassword = process.env.USER_PASSWORD;

  try {
    // Create a connection just for creating the database
    const initialDbConnection = await mysql.createConnection({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
    });

    await initialDbConnection.query(
      `CREATE DATABASE IF NOT EXISTS financialmanagement`
    );
    console.log("Database created or already exists.");
    await initialDbConnection.end();

    // Create a new connection or pool to the specific database for table creation and operations
    const db = await mysql.createPool({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Create tables if they don't exist
    await Promise.all([
      db.query(`CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      );`),
      db.query(`CREATE TABLE IF NOT EXISTS sales (
        id INT AUTO_INCREMENT PRIMARY KEY,
        transaction_name VARCHAR(255) NOT NULL,
        sales_name VARCHAR(255) NOT NULL, 
        amount DECIMAL(10, 2) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        transaction_date DATE NOT NULL,
        total_sales DECIMAL(10, 2) NOT NULL 
      )`),
      db.query(`CREATE TABLE IF NOT EXISTS expenses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        transaction_name VARCHAR(255) NOT NULL,
        expense_name VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        transaction_date DATE NOT NULL,
        total_expenses DECIMAL(10, 2) NOT NULL
      )`),
      db.query(`CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        phoneNumber VARCHAR(20) NOT NULL
      )`),
      db.query(`CREATE TABLE IF NOT EXISTS items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        amount INT NOT NULL,
        price INT NOT NULL,
        image VARCHAR(255) NOT NULL
      )`),
    ]);
    console.log("Tables created or already exist.");

    // Check if the admin user exists and create one if not
    const [users] = await db.query("SELECT * FROM users");
    if (users.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [
        adminEmail,
        hashedPassword,
      ]);
      console.log("Admin user created.");
    } else {
      console.log("Admin user already exists or the database is not empty.");
    }
  } catch (error) {
    console.error("Error setting up the database and admin user:", error);
  }
}

initializeApp();

const db = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

app.post("/auth", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    const [users] = await db.query("SELECT * FROM users WHERE username = ?", [username]);

    if (users.length === 0) {
      // No user found with the provided username
      return res.status(404).json({ message: "User not found" });
    }

    // User exists, verify password
    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      // Passwords match, generate and return the JWT token
      const token = jwt.sign({ username: user.username }, jwtSecretKey, { expiresIn: '1h' });
      res.json({ message: "success", token });
    } else {
      // Passwords do not match
      res.status(401).json({ message: "Invalid password" });
    }
  } catch (error) {
    console.error("Error in /auth endpoint:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT endpoint to update user credentials
app.put("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const { username, newPassword } = req.body;  // Make sure these match the names sent by the client

  if (!username && !newPassword) {
    return res.status(400).json({ message: "At least one of username or password must be provided." });
  }

  try {
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    let updateFields = [];
    const updateParams = [];

    if (username) {
      updateFields.push("username = ?");
      updateParams.push(username);
    }
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateFields.push("password = ?");
      updateParams.push(hashedPassword);
    }

    let updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    updateParams.push(userId);

    const [result] = await db.query(updateQuery, updateParams);
    if (result.affectedRows === 0) {
      return res.status(500).json({ message: "User update failed" });
    }

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



// The verify endpoint that checks if a given JWT token is valid
app.post("/verify", (req, res) => {
  const tokenHeaderKey = "jwt-token";
  const authToken = req.headers[tokenHeaderKey];
  try {
    const verified = jwt.verify(authToken, jwtSecretKey);
    if (verified) {
      return res.status(200).json({ status: "logged in", message: "success" });
    } else {
      // Access Denied
      return res.status(401).json({ status: "invalid auth", message: "error" });
    }
  } catch (error) {
    // Access Denied
    return res.status(401).json({ status: "invalid auth", message: "error" });
  }
});

app.put("/employees/:id", async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, position, phoneNumber } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE employees SET firstName=?, lastName=?, position=?, phoneNumber=? WHERE id=?",
      [firstName, lastName, position, phoneNumber, id]
    );

    if (result.affectedRows > 0) {
      const updatedEmployee = {
        id: parseInt(id, 10),
        firstName,
        lastName,
        position,
        phoneNumber,
      };
      res.json(updatedEmployee);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});




app.get("/sales", async (req, res) => {
  try {
    const [data] = await db.query("SELECT * FROM sales");
    // Convert numeric string fields to numbers
    const convertedData = data.map((sale) => ({
      ...sale,
      amount: parseFloat(sale.amount),
      price: parseFloat(sale.price),
      total_sales: parseFloat(sale.total_sales),
    }));
    res.json(convertedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/expenses", async (req, res) => {
  try {
    const [data] = await db.query("SELECT * FROM expenses");
    // Convert numeric fields from strings to numbers
    const convertedData = data.map((expense) => ({
      ...expense,
      amount: parseFloat(expense.amount),
      price: parseFloat(expense.price),
      total_expenses: parseFloat(expense.total_expenses),
    }));
    res.json(convertedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/employees", async (req, res) => {
  try {
    const [data] = await db.query("SELECT * FROM employees");
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/sales", async (req, res) => {
  const {
    transaction_name,
    sales_name,
    amount,
    price,
    transaction_date,
    total_sales,
  } = req.body;

  // Validation to ensure no null or NaN values are processed
  if (!transaction_name || !sales_name || isNaN(amount) || isNaN(price) || !transaction_date || isNaN(total_sales)) {
    return res.status(400).json({ message: "Invalid input data, please ensure all fields are correctly formatted." });
  }

  try {
    const result = await db.query(
      "INSERT INTO sales (transaction_name, sales_name, amount, price, transaction_date, total_sales) VALUES (?, ?, ?, ?, ?, ?)",
      [
        transaction_name,
        sales_name,
        amount,
        price,
        transaction_date,
        total_sales
      ]
    );
    res.json({
      message: "Sale added successfully",
      saleId: result[0].insertId,
    });
  } catch (err) {
    console.error("Error when inserting into sales:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.get("/daily-sales", async (req, res) => {
  const { year, month } = req.query;

  try {
    const [results] = await db.query(
      `SELECT id, transaction_name, sales_name, amount, price, transaction_date, 
      CAST(total_sales AS DECIMAL(10, 2)) AS total_sales 
      FROM sales WHERE YEAR(transaction_date) = ? AND MONTH(transaction_date) = ?`,
      [year, month]
    );

    const formattedResults = results.map(sale => ({
      ...sale,
      amount: Number(sale.amount),
      price: Number(sale.price),
      total_sales: Number(sale.total_sales)
    }));

    res.json(formattedResults);
  } catch (err) {
    console.error("Failed to fetch sales:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



app.post("/expenses", async (req, res) => {
  const {
    transaction_name,
    expense_name,
    amount,
    price,
    transaction_date,
    total_expenses,
  } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO expenses (transaction_name, expense_name, amount, price, transaction_date, total_expenses) VALUES (?,?,?,?,?,?)",
      [
        transaction_name,
        expense_name,
        parseFloat(amount),
        parseFloat(price),
        transaction_date,
        parseFloat(total_expenses),
      ]
    );
    const newExpenses = {
      id: result.insertId,
      transaction_name,
      expense_name,
      amount,
      price,
      transaction_date,
      total_expenses,
    };
    res.json(newExpenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/daily-expenses", async (req, res) => {
  const { year, month } = req.query;

  try {
    const [results] = await db.query(
      `SELECT id, transaction_name, expense_name, amount, price, transaction_date, 
      CAST(total_expenses AS DECIMAL(10, 2)) AS total_expenses 
      FROM expenses WHERE YEAR(transaction_date) = ? AND MONTH(transaction_date) = ?`,
      [year, month]
    );

    // Convert numeric data in the server before sending response
    const formattedResults = results.map(expense => ({
      ...expense,
      amount: Number(expense.amount),
      price: Number(expense.price),
      total_expenses: Number(expense.total_expenses)
    }));

    res.json(formattedResults);
  } catch (err) {
    console.error("Failed to fetch expenses:", err);
    res.status(500).json({ message: "Internal Server Error" });
  } 
});



app.post("/employees", async (req, res) => {
  const { firstName, lastName, position, phoneNumber } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO employees (firstName, lastName, position, phoneNumber) VALUES (?, ?, ?, ?)",
      [firstName, lastName, position, phoneNumber]
    );
    const newEmployee = {
      id: result.insertId,
      firstName,
      lastName,
      position,
      phoneNumber,
    };
    res.json(newEmployee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/employees/:id", async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, position, phoneNumber } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE employees SET firstName=?, lastName=?, position=?, phoneNumber=? WHERE id=?",
      [firstName, lastName, position, phoneNumber, id]
    );

    if (result.affectedRows > 0) {
      const updatedEmployee = {
        id: parseInt(id, 10),
        firstName,
        lastName,
        position,
        phoneNumber,
      };
      res.json(updatedEmployee);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/employees/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM employees WHERE id=?", [id]);

    if (result.affectedRows > 0) {
      res.json({ message: "Employee Deleted" });
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/items", upload.single("image"), async (req, res) => {
  const { name, amount, price, min_capacity, max_capacity } = req.body;
  const image = req.file ? req.file.filename : "";

  try {
    const [result] = await db.query(
      "INSERT INTO items (name, amount, price, image) VALUES (?, ?, ?, ?)",
      [name, amount, parseFloat(price), image]
    );
    res
      .status(201)
      .json({ message: "Item added successfully", itemId: result.insertId });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/items", async (req, res) => {
  try {
    const [data] = await db.query("SELECT * FROM items");
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/items/:id", async (req, res) => {
  const itemId = req.params.id;
  const { amount, price } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE items SET amount = ?, price = ? WHERE id = ?",
      [amount, parseFloat(price), itemId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item updated successfully" });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



app.delete("/items/:id", async (req, res) => {
  const { id } = req.params; // Extract the ID from the request parameters
  try {
    // Execute the DELETE statement with the provided ID
    const [result] = await db.query("DELETE FROM items WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      // If no rows are affected, the item doesn't exist
      return res.status(404).json({ message: "Item not found" });
    }
    // If the delete operation was successful, send a success response
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/items/:id/decrement", async (req, res) => {
  const itemId = req.params.id;
  const { amountToDecrement } = req.body; // Get the amount to decrement from the request body

  if (!amountToDecrement || amountToDecrement < 0) {
    return res.status(400).json({ message: "Invalid decrement amount" });
  }

  try {
    // First, update the item's amount with the specified decrement
    await db.query(
      "UPDATE items SET amount = GREATEST(0, amount - ?) WHERE id = ?",
      [amountToDecrement, itemId]
    );

    // Then, select the updated item to return it
    const [updatedItem] = await db.query("SELECT * FROM items WHERE id = ?", [
      itemId,
    ]);

    if (updatedItem.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ success: true, data: updatedItem[0] });
  } catch (error) {
    console.error("Error decrementing item amount:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/items/:id/increment", async (req, res) => {
  const itemId = req.params.id;
  try {
    // Assuming db is your database connection object
    await db.query("UPDATE items SET amount = amount + 1 WHERE id = ?", [
      itemId,
    ]);
    res.json({
      success: true,
      message: "Item amount incremented successfully.",
    });
  } catch (error) {
    console.error("Error incrementing item amount:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});


app.use("/assets", express.static(path.join(__dirname, "Assets")));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
