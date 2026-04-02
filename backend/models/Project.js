const mongoose = require('mongoose');

// ── RL Config (tune these weights to shape visitor behaviour) ─────────────────
const RL = {
  W_VIEWS:   1.0,
  W_CLICKS:  3.0,
  W_TIME:    0.5,   // per second
  W_GITHUB:  4.0,
  W_LIVE:    5.0,
  EPSILON:   0.15,  // exploration rate (stored in RlMeta collection)
  DECAY:     0.995,
  ALPHA:     0.1,
};

const ProjectSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  techStack:   [{ type: String, trim: true }],
  liveUrl:     { type: String, trim: true },
  githubUrl:   { type: String, trim: true },
  imageUrl:    { type: String, trim: true },  // base64 or external URL
  imageData:   { type: String },              // base64 storage (set by upload)
  featured:    { type: Boolean, default: false },
  order:       { type: Number,  default: 0 },

  engagement: {
    views:           { type: Number, default: 0 },
    clicks:          { type: Number, default: 0 },
    timeSpent:       { type: Number, default: 0 },
    githubClicks:    { type: Number, default: 0 },
    liveClicks:      { type: Number, default: 0 },
    engagementScore: { type: Number, default: 0 },
    lastUpdated:     { type: Date,   default: Date.now },
  },
}, { timestamps: true });

// Auto-compute engagement score on every save
ProjectSchema.pre('save', function (next) {
  const e = this.engagement;
  e.engagementScore =
    e.views        * RL.W_VIEWS  +
    e.clicks       * RL.W_CLICKS +
    e.timeSpent    * RL.W_TIME   +
    e.githubClicks * RL.W_GITHUB +
    e.liveClicks   * RL.W_LIVE;
  next();
});

// ── Static method: run RL re-ranking across all projects ──────────────────────
ProjectSchema.statics.runRL = async function () {
  const projects = await this.find({});
  if (!projects.length) return;

  const rewards = projects.map(p => {
    const e = p.engagement;
    return (
      e.views        * RL.W_VIEWS  +
      e.clicks       * RL.W_CLICKS +
      e.timeSpent    * RL.W_TIME   +
      e.githubClicks * RL.W_GITHUB +
      e.liveClicks   * RL.W_LIVE
    );
  });

  // Normalise rewards to [0,1]
  const mn = Math.min(...rewards), mx = Math.max(...rewards);
  const norm = rewards.map(r => mx === mn ? 0.5 : (r - mn) / (mx - mn));

  // Epsilon-greedy ordering
  const RlMeta = mongoose.model('RlMeta');
  let meta = await RlMeta.findOne({ key: 'epsilon' });
  let eps  = meta ? meta.value : RL.EPSILON;
  eps = Math.max(0.02, eps * RL.DECAY);
  await RlMeta.findOneAndUpdate({ key: 'epsilon' }, { value: eps }, { upsert: true });

  const indices = projects.map((_, i) => i);
  const explore = Math.random() < eps;

  if (explore) {
    // Shuffle a fraction of positions
    const swaps = Math.max(1, Math.floor(projects.length * eps));
    for (let s = 0; s < swaps; s++) {
      const i = Math.floor(Math.random() * projects.length);
      const j = Math.floor(Math.random() * projects.length);
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
  } else {
    indices.sort((a, b) => norm[b] - norm[a]);
  }

  // Write ranks back
  const bulkOps = indices.map((projIdx, rank) => ({
    updateOne: {
      filter: { _id: projects[projIdx]._id },
      update: {
        $set: {
          order: rank,
          'engagement.engagementScore': norm[projIdx] * 1000,
          'engagement.lastUpdated': new Date(),
        },
      },
    },
  }));

  await mongoose.model('Project').bulkWrite(bulkOps);
  console.log(`[RL] Re-ranked ${projects.length} projects (explore=${explore}, eps=${eps.toFixed(4)})`);
};

module.exports = mongoose.model('Project', ProjectSchema);
