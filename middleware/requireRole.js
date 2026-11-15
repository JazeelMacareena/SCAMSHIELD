
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.auth) {
            return res.status(401).json({
                error: "Authentication required"
            });
        }

        console.log("ROLE CHECK:", {
            actualRole: req.auth.role,
            allowedRoles
        });

        if (!allowedRoles.includes(req.auth.role)) {
            return res.status(403).json({
                error: "Access forbidden"
            });
        }

        next();
    };
};

module.exports = requireRole;
