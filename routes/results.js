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

router.get("/detail", async (req, res) => {
  const user = req.session.user;

  if (!user || user.role !== "student") res.redirect("/");

  const { rollno, dob } = req.query;

  if (!rollno || !dob) {
    res.status(400);
    res.redirect("/");
  } else {
    const result = await db.Result.findOne({
      where: { rollno, dob: new Date(dob) },
    });
    if (result === null) {
      res.status(404);
      res.redirect("/404");
    } else {
      res.render("results/detail", { result: result.toJSON() });
    }
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
    const score = Math.abs(parseFloat(body.score));

    if (isNaN(score)) {
      res.status(400);
      res.render("results/add", { error: "Invalid score provided." });
    } else {
      const [_, created] = await db.Result.findOrCreate({
        where: { rollno: body.rollno },
        defaults: {
          score,
          dob: body.dob,
          name: body.name,
        },
      });

      if (!created) {
        res.status(400);
        res.render("results/add", {
          score,
          name: body.name,
          dob: new Date(body.dob),
          error: `Result for #${body.rollno} exists.`,
        });
      } else {
        res.status(201);
        res.redirect("/results");
      }
    }
  }
});

router.get("/delete/:rollno", async (req, res) => {
  const user = req.session.user;

  if (!user || user.role !== "teacher") res.redirect("/");

  const rollno = Math.abs(parseInt(req.params.rollno)) || 0;
  const result = await db.Result.findByPk(rollno);

  if (result === null) {
    res.status(404);
    res.render("404");
  } else {
    await result.destroy();
    res.redirect("/");
  }
});

router.get("/edit/:rollno", async (req, res) => {
  const user = req.session.user;

  if (!user || user.role !== "teacher") res.redirect("/");

  const { body } = req;

  const rollno = Math.abs(parseInt(req.params.rollno)) || 0;
  const result = await db.Result.findByPk(rollno);

  if (result === null) {
    res.status(404);
    res.redirect("/404");
  } else {
    console.log(result.dob);
    res.render("results/add", {
      ...result.toJSON(),
      submitBtnMsg: "Update Result",
    });
  }
});

router.post("/edit/:rollno", async (req, res) => {
  const user = req.session.user;

  if (!user || user.role !== "teacher") res.redirect("/");

  const { body } = req;

  const rollno = Math.abs(parseInt(req.params.rollno)) || 0;
  const result = await db.Result.findOne({ where: { rollno: rollno } });

  if (result === null) {
    res.status(404);
    res.redirect("/404");
  } else {
    result.update({ ...body });
    res.redirect("/");
  }
});

module.exports = router;
