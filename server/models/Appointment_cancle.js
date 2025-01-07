const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AppointmentCancelSchema = new Schema({
    appointmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    canceledAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AppointmentCancel', AppointmentCancelSchema);