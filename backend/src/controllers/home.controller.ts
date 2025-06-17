// controllers/home.controller.ts
import { Request, Response } from 'express';
import Pharmacy from '../models/pharmacy.js';

export const getNearbyPharmacies = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.query;

    let pharmacies;

    if (latitude && longitude) {
      const lat = parseFloat(latitude as string);
      const lng = parseFloat(longitude as string);

      pharmacies = await Pharmacy.find({
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [lng, lat] },
            $maxDistance: 5000, // 5 km radius
          },
        },
      });
    } else {
       res.status(400).json({ message: 'Please provide coordinates.' });
       return
    }

    res.status(200).json({ pharmacies });
  } catch (err) {
    console.error('Error fetching pharmacies:', err);
    res.status(500).json({ message: 'Failed to fetch pharmacies' });
  }
};
