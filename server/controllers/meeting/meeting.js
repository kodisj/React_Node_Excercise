const MeetingHistory = require('../../model/schema/meeting')
const mongoose = require('mongoose');

const add = async (req, res) => {
    try {
        const meeting = new MeetingHistory(req.body);
        await meeting.save();
        res.status(201).json(meeting);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const index = async (req, res) => {
    const query = req.query
    query.deleted = false;
    try {
        const meetings = await MeetingHistory.find(query)
            .populate("attendes")
            .populate("attendesLead")
            .populate("createBy");
        res.status(200).json(meetings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const view = async (req, res) => {
    try {
        const meeting = await MeetingHistory.findById(req.params.id)
            .populate("attendes")
            .populate("attendesLead")
            .populate("createBy");

        if (!meeting || meeting.deleted) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        res.status(200).json(meeting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const deleteData = async (req, res) => {
    try {
        const meeting = await MeetingHistory.findByIdAndUpdate(
            req.params.id,
            { deleted: true },
            { new: true }
        );

        if (!meeting) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        res.status(200).json({ message: "Meeting deleted", meeting });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteMany = async (req, res) => {
    try {
        const { ids } = req.body; // Expecting an array of IDs

        const result = await MeetingHistory.updateMany({ _id: { $in: req.body } }, { $set: { deleted: true } });

        res.status(200).json({ message: "Meetings deleted", result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { add, index, view, deleteData, deleteMany }