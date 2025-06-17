// controllers/medicine.controller.ts
import { Request, Response } from 'express';
import Medicine from '../models/medicine.js';
import Inventory from '../models/inventory.js';
import Pharmacy from '../models/pharmacy.js';

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

    const medicines = await Medicine.find(medicineFilter).select('_id name type strength');

    const medicineIds = medicines.map((m) => m._id);

    const inventory = await Inventory.find({
      medicine: { $in: medicineIds },
      stock: { $gt: 0 },
    })
      .populate('medicine', 'name strength type')
      .populate({
        path: 'pharmacy',
        select: 'name city deliveryAvailable location rating',
        model: Pharmacy,
      });

    let results = inventory
      .filter((inv) => {
        const pharmacy = inv.pharmacy as any;
        // Filter deliveryAvailable if delivery param is true
        return !delivery || (pharmacy?.deliveryAvailable === true);
      })
      .map((inv) => {
        const pharmacy = inv.pharmacy as any;
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
          medicine: inv.medicine,
          price: inv.price,
          pharmacy: {
            name: pharmacy.name,
            city: pharmacy.city,
            deliveryAvailable: pharmacy.deliveryAvailable,
            rating: pharmacy.rating ?? null,
            distance: distance ?? null,
          },
          available: inv.stock > 0,
        };
      });

    // 🧠 Sorting
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



export const getMedicineDetails = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const medicine = await Medicine.findById(id).populate({
      path: 'pharmacy',
      select: 'name phone email address city deliveryAvailable rating location',
    });

    if (!medicine) {
       res.status(404).json({ message: 'Medicine not found' });
       return
    }

    res.status(200).json(medicine);
  } catch (error) {
    console.error('Error fetching medicine details:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
