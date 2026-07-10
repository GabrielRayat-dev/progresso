const ProjectModel = require('../models/project.model')
const MemberModel = require('../models/member.model')
const ActivityModel = require('../models/activity.model')

// ─── CREATE PROJECT ───────────────────────────────────────
const createProject = async (req, res) => {
  const { name, description, type, deadline } = req.body

  if (!name || !type) {
    return res.status(400).json({ 
      error: 'Project name and type are required.' 
    })
  }

  const validTypes = ['thesis', 'school', 'freelance', 'personal']
  if (!validTypes.includes(type)) {
    return res.status(400).json({ 
      error: 'Type must be: thesis, school, freelance, or personal.' 
    })
  }

  try {
    // Create the project
    const project = await ProjectModel.create(
      name, description, type, deadline, req.user.id
    )

    // Automatically add owner as leader
    await MemberModel.add(project.id, req.user.id, 'leader')

    // Log activity
    await ActivityModel.log(
      project.id, null, req.user.id,
      'project_created', null, name
    )

    res.status(201).json({
      message: 'Project created successfully!',
      project
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ─── GET ALL MY PROJECTS ──────────────────────────────────
const getMyProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.findAllByUser(req.user.id)
    res.json({ count: projects.length, projects })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ─── GET SINGLE PROJECT ───────────────────────────────────
const getProject = async (req, res) => {
  try {
    const project = await ProjectModel.findById(req.params.project_id)
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' })
    }
    res.json(project)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ─── UPDATE PROJECT ───────────────────────────────────────
const updateProject = async (req, res) => {
  const { name, description, type, deadline, status } = req.body
  try {
    const project = await ProjectModel.update(
      req.params.project_id,
      name, description, type, deadline, status
    )

    await ActivityModel.log(
      req.params.project_id, null, req.user.id,
      'project_updated', null, name
    )

    res.json({ message: 'Project updated!', project })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ─── DELETE PROJECT ───────────────────────────────────────
const deleteProject = async (req, res) => {
  try {
    await ProjectModel.delete(req.params.project_id)
    res.json({ message: 'Project deleted.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { 
  createProject, 
  getMyProjects, 
  getProject, 
  updateProject, 
  deleteProject 
}