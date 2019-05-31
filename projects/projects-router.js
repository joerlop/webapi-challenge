const router = require("express").Router();

const db = require("../data/helpers/projectModel");

const actionsDb = require("../data/helpers/actionModel")

router.get("/", (req, res) => {
  db.get()
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The projects information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;

  db.get(id)
    .then(project => {
      if (project) res.status(200).json(project);
      else
        res
          .status(404)
          .json({ message: "The project with the specified ID does not exist." });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The project information could not be retrieved." });
    });
});

router.get("/:id/actions", (req, res) => {
  const id = req.params.id;

  db.get(id)
  .then(project => {
    if (project) {
      db.getProjectActions(id)
      .then(actions => {
        res.status(200).json(actions);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: "The project information could not be retrieved." });
      });
    } 
    else
      res
        .status(404)
        .json({ message: "The project with the specified ID does not exist." });
  })
  .catch(err => {
    res
      .status(500)
      .json({ error: "The project information could not be retrieved." });
  });
});

router.post("/", (req, res) => {
  const project = req.body;

  if (!project.name || !project.description) {
    res.status(400).json({
      errorMessage: "Please provide name and description for the project."
    });
  } else {
    db.insert(project)
      .then(project => {
        res.status(201).json(project);
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while saving the project to the database"
        });
      });
  }
});

router.post("/:id/actions", (req, res) => {
  const id = req.params.id;
  const action = req.body;

  if (!action.description || !action.notes || !action.project_id) {
    res.status(400).json({
      errorMessage: "Please provide description, notes and project id for the action."
    });
  } else {
    actionsDb.insert(action)
      .then(action => {
        res.status(201).json(action);
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while saving the action to the database"
        });
      });
  }
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const updatedProject = req.body;

  if (!updatedProject.name || !updatedProject.description) {
    res.status(400).json({
      errorMessage: "Please provide name and description for the project."
    });
  } else {
    db.update(id, updatedProject)
      .then(updatedProject => {
        if (updatedProject) {
          res.status(200).json(updatedProject);
        } else
          res.status(404).json({
            message: "The project with the specified ID does not exist."
          });
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while updating the project in the database"
        });
      });
  }
});

router.put("/:id/actions/:actionId", (req, res) => {
  const id = req.params.actionId;
  const updatedAction = req.body;
  req.body.project_id = req.params.id;

  if (!updatedAction.notes || !updatedAction.description) {
    res.status(400).json({
      errorMessage: "Please provide notes and description for the action."
    });
  } else {
    actionsDb.update(id, updatedAction)
      .then(updatedAction => {
        if (updatedAction) {
          res.status(200).json(updatedAction);
        } else
          res.status(404).json({
            message: "The action with the specified ID does not exist."
          });
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while updating the action in the database"
        });
      });
  }
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const project = req.body;

  db.remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(200).json(deleted);
      } else
        res.status(404).json({
          message: "The project with the specified ID does not exist."
        });
    })
    .catch(err => {
      res.status(500).json({
        error: "There was an error while removing the project from the database"
      });
    });
});

router.delete("/:id/actions/:actionId", (req, res) => {
  const id = req.params.actionId;
  const action = req.body;

  actionsDb.remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(200).json(deleted);
      } else
        res.status(404).json({
          message: "The action with the specified ID does not exist."
        });
    })
    .catch(err => {
      res.status(500).json({
        error: "There was an error while removing the action from the database"
      });
    });
});

module.exports = router;