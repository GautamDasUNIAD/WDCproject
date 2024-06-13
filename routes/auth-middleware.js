// In auth-middleware.js
function isAdmin(req, res, next) {
    if (req.isAuthenticated() && (req.user.role === 'Admin' || req.user.role === 'admin') ) {
        return next();
    } else {
        res.status(403).send('You do not have permission to perform this action.');
    }
}

module.exports = { isAdmin };
