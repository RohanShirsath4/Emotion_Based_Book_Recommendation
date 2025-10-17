const express =require( "express");
const  dotenv = require( "dotenv");
const  cors =require( "cors");
const  connectDB =require ("./config/db.js");
const bookRoutes =require( "./routes/fetRoute.js");
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();
app.use("/api/books", bookRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
