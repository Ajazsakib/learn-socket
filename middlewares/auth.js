const isLogin = async function (req, res, next) {
  try {
    if (!req.session.user) {
      return  res.redirect('/'); 
    } 
    next();
  } catch (error) {
    console.log(error);
  }
};

const isLogout = async function (req, res, next) {
  try {
    if (req.session.user) {
      return res.redirect('/dashboard');
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  isLogin,
  isLogout,
};
