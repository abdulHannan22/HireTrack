const mongoose = require("mongoose");

const STATUS_VALUES = [
  "wishlist",
  "applied",
  "screening",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
];

const WORK_MODE_VALUES = ["remote", "hybrid", "onsite"];

const applicationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    role_title: {
      type: String,
      required: [true, "Role title is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: STATUS_VALUES,
      default: "wishlist",
    },
    job_url: {
      type: String,
      trim: true,
      default: "",
    },
    salary_min: {
      type: Number,
      default: null,
    },
    salary_max: {
      type: Number,
      default: null,
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    work_mode: {
      type: String,
      enum: WORK_MODE_VALUES,
      default: "remote",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    applied_at: {
      type: Date,
      default: null,
    },
    follow_up_date: {
      type: Date,
      default: null,
    },
    priority: {
      type: Number,
      min: 1,
      max: 3,
      default: 2,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
