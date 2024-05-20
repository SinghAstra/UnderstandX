const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to the database successfully."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.json({ message: "Employee API is running" });
});

// app.use('/api/auth', authRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
