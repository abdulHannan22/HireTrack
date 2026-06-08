const mongoose = require("mongoose");

const ACTIVITY_TYPES = [
  "created",        // application first added
  "status_changed", // moved between Kanban columns
  "note_added",     // manual note from user
  "interview_scheduled",
  "offer_received",
  "rejected",
  "followed_up",
];

const activityLogSchema = new mongoose.Schema(
  {
    application_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ACTIVITY_TYPES,
      required: true,
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    meta: {
      from_status: { type: String, default: null },
      to_status: { type: String, default: null },
    },
    logged_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
