const express = require("express");
const { z } = require("zod");
const Application = require("../schema/Application");
const ActivityLog = require("../schema/ActivityLog");
const Contact = require("../schema/Contact");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
router.use(authMiddleware);

const STATUS_VALUES = [
  "wishlist",
  "applied",
  "screening",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
];

const createSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role_title: z.string().min(1, "Role title is required"),
  status: z.enum(STATUS_VALUES).optional(),
  job_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  salary_min: z.number().positive().nullable().optional(),
  salary_max: z.number().positive().nullable().optional(),
  location: z.string().optional(),
  work_mode: z.enum(["remote", "hybrid", "onsite"]).optional(),
  notes: z.string().optional(),
  applied_at: z.string().datetime().nullable().optional(),
  follow_up_date: z.string().datetime().nullable().optional(),
  priority: z.number().int().min(1).max(3).optional(),
});

const updateSchema = createSchema.partial();

const statusSchema = z.object({
  status: z.enum(STATUS_VALUES, { message: "Invalid status value" }),
});

const activitySchema = z.object({
  type: z.enum([
    "note_added",
    "interview_scheduled",
    "offer_received",
    "followed_up",
  ]),
  note: z.string().min(1, "Note cannot be empty"),
});

// ─── GET /applications ───────────────────────────────────────────────────────
// Query params: ?status=applied  ?search=google  ?sort=oldest
router.get("/", async (req, res) => {
  try {
    const { status, search, sort } = req.query;
    const filter = { user_id: req.userId };

    if (status && STATUS_VALUES.includes(status)) {
      filter.status = status;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ company: regex }, { role_title: regex }];
    }

    const sortOrder = sort === "oldest" ? 1 : -1;

    const applications = await Application.find(filter).sort({
      createdAt: sortOrder,
    });

    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

// ─── POST /applications ───────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  const result = createSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: result.error.errors[0].message });
  }

  try {
    const app = await Application.create({
      ...result.data,
      user_id: req.userId,
    });

    await ActivityLog.create({
      application_id: app._id,
      user_id: req.userId,
      type: "created",
      note: `Added ${app.company} — ${app.role_title}`,
      logged_at: new Date(),
    });

    res.status(201).json({ application: app });
  } catch (err) {
    res.status(500).json({ message: "Failed to create application" });
  }
});

// ─── GET /applications/:id ────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const app = await Application.findOne({
      _id: req.params.id,
      user_id: req.userId,
    });

    if (!app) return res.status(404).json({ message: "Application not found" });

    const activity = await ActivityLog.find({ application_id: app._id }).sort({
      logged_at: -1,
    });

    const contact = await Contact.findOne({ application_id: app._id });

    res.json({ application: app, activity, contact: contact || null });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch application" });
  }
});

// ─── PUT /applications/:id ────────────────────────────────────────────────────
router.put("/:id", async (req, res) => {
  const result = updateSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: result.error.errors[0].message });
  }

  try {
    const app = await Application.findOneAndUpdate(
      { _id: req.params.id, user_id: req.userId },
      { $set: result.data },
      { new: true, runValidators: true }
    );

    if (!app) return res.status(404).json({ message: "Application not found" });

    res.json({ application: app });
  } catch (err) {
    res.status(500).json({ message: "Failed to update application" });
  }
});

// ─── PATCH /applications/:id/status ──────────────────────────────────────────
// Called by Kanban drag-and-drop — logs the status change automatically
router.patch("/:id/status", async (req, res) => {
  const result = statusSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: result.error.errors[0].message });
  }

  try {
    const app = await Application.findOne({
      _id: req.params.id,
      user_id: req.userId,
    });

    if (!app) return res.status(404).json({ message: "Application not found" });

    const previousStatus = app.status;
    const newStatus = result.data.status;

    if (previousStatus === newStatus) {
      return res.json({ application: app });
    }

    app.status = newStatus;

    // Auto-set applied_at when moved to "applied" for the first time
    if (newStatus === "applied" && !app.applied_at) {
      app.applied_at = new Date();
    }

    await app.save();

    await ActivityLog.create({
      application_id: app._id,
      user_id: req.userId,
      type: "status_changed",
      note: `Moved from ${previousStatus} to ${newStatus}`,
      meta: { from_status: previousStatus, to_status: newStatus },
      logged_at: new Date(),
    });

    res.json({ application: app });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

// ─── POST /applications/:id/activity ─────────────────────────────────────────
// Manually add a note or event to the activity timeline
router.post("/:id/activity", async (req, res) => {
  const result = activitySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: result.error.errors[0].message });
  }

  try {
    const app = await Application.findOne({
      _id: req.params.id,
      user_id: req.userId,
    });

    if (!app) return res.status(404).json({ message: "Application not found" });

    const entry = await ActivityLog.create({
      application_id: app._id,
      user_id: req.userId,
      type: result.data.type,
      note: result.data.note,
      logged_at: new Date(),
    });

    res.status(201).json({ entry });
  } catch (err) {
    res.status(500).json({ message: "Failed to add activity" });
  }
});

// ─── DELETE /applications/:id ─────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const app = await Application.findOneAndDelete({
      _id: req.params.id,
      user_id: req.userId,
    });

    if (!app) return res.status(404).json({ message: "Application not found" });

    // Clean up related documents
    await ActivityLog.deleteMany({ application_id: app._id });
    await Contact.deleteMany({ application_id: app._id });

    res.json({ message: "Application deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete application" });
  }
});

// ─── GET /applications/meta/stats ────────────────────────────────────────────
// Returns counts, response rate, avg days to first response
router.get("/meta/stats", async (req, res) => {
  try {
    const userId = req.userId;

    const all = await Application.find({ user_id: userId });
    const total = all.length;

    // Count by status
    const byStatus = STATUS_VALUES.reduce((acc, s) => {
      acc[s] = 0;
      return acc;
    }, {});
    all.forEach((a) => {
      if (byStatus[a.status] !== undefined) byStatus[a.status]++;
    });

    // Active interviews = currently in screening or interview
    const activeInterviews = byStatus.screening + byStatus.interview;

    // Response rate = apps that moved past "applied" / total applied apps
    const appliedOrBeyond = all.filter((a) => a.status !== "wishlist").length;
    const responded = all.filter(
      (a) =>
        a.status !== "wishlist" &&
        a.status !== "applied"
    ).length;
    const responseRate =
      appliedOrBeyond > 0
        ? Math.round((responded / appliedOrBeyond) * 100)
        : 0;

    // Average days from applied_at to first status change beyond "applied"
    const statusChangeLogs = await ActivityLog.find({
      user_id: userId,
      type: "status_changed",
      "meta.from_status": "applied",
    });

    let avgDays = null;
    if (statusChangeLogs.length > 0) {
      const appIds = statusChangeLogs.map((l) => String(l.application_id));
      const matchedApps = all.filter(
        (a) => appIds.includes(String(a._id)) && a.applied_at
      );

      if (matchedApps.length > 0) {
        const totalDays = matchedApps.reduce((sum, a) => {
          const log = statusChangeLogs.find(
            (l) => String(l.application_id) === String(a._id)
          );
          const diff =
            (new Date(log.logged_at) - new Date(a.applied_at)) /
            (1000 * 60 * 60 * 24);
          return sum + diff;
        }, 0);
        avgDays = Math.round(totalDays / matchedApps.length);
      }
    }

    res.json({
      total,
      byStatus,
      activeInterviews,
      responseRate,
      avgDaysToResponse: avgDays,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

module.exports = router;