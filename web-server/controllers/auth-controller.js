const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const { User } = require('../../database/user-model');
const { createRole, createIndustry, createProject } = require('../utils/utils-profile');
const { generateHashedPassword, compareHashedPassword } = require('../utils/utils-auth');

module.exports.signUpRequest = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ 'email': email }, (err, user) => {
    if (err) {
      throw err;
    } else if (user) {
      compareHashedPassword(password, user.password).then(isValid => {
        if (isValid) {
          return res.send({
            email: email,
            completedProfile: user.completedProfile,
          });
        } else {
          return res.status(401).send('Password Incorrect');
        }
      });
    } else {
      const newUser = new User;
      newUser.email = email;
      generateHashedPassword(password).then(hash => {
        newUser.password = hash;
      }).then( () => {
        return newUser.save((err, user) => {
          if (err) {
            throw err;
          } else {
            return res.send({
              email: email,
              completedProfile: user.completedProfile
            });
          }
        })
      }).catch(err => {
        throw err;
      });  
    }
  })
};

module.exports.signUpCompletedRequest = (req, res) => {
  const { email, role, industry, project } = req.body;
  User.findOne({ 'email': email }, (err, user) => {
    if (err) {
      throw err;
    } else {
      let newRole = createRole(role);
      let newIndustry = createIndustry(industry);
      let newProject = createProject(project);

      user.completedProfile = true;
      user.role = newRole;
      user.industry = newIndustry;

      if(project.title !== '') {
        user.project = newProject;
      }
  
      return user.save((err, updatedUser) => {
        if (err) throw err;
          return res.send({
            email: email,
            completedProfile: true
          });
      }) 
    }
  }).catch(err => {
    throw err;
  });
};

module.exports.loginRequest = (req, res) => {
  const { email, password} = req.body;
  User.findOne({ 'email': email }, (err, user) => {
    if (err) {
      throw err;
    } else if (user) {
      compareHashedPassword(password, user.password).then(isValid => {
        if (isValid) {
          const { role, industry, project } = user;
            let userData = {
              email: email,
              completedProfile: user.completedProfile,
              role: role[0],
              industry: industry[0],
            };
            if (project.length) {
              userData.project = project;
            }
            return res.send(userData);
        } else {
          return res.status(401).send('Password Incorrect');
        }
      });
    } else {
      return res.status(401).send('User not found');
    }
  }).catch(err => {
    throw err;
  });
};
