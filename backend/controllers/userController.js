const { users } = require('./authController');

exports.getUserProfile = (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send('User not found');

  res.json({
    name: user.name,
    phone: user.phone,
    applications: user.jobsApplied.length
  });
};