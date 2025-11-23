exports.getAdminDashboard = async (req, res) => {
  res.json({
    message: "Admin Dashboard Data",
    user: req.user,
  });
};
