"use strict";

const express = require("express");
const app = express();
const port = 3000 || process.env.PORT;
app.use(express.json());

// Your code starts here. Placeholders for .get and .post are provided for
//  your convenience.

let candidates = [];

app.post("/candidates", function (req, res) {
  if (!req.body) {
    res.status(404).json({ message: "candidate not defined." });
  }

  let candidate = {
    id: req.body.id,
    id: req.body.name,
    skills: [...req.body.skills],
  };

  candidates.push(candidate);

  res.status(204).send(candidate);
});

app.get("/candidates/search", function (req, res) {
  let bestCandidate = null;

  //No candidates added.
  if (candidates.length <= 0) {
    res.status(404).json({ message: "No candidates added." });
    return;
  }

  //No skills query.
  if (!req.query.skills) {
    res.status(400).json({ message: "Please define skills." });
    return;
  }

  let skillsQuery = req.query.skills.split(",");

  candidates.forEach((candidate) => {
    let matchSkillCnt = 0;

    for (let i = 0; i < skillsQuery.length; i++) {
      if (candidate.skills.includes(skillsQuery[i])) {
        matchSkillCnt++;
      }
    }

    if (matchSkillCnt > 0) {
      if (bestCandidate !== null) {
        if (matchSkillCnt >= bestCandidate.matchSkillCnt) {
          bestCandidate = { ...candidate, matchSkillCnt };
        }
      } else {
        bestCandidate = { ...candidate, matchSkillCnt };
      }
    }
  });

  if (bestCandidate === null) {
    res.status(404).json({ message: "No candidates found." });
  }

  delete bestCandidate["matchSkillCnt"];

  res.status(200).json(bestCandidate);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
