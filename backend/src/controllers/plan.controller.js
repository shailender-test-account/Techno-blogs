import { PlanModel } from "../models/planModel.js";

/**
 * Create a new plan
 * POST /api/plans
 */
export const createPlan = async (req, res) => {
  try {
    const {
      plan_key,
      plan_name,
      tag_label,
      tag_color,
      title,
      price,
      price_display,
      period,
      original_price,
      popular,
      duration_days,
      currency,
      features,
      is_active,
    } = req.body;

    // ---- Validation ----
    const errors = [];

    if (!plan_key) errors.push("plan_key is required");
    if (!plan_name) errors.push("plan_name is required");
    if (!title) errors.push("title is required");
    if (price === undefined || price === null) errors.push("price is required");
    if (!price_display) errors.push("price_display is required");
    if (!duration_days) errors.push("duration_days is required");

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // ---- Duplicate check on plan_key ----
    const existing = await PlanModel.findByKey(plan_key);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Plan with plan_key "${plan_key}" already exists`,
      });
    }

    // ---- Create ----
    const insertId = await PlanModel.create({
      plan_key,
      plan_name,
      tag_label,
      tag_color,
      title,
      price,
      price_display,
      period,
      original_price,
      popular,
      duration_days,
      currency,
      features,
      is_active,
    });

    const plan = await PlanModel.findById(insertId);

    return res.status(201).json({
      success: true,
      message: "Plan created successfully",
      data: plan,
    });
  } catch (err) {
    console.error("createPlan error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create plan",
      error: err.message,
    });
  }
};

/**
 * Create multiple plans in a single request
 * POST /api/plans/bulk
 */
export const createBulkPlans = async (req, res) => {
  try {
    const { plans } = req.body;

    if (!Array.isArray(plans) || plans.length === 0) {
      return res.status(400).json({
        success: false,
        message: "`plans` must be a non-empty array",
      });
    }

    const created = [];
    const failed = [];

    for (const item of plans) {
      try {
        // Required fields check
        if (
          !item.plan_key ||
          !item.plan_name ||
          !item.title ||
          item.price === undefined ||
          !item.price_display ||
          !item.duration_days
        ) {
          failed.push({
            plan_key: item.plan_key || null,
            reason: "Missing required fields",
          });
          continue;
        }

        // Skip duplicates
        const existing = await PlanModel.findByKey(item.plan_key);
        if (existing) {
          failed.push({
            plan_key: item.plan_key,
            reason: "Duplicate plan_key",
          });
          continue;
        }

        const id = await PlanModel.create(item);
        const plan = await PlanModel.findById(id);
        created.push(plan);
      } catch (e) {
        failed.push({
          plan_key: item.plan_key || null,
          reason: e.message,
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: `${created.length} plan(s) created, ${failed.length} failed`,
      data: { created, failed },
    });
  } catch (err) {
    console.error("createBulkPlans error:", err);
    return res.status(500).json({
      success: false,
      message: "Bulk insert failed",
      error: err.message,
    });
  }
};




export const getPlans = async (req, res) => {
  try {
    console.log(req.query.active)
    const isActive =
      req.query.active === "true" || req.query.active === "1";


      console.log(isActive)

    const plans = isActive
      ? await PlanModel.findActive()
      : await PlanModel.findAll();

    if (!plans || plans.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    return res.json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (err) {
    console.error("getPlans error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch plans",
      error: err.message,
    });
  }
};

/**
 * Get popular plans only
 * GET /api/plans/popular
 */
export const getPopularPlans = async (req, res) => {
  try {
    const plans = await PlanModel.findPopular();
    return res.json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (err) {
    console.error("getPopularPlans error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch popular plans",
      error: err.message,
    });
  }
};

/**
 * Get single plan by ID
 * GET /api/plans/:id
 */
export const getPlan = async (req, res) => {
  try {
    const plan = await PlanModel.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }
    return res.json({ success: true, data: plan });
  } catch (err) {
    console.error("getPlan error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch plan",
      error: err.message,
    });
  }
};

/**
 * Get single plan by plan_key
 * GET /api/plans/key/:key
 */
export const getPlanByKey = async (req, res) => {
  try {
    const plan = await PlanModel.findByKey(req.params.key);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }
    return res.json({ success: true, data: plan });
  } catch (err) {
    console.error("getPlanByKey error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch plan",
      error: err.message,
    });
  }
};

/**
 * Update plan
 * PUT /api/plans/:id
 */
export const updatePlan = async (req, res) => {
  try {
    const existing = await PlanModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    const plan = await PlanModel.update(req.params.id, req.body);

    return res.json({
      success: true,
      message: "Plan updated successfully",
      data: plan,
    });
  } catch (err) {
    console.error("updatePlan error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update plan",
      error: err.message,
    });
  }
};

/**
 * Delete plan
 * DELETE /api/plans/:id
 */
export const deletePlan = async (req, res) => {
  try {
    const existing = await PlanModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    await PlanModel.delete(req.params.id);

    return res.json({
      success: true,
      message: "Plan deleted successfully",
    });
  } catch (err) {
    console.error("deletePlan error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete plan",
      error: err.message,
    });
  }
};

/**
 * Toggle active status
 * PATCH /api/plans/:id/toggle
 */
export const togglePlanActive = async (req, res) => {
  try {
    const existing = await PlanModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    const plan = await PlanModel.setActive(
      req.params.id,
      !existing.is_active
    );

    return res.json({
      success: true,
      message: `Plan ${plan.is_active ? "activated" : "deactivated"}`,
      data: plan,
    });
  } catch (err) {
    console.error("togglePlanActive error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle plan",
      error: err.message,
    });
  }
};