var express = require('express');
var router = express.Router();
var db = require('./queries');

router.get('/progressionusers', db.getAllUsers)
router.post('/progressionusers', db.signIn)
router.post('/progressionusers/new', db.createUser)

router.post('/progressionusers/ascents/new', db.addAscent)
router.get('/progressionusers/:id/ascents', db.getAllAscents)
router.delete('/progressionusers/:id/ascents/:ascent_id', db.deleteAscent)

router.post('/progressionusers/projects/new', db.addProject)
router.get('/progressionusers/:id/projects', db.getAllProjects)
router.delete('/progressionusers/:id/projects/:project_id', db.deleteProject)
// router.patch('/progressionusers/:id/projects/:project_id', db.editProject)

router.post('/progressionusers/milestones/new', db.addMilestone)
router.get('/progressionusers/:id/projects/:project_id/milestones', db.getAllMilestones)
// router.delete('/progressionusers/:id/projects/:project_id/milestones/:milestone_id', db.deleteMilestone)

router.post('/progressionusers/workouts/new', db.addWorkout)
router.get('/progressionusers/:id/workouts', db.getAllWorkouts)
router.delete('/progressionusers/:id/workouts/:workout_id', db.deleteWorkout)
// router.patch('/progressionusers/:id/workouts/:workout_id', db.editWorkout)

module.exports = router;
