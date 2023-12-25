const User = require('../models/user');

module.exports.profile=function(req,res){
  if(req.isAuthenticated()){
    return res.redirect('/users/profile')
  }
    return res.render('profile');
}

module.exports.signup=function(req,res){
  if(req.isAuthenticated()){
    return res.redirect('/users/profile')
  }
    return res.render('signup');
}

module.exports.signin=function(req,res){
  if(req.isAuthenticated()){
    return res.redirect('/users/profile')
  }
    return res.render('signin');
}
// get the sign up data
module.exports.create = async function (req, res) {
    try {
      if (req.body.password != req.body.confirmpassword) {
        return res.redirect('back');
      }
  
      let user = await User.findOne({ email: req.body.email });
  
      if (!user) {
        user = await User.create(req.body);
        return res.redirect('/users/sign-in');
      } else {
        return res.redirect('back');
      }
    } catch (err) {
      console.log('Error in creating user signing up', err);
      return res.redirect('back');
    }
  }
  
  module.exports.createSession = async function (req, res) {
    
    return res.redirect('/');
  };
  module.exports.destroySession = async function (req, res) {
    req.logout(function(err) {
      if (err) {
          // Handle error
      }
     
      return res.redirect('/');
  });
} 
// Get student detail
