var promise = require('bluebird');

var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/progressionusers';
var db = pgp(connectionString);

function getAllUsers(req, res, next) {
  db.any('select * from progressionusers')
    .then(function(data) {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Retrieved All Users'
      });
    }).catch(function(err) {
      return next(err)
  });
}

function signIn(req, res, next) {
  db.one('select * from progressionusers where email=${email} and password=${password}', req.body)
  .then(function (data) {
  res.status(200)
    .json({
      status: 'success',
      data: data,
      message: 'Retrieved ONE User'
    });
  })
  .catch(function (err) {
    return next(err);
  });
}

function createUser(req, res, next) {
  req.body.email = req.body.email.toLowerCase();
  db.one('insert into progressionusers(name, password, email)' + 'values(${name}, ${password}, ${email}) returning id', req.body).then(function(data) {
    res.status(200).json({ status: 'success', message: "New user created", id: data.id});
  }).catch(function(err) {
    res.status(500).json({error: err.detail});
  })
}


//////////////////////////////
/////////////////////////////


function addAscent(req, res, next) {
  db.one('insert into ascents(user_id, name, location, grade, caption)' +
  'values(${user_id}, ${name}, ${location}, ${grade}, ${caption}) returning id', req.body)
  .then(function(data) {
    res.status(200).json({ status: 'success', message: "Ascent was added to database", id: data.id});
  }).catch(function(err) {
    next(err);
  })
}

function getAllAscents(req, res, next) {
  var user_id = parseInt(req.params.id);
  db.any('select * from ascents where user_id=$1', user_id)
  .then(function(data) {
    res.status(200).json({
      status: 'success',
      data: data,
      message: 'Retrieved All ascents'
    });
  })
  .catch(function(err) {
    return next(err);
  });
}

function deleteAscent(req, res, next) {
  var id = parseInt(req.params.ascent_id);
  var user_id = parseInt(req.params.id);
  db.result('delete from ascents where id = $1 and user_id = $2', [id, user_id]).then(function(result) {
    res.status(200)
    .json({status: 'success', message: `${result.rowCount} row was deleted.`})
  })
  .catch(function(err) {
    return next(err);
  })
}


//////////////////////////////
/////////////////////////////


function addProject(req, res, next) {
  db.one('insert into projects(user_id, name, location, grade, priority, season, moves_total, moves_done, high_point, caption)' +
  'values(${user_id}, ${name}, ${location}, ${grade}, ${priority}, ${season}, ${moves_total}, ${moves_done}, ${high_point}, ${caption}) returning id', req.body)
  .then(function(data) {
    res.status(200).json({ status: 'success', message: "Project was added to database", id: data.id});
  }).catch(function(err) {
    next(err);
  })
}

function getAllProjects(req, res, next) {
  var user_id = parseInt(req.params.id);
  db.any('select * from projects where user_id=$1', user_id)
  .then(function(data) {
    res.status(200).json({
      status: 'success',
      data: data,
      message: 'Retrieved All projects'
    });
  })
  .catch(function(err) {
    return next(err);
  });
}

function deleteProject(req, res, next) {
  var id = parseInt(req.params.project_id);
  var user_id = parseInt(req.params.id);
  db.result('delete from projects where id = $1 and user_id = $2', [id, user_id]).then(function(result) {
    res.status(200)
    .json({status: 'success', message: `${result.rowCount} row was deleted.`})
  })
  .catch(function(err) {
    return next(err);
  })
}


//////////////////////////////
/////////////////////////////


function addWorkout(req, res, next) {
  db.one('insert into workouts(user_id, workout_date, type, description)' +
  'values(${user_id}, ${workout_date}, ${type}, ${description}) returning id', req.body)
  .then(function(data) {
    res.status(200).json({ status: 'success', message: "Workout was added to database", id: data.id});
  }).catch(function(err) {
    next(err);
  })
}

function getAllWorkouts(req, res, next) {
  var user_id = parseInt(req.params.id);
  db.any('select * from workouts where user_id=$1', user_id)
  .then(function(data) {
    res.status(200).json({
      status: 'success',
      data: data,
      message: 'Retrieved All workouts'
    });
  })
  .catch(function(err) {
    return next(err);
  });
}

function deleteWorkout(req, res, next) {
  var id = parseInt(req.params.workout_id);
  var user_id = parseInt(req.params.id);
  db.result('delete from workouts where id = $1 and user_id = $2', [id, user_id]).then(function(result) {
    res.status(200)
    .json({status: 'success', message: `${result.rowCount} row was deleted.`})
  })
  .catch(function(err) {
    return next(err);
  })
}


///////////////////////////
///////////////////////////


function addMilestone(req, res, next) {
  db.one('insert into milestones(user_id, project_id, milestone_date, caption)' +
  'values(${user_id}, ${project_id}, ${milestone_date}, ${caption}) returning id', req.body)
  .then(function(data) {
    res.status(200).json({ status: 'success', message: "Milestone was added to database", id: data.id});
  }).catch(function(err) {
    next(err);
  })
}

function getAllMilestones(req, res, next) {
  var user_id = parseInt(req.params.id);
  var project_id = parseInt(req.params.project_id)
  db.any('select * from milestones where user_id=$1 and project_id=$2', [user_id, project_id])
  .then(function(data) {
    res.status(200).json({
      status: 'success',
      data: data,
      message: 'Retrieved All milestones'
    });
  })
  .catch(function(err) {
    return next(err);
  });
}

function deleteMilestone(req, res, next) {
  var id = parseInt(req.params.milestone_id);
  var user_id = parseInt(req.params.id);
  var project_id = parseInt(req.params.project_id);
  db.result('delete from milestones where id = $1 and user_id = $2 and project_id = $3', [id, user_id, project_id]).then(function(result) {
    res.status(200)
    .json({status: 'success', message: `${result.rowCount} row was deleted.`})
  })
  .catch(function(err) {
    return next(err);
  });
}



module.exports = {
  getAllUsers: getAllUsers,
  signIn: signIn,
  createUser: createUser,
  getAllAscents: getAllAscents,
  addAscent: addAscent,
  deleteAscent: deleteAscent,
  addProject: addProject,
  getAllProjects: getAllProjects,
  deleteProject: deleteProject,
  addWorkout: addWorkout,
  getAllWorkouts: getAllWorkouts,
  deleteWorkout: deleteWorkout,
  addMilestone: addMilestone,
  getAllMilestones: getAllMilestones,
  deleteMilestone: deleteMilestone
};
