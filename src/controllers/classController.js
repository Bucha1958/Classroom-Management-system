// classController.js
const Class = require('../models/Class');
const axios = require('axios');

exports.createClass = async (req, res) => {
  try {

        // Extract necessary information from the request body
    const { name, description, days, startTime, endTime } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
    }
    const admin = req.user.sub;
    
    // Create a new class instance
    const newClass = new Class({
      name,
      description,
      admin,
      members: [admin], // The admin is automatically a member
      schedule: { days, startTime, endTime },
      assignments: [],
      resources: [],
      discussions: [],
    });

    // Save the new class to the database
    const savedClass = await newClass.save();

    res.status(201).json(savedClass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

};

exports.allClasses = async (req, res) => {
  try {
    // Find all classes in the database
    const allClasses = await Class.find()
      .populate('admin', 'displayName') // Populate the 'admin' field with 'displayName' from the 'User' model
      .populate('members', 'displayName'); // Populate the 'members' field with 'displayName' from the 'User' model

    // Send the list of classes in the response
    res.json(allClasses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.getClass = async (req, res) => {
  try {
    const classId = req.params.classId;

    // Find the class by ID
    const foundClass = await Class.findById(classId)
      .populate('admin', 'displayName')
      .populate('members', 'displayName');

    if (!foundClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Send the details of the class in the response
    res.json(foundClass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const classId = req.params.classId;
    const updateFields = req.body;

    // Update the class in the database
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { $set: updateFields },
      { new: true }
    );

    // Check if the class was found and updated
    if (!updatedClass) {
      return res.status(404).json({ error: 'Class not found' });
    };

    // Send the updated class in the response
    res.json(updatedClass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const classFound = await Class.findById(classId);

    if (req.user.sub.toString() !== classFound.admin.toString()) {
      return res.status(403).json({ error: 'Permission denied' })
    }
    // Check if the class was found and deleted
    if (!classFound) {
      return res.status(404).json({ error: 'Class not found' });
    }
    // Delete the class from the database
    const deletedClass = await Class.findByIdAndDelete(classId);

    // Send a success message in the response
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
