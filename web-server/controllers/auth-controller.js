const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const { User } = require('../../database/user-model');
const { createRole, createIndustry, createOrganization } = require('../utils/utils-profile');
const { generateHashedPassword, compareHashedPassword } = require('../utils/utils-auth');
const jwt = require('jsonwebtoken');
const config = require('../config');
const path = require('path');
const multer  = require('multer');
const storage = multer.diskStorage({
  destination: path.join(__dirname, '/../../uploads'),
  filename: function (req, file, cb) {
    let ext = '';
    switch (file.mimetype) {
      case 'image/jpeg':
        ext = '.jpeg';
        break;
      case 'image/png':
        ext = '.png';
        break;
    }
    cb(null, file.originalname + ext);
  }
});

var upload = multer({storage: storage}).single('upload');

module.exports.signUpRequest = (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  User.findOne({ 'email': email }, (err, user) => {
    if (err) {
      throw err;
    } else if (user) {
      compareHashedPassword(password, user.password).then(isValid => {
        if (isValid) {
          return res.send({
            email,
            completedProfile: user.completedProfile
          });
        } else {
          return res.status(401).send('Password Incorrect');
        }
      });
    } else {
      const newUser = new User;
      newUser.email = email;
      newUser.firstname = firstname;
      newUser.lastname = lastname;

      generateHashedPassword(password).then(hash => {
        newUser.password = hash;
      }).then( () => {
        return newUser.save((err, user) => {
          if (err) {
            throw err;
          } else {
            const token = jwt.sign({
                email,
                completedProfile: user.completedProfile
              }, config.jwtSecret);
            return res.send({
              firstname,
              lastname,
              email,
              completedProfile: user.completedProfile,
              token
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
  const { email, role, industry, organization } = req.body;
  User.findOne({ 'email': email }, (err, user) => {
    if (err) {
      throw err;
    } else {
      let newRole = createRole(role);
      let newIndustry = createIndustry(industry);
      let newOrganization = createOrganization(organization);

      user.completedProfile = true;
      user.role = newRole;
      user.industry = newIndustry;

      if(organization.name !== '') {
        user.organization = newOrganization;
      }
  
      return user.save((err, updatedUser) => {
        if (err) throw err;
          return res.send({
            email: email,
            completedProfile: true
          });
      });
    }
  }).catch(err => {
    throw err;
  });
};

module.exports.imageUploadRequest = (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.send({'imageUploadRequest err': err});
    }
    console.log('body', req.body);
    console.log('file', req.file);
    console.log('files', req.files);
    return res.send('File uploaded sucessfully');
  })
}

module.exports.loginRequest = (req, res) => {
  const { email, password} = req.body;
  User.findOne({ 'email': email }, (err, user) => {
    if (err) {
      throw err;
    } else if (user) {
      compareHashedPassword(password, user.password).then(isValid => {
        if (isValid) {
          const token = jwt.sign({
            email: email,
            completedProfile: user.completedProfile,
          }, config.jwtSecret);
          const { role, industry, organization } = user;
            let userData = {
              email: email,
              completedProfile: user.completedProfile,
              role,
              industry,
              token
            };
            if (organization && organization.name !== '') {
              userData.organization = organization;
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

module.exports.getUserInformationRequest = (req, res) => {
  User.findOne({email: req.params.userEmail}, (err, user) => {
    if (err) {
      throw err;
    } else {
      return res.send(user);
    }
  }).catch(err => {
    throw err;
  });
};
