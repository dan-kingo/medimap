// controllers/medicine.controller.ts
import { Request, Response } from 'express';
import Medicine from '../models/medicine.js';
import Pharmacy from '../models/pharmacy.js';
import { createNotification } from '../utils/notification.js';
import asyncHandler from 'express-async-handler';
export const searchMedicines = async (req: Request, res: Response) => {
  const { query, latitude, longitude, delivery, sort } = req.query as {
    query?: string;
    latitude?: string;
    longitude?: string;
    delivery?: string;
    sort?: string; // 'price_asc', 'price_desc', etc.
  };

  try {
    const medicineFilter = query
      ? { name: { $regex: new RegExp(query, 'i') } }
      : {};

    const medicines = await Medicine.find({
      ...medicineFilter,
      quantity: { $gt: 0 },
      outOfStock: false
    })
      .select('_id name type strength price quantity')
      .populate({
        path: 'pharmacy',
        select: 'name city deliveryAvailable location rating',
        model: Pharmacy,
      });

    let results = medicines
      .filter((medicine) => {
        const pharmacy = medicine.pharmacy as any;
        return !delivery || (pharmacy?.deliveryAvailable === true);
      })
      .map((medicine) => {
        const pharmacy = medicine.pharmacy as any;
        let distance: number | null = null;

        if (latitude && longitude && pharmacy?.location?.coordinates) {
          const [lng1, lat1] = pharmacy.location.coordinates;
          const lat2 = parseFloat(latitude);
          const lng2 = parseFloat(longitude);

          const toRad = (deg: number) => (deg * Math.PI) / 180;
          const R = 6371;
          const dLat = toRad(lat2 - lat1);
          const dLng = toRad(lng2 - lng1);
          const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) *
              Math.cos(toRad(lat2)) *
              Math.sin(dLng / 2) ** 2;
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          distance = R * c;
        }

        return {
          medicine: {
            _id: medicine._id,
            name: medicine.name,
            strength: medicine.strength,
            type: medicine.type,
            unit: medicine.unit
          },
          price: medicine.price,
          pharmacy: {
            name: pharmacy.name,
            city: pharmacy.city,
            deliveryAvailable: pharmacy.deliveryAvailable,
            rating: pharmacy.rating ?? null,
            distance: distance ?? null,
          },
          available: medicine.quantity > 0,
        };
      });

    // Sorting
    if (sort === 'price_asc') {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      results.sort((a, b) => b.price - a.price);
    } else if (latitude && longitude) {
      results.sort((a, b) => {
        const distA = a.pharmacy.distance ?? 99999;
        const distB = b.pharmacy.distance ?? 99999;
        return distA - distB;
      });
    }

    return res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    return res.status(500).json({ message: 'Failed to search medicines' });
  }
};

export const getPopularMedicines = async (_req: Request, res: Response) => {
  try {
    const popular = await Medicine.aggregate([
      {
        $match: { 
          quantity: { $gt: 0 },
          outOfStock: false
        }
      },
      {
        $sort: { quantity: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          _id: 1,
          name: 1,
          strength: 1,
          type: 1,
          unit: 1,
          quantity: 1,
          price: 1,
          pharmacy: {
            _id: 1,
            name: 1,
            city: 1,
            deliveryAvailable: 1,
            rating: 1,
            location: 1
          }
        }
      }
    ]);

    return res.status(200).json(popular);
  } catch (err) {
    console.error('Error fetching popular medicines:', err);
    return res.status(500).json({ message: 'Failed to fetch popular medicines' });
  }
};

export const getMedicinesByPharmacy = asyncHandler(async (req: Request, res: Response) => {
  const { pharmacyId } = req.params;

  const medicines = await Medicine.find({ pharmacy: pharmacyId })
    .populate('pharmacy', 'name city deliveryAvailable rating description location _id')
    .sort({ name: 1 });

  if (!medicines || medicines.length === 0) {
    res.status(404);
    throw new Error('No medicines found for this pharmacy');
  }

  res.status(200).json(medicines);
});


export const getMedicineDetails = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const medicine = await Medicine.findById(id)
      .select('-__v -createdAt -updatedAt')
      .populate({
        path: 'pharmacy',
        select: 'name phone email address city deliveryAvailable rating location',
      });

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    return res.status(200).json(medicine);
  } catch (error) {
    console.error('Error fetching medicine details:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const addMedicine = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const pharmacy = await Pharmacy.findOne({ user: userId });

    if (!pharmacy) {
      return res.status(404).json({ error: "Pharmacy not found for this user." });
    }

    const {
      name,
      strength,
      unit = '',
      type,
      description,
      requiresPrescription = false,
      price,
      quantity,
    } = req.body;

    const outOfStock = quantity <= 0;

    const newMedicine = await Medicine.create({
      name,
      strength,
      unit,
      type,
      description,
      requiresPrescription,
      price,
      quantity,
      outOfStock,
      pharmacy: pharmacy._id,
    });

    if (quantity < 5) {
      await createNotification({
        userId: userId!,
        message: `Low stock alert for ${newMedicine.name}. Only ${quantity} left.`,
        type: 'in-app',
      });
    }

    return res.status(201).json({ 
      message: 'Medicine added successfully',
      medicine: {
        _id: newMedicine._id,
        name: newMedicine.name,
        strength: newMedicine.strength,
        unit: newMedicine.unit,
        type: newMedicine.type,
        description: newMedicine.description,
        requiresPrescription: newMedicine.requiresPrescription,
        price: newMedicine.price,
        quantity: newMedicine.quantity,
        outOfStock: newMedicine.outOfStock,
        pharmacy: newMedicine.pharmacy
      }
    });
  } catch (error) {
    console.error('Add medicine error:', error);
    return res.status(500).json({ error: 'Failed to add medicine' });
  }
};

export const updateMedicine = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const pharmacy = await Pharmacy.findOne({ user: userId });
    const medicineId = req.params.id;
    const updates = req.body;

    if (updates.quantity !== undefined) {
      updates.outOfStock = updates.quantity <= 0;
    }

    const updatedMedicine = await Medicine.findOneAndUpdate(
      { _id: medicineId, pharmacy: pharmacy?._id },
      updates,
      { new: true, runValidators: true }
    ).select('-__v -createdAt -updatedAt');

    if (!updatedMedicine) {
      return res.status(404).json({ error: 'Medicine not found or not owned by your pharmacy' });
    }

    // Check if we need to send low stock notification
    if (updates.quantity !== undefined && updates.quantity < 5) {
      await createNotification({
        userId: userId!,
        message: `Low stock alert for ${updatedMedicine.name}. Only ${updatedMedicine.quantity} left.`,
        type: 'in-app',
      });
    }

    return res.json({ 
      message: 'Medicine updated successfully',
      medicine: updatedMedicine
    });
  } catch (error) {
    console.error('Update medicine error:', error);
    return res.status(500).json({ error: 'Failed to update medicine' });
  }
};

export const deleteMedicine = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const pharmacy = await Pharmacy.findOne({ user: userId });
    const medicineId = req.params.id;

    const deletedMedicine = await Medicine.findOneAndDelete({
      _id: medicineId,
      pharmacy: pharmacy?._id,
    });

    if (!deletedMedicine) {
      return res.status(404).json({ error: 'Medicine not found or not owned by your pharmacy' });
    }

    return res.json({ 
      message: 'Medicine deleted successfully',
      medicineId: deletedMedicine._id
    });
  } catch (error) {
    console.error('Delete medicine error:', error);
    return res.status(500).json({ error: 'Failed to delete medicine' });
  }
};

export const markOutOfStock = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const pharmacy = await Pharmacy.findOne({ user: userId });
    const medicineId = req.params.id;

    const medicine = await Medicine.findOneAndUpdate(
      { _id: medicineId, pharmacy: pharmacy?._id },
      { outOfStock: true, quantity: 0 },
      { new: true }
    ).select('-__v -createdAt -updatedAt');

    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found or not owned by your pharmacy' });
    }

    return res.json({ 
      message: 'Medicine marked as out of stock',
      medicine
    });
  } catch (error) {
    console.error('Mark out of stock error:', error);
    return res.status(500).json({ error: 'Failed to update medicine status' });
  }
};

export const getMedicines = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const pharmacy = await Pharmacy.findOne({ user: userId });

    const medicines = await Medicine.find({ pharmacy: pharmacy?._id })
      .select('-__v -createdAt -updatedAt')
      .sort({ createdAt: -1 });

    return res.json({ 
      count: medicines.length,
      medicines 
    });
  } catch (error) {
    console.error('Get medicines error:', error);
    return res.status(500).json({ error: 'Failed to get medicines' });
  }
};