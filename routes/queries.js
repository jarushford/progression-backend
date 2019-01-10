var promise = require('bluebird');

var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')({
    capSQL: true
});
var connectionString = `postgres://fajcohuvcntgkn:06a7f78f64983afd4dc3aeb298b6d6fa8b4cc7d9667b1a6fe0a589ff2f9d8e70@ec2-107-22-162-8.compute-1.amazonaws.com:5432/d2e1dsr4ujs19k/progressionusers`;
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
  db.tx(t => {
    return t.batch([
      t.none('delete from projects where id = $1 and user_id = $2', [id, user_id]),
      t.none('delete from milestones where project_id = $1 and user_id = $2', [id, user_id]),
      t.none('delete from journal where project_id = $1 and user_id = $2', [id, user_id])
    ]);
  })
    .then(function(result) {
    res.status(200)
    .json({status: 'success', message: `${result.rowCount} row was deleted.`})
  })
  .catch(function(err) {
    return next(err);
  })
}

function editProject(req, res, next) {
  var user_id = parseInt(req.params.id)
  var id = parseInt(req.params.project_id)
  db.tx(t => {
    return t.batch([
      t.none('update projects set user_id = $2 where id = $1', [id, user_id]),
      t.none('update projects set name = $2 where id = $1', [id, req.body.name]),
      t.none('update projects set location = $2 where id = $1', [id, req.body.location]),
      t.none('update projects set grade = $2 where id = $1', [id, req.body.grade]),
      t.none('update projects set priority = $2 where id = $1', [id, req.body.priority]),
      t.none('update projects set season = $2 where id = $1', [id, req.body.season]),
      t.none('update projects set moves_total = $2 where id = $1', [id, req.body.moves_total]),
      t.none('update projects set moves_done = $2 where id = $1', [id, req.body.moves_done]),
      t.none('update projects set high_point = $2 where id = $1', [id, req.body.high_point]),
      t.none('update projects set caption = $2 where id = $1', [id, req.body.caption])
    ]);
  })
    .then(function () {
      res.status(200)
        .json({
            'status': 'success',
            'message': 'Updated Project'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


//////////////////////////////
/////////////////////////////


function addWorkout(req, res, next) {
  db.one('insert into workouts(user_id, workout_date, type, description, completed)' +
  'values(${user_id}, ${workout_date}, ${type}, ${description}, ${completed}) returning id', req.body)
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

function editWorkout(req, res, next) {
  var user_id = parseInt(req.params.id)
  var id = parseInt(req.params.workout_id)
  db.tx(t => {
    return t.batch([
      t.none('update workouts set user_id = $2 where id = $1', [id, user_id]),
      t.none('update workouts set workout_date = $2 where id = $1', [id, req.body.workout_date]),
      t.none('update workouts set type = $2 where id = $1', [id, req.body.type]),
      t.none('update workouts set description = $2 where id = $1', [id, req.body.description]),
      t.none('update workouts set completed = $2 where id = $1', [id, req.body.completed])
    ]);
  })
    .then(function () {
      res.status(200)
        .json({
            'status': 'success',
            'message': 'Updated Workout'
        });
    })
    .catch(function (err) {
      return next(err);
    });
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


//////////////////////////
//////////////////////////


function addJournal(req, res, next) {
  db.one('insert into journal(user_id, project_id, journal_date, entry)' +
  'values(${user_id}, ${project_id}, ${journal_date}, ${entry}) returning id', req.body)
  .then(function(data) {
    res.status(200).json({ status: 'success', message: "Entry was added to database", id: data.id});
  }).catch(function(err) {
    next(err);
  })
}

function getJournal(req, res, next) {
  var user_id = parseInt(req.params.id);
  var project_id = parseInt(req.params.project_id)
  db.any('select * from journal where user_id=$1 and project_id=$2', [user_id, project_id])
  .then(function(data) {
    res.status(200).json({
      status: 'success',
      data: data,
      message: 'Retrieved All journal entries'
    });
  })
  .catch(function(err) {
    return next(err);
  });
}

function deleteJournal(req, res, next) {
  var id = parseInt(req.params.journal_id);
  var user_id = parseInt(req.params.id);
  var project_id = parseInt(req.params.project_id);
  db.result('delete from journal where id = $1 and user_id = $2 and project_id = $3', [id, user_id, project_id]).then(function(result) {
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
  editProject: editProject,
  addWorkout: addWorkout,
  getAllWorkouts: getAllWorkouts,
  deleteWorkout: deleteWorkout,
  editWorkout: editWorkout,
  addMilestone: addMilestone,
  getAllMilestones: getAllMilestones,
  deleteMilestone: deleteMilestone,
  addJournal: addJournal,
  getJournal: getJournal,
  deleteJournal: deleteJournal
};
