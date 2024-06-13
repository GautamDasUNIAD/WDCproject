// In auth-middleware.js
function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'Admin') {
        return next();
    } else {
        res.status(403).send('You do not have permission to perform this action.');
    }
}

module.exports = { isAdmin };
