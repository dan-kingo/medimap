// controllers/medicine.controller.ts
import { Request, Response } from 'express';
import Medicine from '../models/medicine.js';
import Inventory from '../models/inventory.js';
import Pharmacy from '../models/pharmacy.js';

export const searchMedicines = async (req: Request, res: Response) => {
  const { query, latitude, longitude, delivery } = req.query as {
    query?: string;
    latitude?: string;
    longitude?: string;
    delivery?: string;
  };

  try {
    const medicineFilter = query
      ? { name: { $regex: new RegExp(query, 'i') } }
      : {};

    const medicines = await Medicine.find(medicineFilter).select('_id name type strength');

    const medicineIds = medicines.map((m) => m._id);

    const inventory = await Inventory.find({
      medicine: { $in: medicineIds },
      stock: { $gt: 0 },
    })
      .populate('medicine', 'name strength type')
      .populate({
        path: 'pharmacy',
        select: 'name city deliveryAvailable location',
        model: Pharmacy,
      });

    let results = inventory
      .filter((inv) => {
        // Ensure pharmacy is populated and has deliveryAvailable property
        const pharmacy = inv.pharmacy as any;
        return !delivery || (pharmacy && typeof pharmacy === 'object' && 'deliveryAvailable' in pharmacy && pharmacy.deliveryAvailable);
      })
      .map((inv) => {
        const pharmacy = inv.pharmacy as any;
        let distance: number | null = null;

        if (latitude && longitude && pharmacy?.location?.coordinates) {
          const [lng1, lat1] = pharmacy.location.coordinates;
          const lat2 = parseFloat(latitude);
          const lng2 = parseFloat(longitude);

          // simple Haversine (approximate)
          const toRad = (deg: number) => (deg * Math.PI) / 180;
          const R = 6371; // km
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
          medicine: inv.medicine,
          price: inv.price,
          pharmacy: {
            name: pharmacy.name,
            city: pharmacy.city,
            deliveryAvailable: pharmacy.deliveryAvailable,
            distance: distance ? `${distance.toFixed(2)} km` : null,
          },
          available: inv.stock > 0,
        };
      });

    // optional sort by distance
    if (latitude && longitude) {
      results.sort((a, b) =>
        (a.pharmacy.distance || 9999) > (b.pharmacy.distance || 9999) ? 1 : -1
      );
    }

    res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Failed to search medicines' });
  }
};


export const getPopularMedicines = async (_req: Request, res: Response) => {
  try {
    const popular = await Inventory.aggregate([
      {
        $group: {
          _id: '$medicine',
          totalQuantity: { $sum: '$quantity' },
        },
      },
      {
        $sort: { totalQuantity: -1 },
      },
      {
        $limit: 10,
      },
      { 
        $lookup: {
          from: 'medicines',
          localField: '_id',
          foreignField: '_id',
          as: 'medicine',
        },
      },
      {
        $unwind: '$medicine',
      },
      {
        $project: {
          _id: '$medicine._id',
          name: '$medicine.name',
          strength: '$medicine.strength',
          type: '$medicine.type',
          totalQuantity: 1,
        },
      },
    ]);

    res.status(200).json(popular);
  } catch (err) {
    console.error('Error fetching popular medicines:', err);
    res.status(500).json({ message: 'Failed to fetch popular medicines' });
  }
};
