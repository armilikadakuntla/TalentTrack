require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const { initDb } = require("./db/init");
const { attachUser } = require("./middleware/auth");

const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const internshipRoutes = require("./routes/internships");
const certificationRoutes = require("./routes/certifications");
const trendsRoutes = require("./routes/trends");
const hackathonRoutes = require("./routes/hackathons");
const resourceRoutes = require("./routes/resources");
const guidanceRoutes = require("./routes/guidance");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(attachUser);

// Makes `user` available in every EJS template automatically (for the nav bar).
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.get("/", (req, res) => {
  res.render("index");
});

app.use(authRoutes);
app.use(dashboardRoutes);
app.use(internshipRoutes);
app.use(certificationRoutes);
app.use(trendsRoutes);
app.use(hackathonRoutes);
app.use(resourceRoutes);
app.use(guidanceRoutes);

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`OpportunityOS is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize the database:", err.message);
    console.error("Check DATABASE_URL in your .env file — the app can't start without a working database.");
    process.exit(1);
  });
