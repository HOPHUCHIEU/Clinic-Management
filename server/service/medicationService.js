const Prescription = require("../models/Prescription");

exports.getTotalSales = async () => {
  return await Prescription.aggregate([
    { $unwind: "$medications" },
    {
      $group: {
        _id: "$medications.medication_id",
        totalQuantity: { $sum: "$medications.quantity" },
        totalRevenue: { $sum: { $multiply: ["$medications.quantity", "$medications.price"] } }
      }
    },
    {
      $lookup: {
        from: "medications",
        localField: "_id",
        foreignField: "_id",
        as: "medication"
      }
    },
    { $unwind: "$medication" },
    {
      $project: {
        _id: 1,
        totalQuantity: 1,
        totalRevenue: 1,
        medicationName: "$medication.name"
      }
    },
    {
      $sort: {
        totalRevenue: -1
      }
    }
  ]);
};

exports.getBestSellingMedication = async () => {
  const salesReport = await Prescription.aggregate([
    { $unwind: "$medications" },
    {
      $group: {
        _id: "$medications.medication_id",
        totalQuantity: { $sum: "$medications.quantity" },
        totalRevenue: { $sum: { $multiply: ["$medications.quantity", "$medications.price"] } }
      }
    },
    {
      $lookup: {
        from: "medications",
        localField: "_id",
        foreignField: "_id",
        as: "medication"
      }
    },
    { $unwind: "$medication" },
    {
      $project: {
        _id: 1,
        totalQuantity: 1,
        totalRevenue: 1,
        medicationName: "$medication.name"
      }
    },
    {
      $sort: {
        totalQuantity: -1
      }
    }
  ]);

  return salesReport[0];
};

exports.getTotalSalesToday = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await Prescription.aggregate([
    { $match: { createdAt: { $gte: today } } },
    { $unwind: "$medications" },
    {
      $group: {
        _id: "$medications.medication_id",
        totalQuantity: { $sum: "$medications.quantity" },
        totalRevenue: { $sum: { $multiply: ["$medications.quantity", "$medications.price"] } }
      }
    },
    {
      $lookup: {
        from: "medications",
        localField: "_id",
        foreignField: "_id",
        as: "medication"
      }
    },
    { $unwind: "$medication" },
    {
      $project: {
        _id: 1,
        totalQuantity: 1,
        totalRevenue: 1,
        medicationName: "$medication.name"
      }
    }
  ]);
};

exports.getMonthlySales = async () => {
  return await Prescription.aggregate([
    { $unwind: "$medications" },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          medication_id: "$medications.medication_id"
        },
        totalQuantity: { $sum: "$medications.quantity" },
        totalRevenue: { $sum: { $multiply: ["$medications.quantity", "$medications.price"] } }
      }
    },
    {
      $lookup: {
        from: "medications",
        localField: "_id.medication_id",
        foreignField: "_id",
        as: "medication"
      }
    },
    { $unwind: "$medication" },
    {
      $project: {
        _id: 1,
        totalQuantity: 1,
        totalRevenue: 1,
        medicationName: "$medication.name"
      }
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1
      }
    }
  ]);
};

exports.getDailySales = async (medicationId) => {
  const medicationObjectId = mongoose.Types.ObjectId(medicationId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await Prescription.aggregate([
    { $match: { createdAt: { $gte: today }, "medications.medication_id": medicationObjectId } },
    { $unwind: "$medications" },
    { $match: { "medications.medication_id": medicationObjectId } },
    {
      $group: {
        _id: "$medications.medication_id",
        totalQuantity: { $sum: "$medications.quantity" },
        totalRevenue: { $sum: { $multiply: ["$medications.quantity", "$medications.price"] } }
      }
    },
    {
      $lookup: {
        from: "medications",
        localField: "_id",
        foreignField: "_id",
        as: "medication"
      }
    },
    { $unwind: "$medication" },
    {
      $project: {
        _id: 1,
        totalQuantity: 1,
        totalRevenue: 1,
        medicationName: "$medication.name"
      }
    }
  ]);
};

exports.getYearlySales = async (year) => {
  return await Prescription.aggregate([
    { $unwind: "$medications" },
    {
      $match: {
        $expr: {
          $eq: [{ $year: "$createdAt" }, year]
        }
      }
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" } },
        totalQuantity: { $sum: "$medications.quantity" },
        totalRevenue: { $sum: { $multiply: ["$medications.quantity", "$medications.price"] } }
      }
    },
    {
      $sort: {
        "_id.month": 1
      }
    }
  ]);
};

exports.getMonthlyRevenue = async (year) => {
  return await Prescription.aggregate([
    { $unwind: "$medications" },
    {
      $match: {
        $expr: {
          $eq: [{ $year: "$createdAt" }, year]
        }
      }
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" } },
        totalRevenue: { $sum: { $multiply: ["$medications.quantity", "$medications.price"] } }
      }
    },
    {
      $sort: {
        "_id.month": 1
      }
    }
  ]);
};