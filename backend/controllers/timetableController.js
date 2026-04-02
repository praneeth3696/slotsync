const Timetable = require('../models/Timetable');

const getTimetable = async (req, res) => {
  const { programme } = req.query;
  try {
    const filter = programme ? { programme } : {};
    const timetables = await Timetable.find(filter);
    
    // Format response to match frontend expected structure: [{ programme: "...", schedule: [...] }]
    const formattedData = {};
    timetables.forEach(entry => {
      if (!formattedData[entry.programme]) {
        formattedData[entry.programme] = {
          programme: entry.programme,
          semester: entry.semester,
          schedule: []
        };
      }
      formattedData[entry.programme].schedule.push({
        day: entry.day,
        period: entry.period,
        course: entry.course,
        resource: entry.resource,
        type: entry.type
      });
    });

    const result = Object.values(formattedData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timetables', error: error.message });
  }
};

module.exports = { getTimetable };
