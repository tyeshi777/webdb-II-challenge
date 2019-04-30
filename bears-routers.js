const knex = require("knex");
const router = require("express").Router();

const knexConfig = {
  client: "sqlite3",
  connection: {
    filename: "./data/bear.db3"
  },
  useNullAsDefault: true
};

const db = knex(knexConfig);

router.get("/", (req, res) => {
  db("bears")
    .then(bear => {
      res.status(200).json(bear);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  db("bears")
    .where({ id: req.params.id })
    .first()
    .then(bear => {
      if (bear) {
        res.status(200).json(bear);
      } else {
        res.status(404).json({ message: "no such id exists" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});
router.post("/", (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ msg: "please provide a name" });
  } else {
    db("bears")
      .insert(req.body, "id")
      .then(ids => {
        db("bears")
          .where({ id: ids[0] })
          .first()
          .then(zoo => {
            res.status(200).json(zoo);
          })
          .catch(err => {
            res.status(500).json(err);
          });
      })
      .call(err => {
        res.status(500).json(err);
      });
  }
});

router.put("/:id", (req, res) => {
  db("bears")
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json({
          message: `${count} ${count > 1 ? "records" : "record"} updated`
        });
      } else {
        res.status(404).json({ message: "no such bear exists" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.delete("/:id", (req, res) => {
  db("bears")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(200).json({
          message: `${count} ${count > 1 ? "records" : "record"} deleted`
        });
      } else {
        res
          .status(400)
          .json({ message: "you cannot delete something that don't exists" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});
module.exports = router;
