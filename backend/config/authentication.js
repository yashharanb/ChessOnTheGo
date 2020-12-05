//This middleware prevents unverified users for accessing past registration or login page
//Uses passportjs for this
//this needs to be added to any route in index.js in the routes folder to protect any route
module.exports = {
	ensureAuthenticated: function(req, res, next)
	{
		if(req.isAuthenticated())
		{
			//if user is authentcated, continue
			return next();
		}
		//if user is not, then stop them and show error message along with the welcome/login screen
		req.flash('error_msg', 'Please login if you want to access our Chess on the Go gaming platform!')
		res.redirect('/')
	}
}