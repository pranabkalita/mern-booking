import { Request, Response } from "express";
import { validationResult } from "express-validator";
import cloudinary from "cloudinary";
import Hotel, { HotelType } from "../models/hotel";

export const create = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array(),
    });
  }

  try {
    const imageFiles = req.files as Express.Multer.File[];
    const newHotel: HotelType = req.body;

    // 1. Upload the images to cloudinary
    const uploadPromises = imageFiles.map(async (image) => {
      const b64 = Buffer.from(image.buffer).toString("base64");
      let dataURI = "data:" + image.mimetype + ";base64," + b64;

      const res = await cloudinary.v2.uploader.upload(dataURI);

      return res.url;
    });

    const imageUrls = await Promise.all(uploadPromises);

    // 2. if upload was successful then add the URLs to the new hotel
    newHotel.imageUrls = imageUrls;
    newHotel.lastUpdated = new Date();
    newHotel.userId = req.userId;

    // 3. save the new hotel in database
    const hotel = new Hotel(newHotel);
    await hotel.save();

    // 4. return 201 status
    res.status(201).send(hotel);
  } catch (error) {
    console.log("Error creating hotel: ", error);
    res.status(500).send({
      message: "Something went wrong.",
    });
  }
};
