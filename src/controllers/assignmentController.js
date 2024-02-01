const Assignment = require('../models/Assignment');
const Class = require('../models/Class');


// logic for creating assignments
exports.createAssignment = async (req, res) => {
  try {
    const { classId } = req.params;
    const { title, description, deadline, resources, links } = req.body;

    const foundClass = await Class.findById(classId);

    if (!foundClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    if (req.user.sub.toString() !== foundClass.admin.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const newAssignment = new Assignment({
        title,
        description,
        deadline,
        resources,
        links,
    });

    const savedAssignment = await newAssignment.save();
    res.status(201).json({ message: 'New assignment created', savedAssignment});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error'});
  }
};

// List assignments
exports.listAssignments = async (req, res) => {
  try {
    const { classId } = req.params;
    const classFound = await Class.findById(classId);

    if (!classFound) {
      return res.status(404).json({ error: 'class ID ${classId} not found' });
    }

    const getAssignments = classFound.assignments;
    
    if (!getAssignment || getAssignments.length === 0) {
      return res.status(404).json({ message: 'No assignment found' });
    }

    res.status(200).json({ message: `Retrieved successfully ${getAssignments}` });


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Retrieved only one assignment
exports.listAssignment = async (req, res) => {
  try {
    const { classId, assignmentId } = req.params;
    const classFound = await Class.findById(classId);

    if (!classFound) {
      return res.status(404).json({ error: `class with this ID ${classId} not found` });
    }

    const assignmentFound = await Assignment.findById(assignmentId);
    
    // Check if this assignment exists
    if (!assignmentFound) {
      return res.status(404).json({ error: `Assignment with this ID ${assignmentId} not found` });
    }

    res.status(200).json({ succesful: 'Succesfully retrieved', assignmentFound });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update the assignment
exports.updatedAssignment = async (req, res) => {
  try {
    const { classId, assignmentId } = req.params;
    const updateFields = req.body;

    const classFound = await Class.findById(classId);

    if (!classFound) {
      return res.status(404).json({ error: `class with this ID ${classId} not found` });
    }

    // Check if the admin of the class is the one updating the assignment
    if (req.user.sub.toString() !== classFound.admin.toString()) {
      return res.status(403).json({ error: 'Unauthorized'});
    }

    // Update the fields in the database
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      { $set: updateFields },
      { new: true }
    );
    res.status(201).json({ Succesful: `The assignment with ID ${assignmentId} is successfully updated ${updatedAssignment}` })

  } catch(error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete the assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const { classId, assignmentId } = req.params;

    const classFound = await Class.findById(classId);
    if (!classFound) {
      return res.status(404).json({ error: `class ID ${classId} not found` });
    }
    const assignmentFound = await Assignment.findById(assignmentId);
    
    if (!assignmentFound) {
      return res.status(404).json({ error: `assignment ID ${assignmentId} not found` });
    }
    if (req.user.sub.toString() !== classFound.admin.toString()) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    const deleteAssignment = await Assignment.findByIdAndDelete(assignmentId);
    res.status(204).json({ message: `Deleted succesfully` });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Implement logic for submitting assignments
exports.submitAssignment = async (req, res) => {
  try {
    // Implement logic for submitting assignments
    const { assignmentId } = req.params;
    const { submissionText } = req.body;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Check if the deadline has passed
    if (new Date() > new Date(assignment.deadline)) {
      return res.status(403).json({ error: 'Submission deadline has passed' });
    }

    // Check if the student has already submitted
    const existingSubmission = assignment.submissions.find(
      (submission) => submission.studentId.toString() === req.user.sub.toString()
    );

    if (existingSubmission) {
      return res.status(403).json({ error: 'You have already submitted this assignment' });
    }

    // Save the submission
    assignment.submissions.push({
      studentId: req.user.sub,
      submissionText,
    });

    const submittedAssignment = await assignment.save();

    res.status(201).json(submittedAssignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Implement logic for grading assignments
exports.gradeAssignment = async (req, res) => {
  try {
    const { assignmentId, studentId } = req.params;
    const { grade } = req.body;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Check if the user has permission to grade
    if (req.user.sub.toString() !== assignment.classId.admin.toString()) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    // Find the submission to grade
    const submissionToGrade = assignment.submissions.find(
      (submission) => submission.studentId.toString() === studentId
    );

    if (!submissionToGrade) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Update the grade
    submissionToGrade.grade = grade;

    const updatedAssignment = await assignment.save();

    res.json(updatedAssignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};