function checkHierarchy(userRole, adder) {
  const roles = ["admin", "principal", "HOD", "mentor", "student"];
  let userLevel;

  if (userRole == "teacher") userLevel = 3;
  else userLevel = roles.indexOf(userRole);

  const adderLevel = roles.indexOf(adder);

  return adderLevel < userLevel;
}

module.exports = {
  checkHierarchy,
};
