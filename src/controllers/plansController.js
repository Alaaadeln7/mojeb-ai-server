const createPlan = asyncHandler(async (req, res) => {
  const { title, price, features, description } = req.body;
  const existingPlan = await Plan.findOne({ title });
  if (existingPlan) {
    return responseHandler(res, 400, "Plan already exists");
  }
  const newPlan = new Plan({ title, price, features, description });
  await newPlan.save();
  return responseHandler(res, 200, "Plan created successfully");
});

const getAllPlans = asyncHandler(async (req, res) => {
  const plans = await Plan.find();
  return responseHandler(res, 200, "Plans fetched successfully", plans);
});

const deletePlans = asyncHandler(async (req, res) => {
  const { planId } = req.params;
  const deletingPlan = await Plan.findByIdAndDelete(planId);
  if (!deletingPlan) {
    return responseHandler(res, 404, "Plan not found");
  }
  return responseHandler(res, 200, "Plan deleted successfully");
});

const updatePlan = asyncHandler(async (req, res) => {
  const { planId } = req.params;
  const { title, price, features, description } = req.body;
  const updatingPlan = await Plan.findByIdAndUpdate(
    planId,
    { title, price, features, description },
    { new: true }
  );
  if (!updatingPlan) {
    return responseHandler(res, 404, "Plan not found");
  }
  return responseHandler(res, 200, "Plan updated successfully");
});

const getSinglePlan = asyncHandler(async (req, res) => {
  const { planId } = req.params;
  const plan = await Plan.findById(planId);
  if (!plan) {
    return responseHandler(res, 404, "Plan not found");
  }
  return responseHandler(res, 200, "Plan fetched successfully", plan);
});
