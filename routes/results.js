const express = require("express");
const router = express.Router();

const db = require("../models");

router.get("/", async (req, res) => {
  const user = req.session.user;
  if (!user) res.redirect("/");
  else if (user.role === "teacher") {
    const { count, rows } = await db.Result.findAndCountAll();
    res.render("results/list", { numResults: count, results: rows });
  } else {
    res.render("results/search");
  }
});

router.get("/add", async (req, res) => {
  const user = req.session.user;

  if (!user || user.role !== "teacher") res.redirect("/");
  else res.render("results/add");
});

router.post("/add", async (req, res) => {

  const user = req.session.user;

  if (!user || user.role !== "teacher") res.redirect("/");

  const { body } = req;

  if (!body.rollno || !body.name || !body.dob || !body.score) {
    res.status(400);
    res.render("results/add", { error: "Details not provided." });
  } else {

    const score = parseFloat(body.score);

    if (isNaN(score)) {
      res.status(400);
      res.render("results/add", { error: "Invalid score provided." });
    }
    else {

      const [_, created] = await db.Result.findOrCreate({
        where: { rollno: body.rollno },
        defaults: {
          score,
          dob: body.dob,
          name: body.name,
        }
      });

      if (!created) {
        res.status(400);
        res.render("results/add", { error: `Result for #${body.rollno} exists.` });
      } else {
        res.status(201);
        res.redirect("/results");
      }
    }

  }
});

router.get("/edit/:rollno", async (req, res) => {

  const user = req.session.user;

  if (!user || user.role !== "teacher") res.redirect("/");

  const rollno = parseInt(req.params.rollno) || 0;
  const result = await db.Result.findByPk(rollno);

  if (result === null) {
    res.status(404);
    res.render("404");
  } else {
    res.render("results/add", { ...result.toJSON() });
  }

});

router.post("/edit/:rollno", async (req, res) => {

  const user = req.session.user;

  if (!user || user.role !== "teacher") res.redirect("/");

  const rollno = parseInt(req.params.rollno) || 0;
  const result = await db.Result.findOne({ rollno: rollno });

  if (result === null) {
    res.status(404);
    res.render("404");
  } else {
    res.render("results/add", { ...result.toJSON() });
  }

});

module.exports = router;
