const { 
  signUpRequest,
  signUpCompletedRequest,
  loginRequest,
  getUserInformationRequest
} = require('./controllers/auth-controller');
const {
  getIndustryMatchesRequest
}= require('./controllers/search-controller');

module.exports = function(app, express) {

  app.post('/user/signup', signUpRequest);
  app.post('/user/signup/completed', signUpCompletedRequest);
  app.post('/user/login', loginRequest);
  app.get('/user/information/:userEmail', getUserInformationRequest);
  app.get('/matches/:industryName', getIndustryMatchesRequest);
}