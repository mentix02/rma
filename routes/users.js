const bcrypt = require("bcrypt");
const express = require("express");

const db = require("../models");

const router = express.Router();

const postRoleLoginHandler = (role) => {
  let heading = role === "teacher" ? "Teacher" : "Student";
  heading += " Login";

  return async (req, res) => {
    const context = { heading };
    const { body } = req;

    if (!body.email || !body.password) {
      res.status(400);
      context.error = "Details not provided.";
      res.render("users/login", context);
    }

    const user = await db.User.findOne({
      where: { role, email: body.email.toLowerCase() },
    });

    if (user === null || !bcrypt.compareSync(body.password, user.password)) {
      res.status(400);
      context.error = "Invalid credentials.";
      res.render("users/login", context);
    } else {
      req.session.user = user;
      res.redirect("/");
    }
  };
};

const getRoleLoginHandler = (role) => {
  let heading = role === "teacher" ? "Teacher" : "Student";
  heading += " Login";
  return async (req, res) => {
    if (req.session.user) res.redirect("/");
    else res.render("users/login", { heading });
  };
};

router.get("/login/student", getRoleLoginHandler("student"));

router.get("/login/teacher", getRoleLoginHandler("teacher"));

router.post("/login/student", postRoleLoginHandler("student"));

router.post("/login/teacher", postRoleLoginHandler("teacher"));

// Logout

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// Registration

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", async (req, res) => {
  const { body } = req;

  // Check all fields were provided
  if (!body.name || !body.email || !body.password || !body.role) {
    res.status(400);
    res.render("users/register", { error: "Details not provided." });
  } else {
    const user = {
      role: body.role,
      name: body.name,
      password: body.password,
      email: body.email.toLowerCase(),
    };

    // Check whether user exists
    const [_, created] = await db.User.findOrCreate({
      where: { email: user.email },
      defaults: { ...user, password: bcrypt.hashSync(user.password, 10) },
    });

    if (!created) {
      res.status(400);
      res.render("users/register", {
        error: `User with email ${user.email} already exists.`,
      });
    } else {
      res.status(201);

      const role = user.role;
      const action = `/users/login/${role}`;
      const message = `Registered user ${user.name} successfully!`;
      const heading = `${
        role.charAt(0).toUpperCase() + user.role.substr(1)
      } Login`;

      const context = { message, heading, action };
      res.render("users/login", context);
    }
  }
});

module.exports = router;
