const {v4: uuidv4} = require("uuid");
const Class = require("../models/Class");
const Enrollment = require("../models/Enrollment");

exports.updateEnrollmentLink = async (req, res) => {
  try {
    const classId = req.params.classId;

    // Find the class by ID
    const foundClass = await Class.findById(classId);

    if (!foundClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Check if the user making the request is the admin
    if (req.user.sub.toString() !== foundClass.admin.toString()) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    // Generate a new enrollment link and save the class
    foundClass.inviteCode = uuidv4();
    const updatedClass = await foundClass.save();

    res.json({ 'enrollmentLink updated': updatedClass });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
  
exports.enrollStudent = async (req, res) => {
  try {
    const classId = req.params.classId;
    const inviteCode = req.body.inviteCode;

    // Find the class by ID
    const foundClass = await Class.findById(classId);

    if (!foundClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Check if the invite code matches
    if (inviteCode !== foundClass.inviteCode) {
      return res.status(403).json({ error: 'Invalid invite code' });
    }

    if (req.user.sub.toString() === foundClass.admin.toString()) {
      return res.json({ message: 'Admin already Enrolled'})
    }
    
    const isUserEnrolled = foundClass.members.includes(req.user.sub.toString())

    if (isUserEnrolled) {
      return res.json({ message: 'Already Enrolled'});
    }
    // ... proceed with enrollment logic ...
    const enroll = new Enrollment({
      studentId: req.user.sub,
      classId
    })

    const saveEnrollmentClass = await enroll.save();
    res.status(201).json(saveEnrollmentClass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete student from the class
exports.deleteStudent = async (req, res) => {
  try {
    const classId = req.params.classId
    const foundClass = await Class.findById(classId);
    if (!foundClass) {
      return res.status(404).json({ error: 'Class not found' });
    }
    // check if the student belongs to the class
    const isStudentBelongsToClass = foundClass.members.includes(req.user.sub.toString());
    if (req.user.sub.toString() !== foundClass.admin.toString()) {
      return res.status(403).json({ error: 'Permission denied'});
    }

    if (req.user.sub.toString() === foundClass.admin.toString()) {
      return res.status(403).json({ error: 'Admin cannot be deleted' });
    }

    if (!isStudentBelongsToClass) {
      return res.status(403).json({ error: 'no such student in that class'});
    }

    const deleteStudent = await Enrollment.deleteOne({ 
      studentId: req.user.sub.toString(),
      classId
    });

    if (deleteStudent.deletedCount === 0) {
      return res.status(404).json({ error : 'student not found' });
    }

    res.status(204).end();
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error'});
  }
}