const getMonthYear = (date) => {
  const d = new Date(date);
  return { month: d.getMonth(), year: d.getFullYear() };
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

module.exports = { getMonthYear, monthNames };
