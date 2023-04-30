import Crop from "../models/cropModel.js";
import asyncHandler from "express-async-handler";

// @desc    Fetch all crops
// @route   GET /api/crops
// @access  Public
const getCrops = asyncHandler(async (req, res) => {
    try{
        const crops = await Crop.find({});
        res.json(crops);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

// @desc    Fetch single crop
// @route   GET /api/crops/:id
// @access  Public
const getCropById = asyncHandler(async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.id);
        if (crop) {
            res.json(crop);
        } else {
            res.status(404);
            throw new Error("Crop not found");
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a crop
// @route   DELETE /api/crops/:id
// @access  Private/Admin
const deleteCrop = asyncHandler(async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.id);
        if (crop) {
            await crop.remove();
            res.json({ message: "Crop removed" });
        } else {
            res.status(404);
            throw new Error("Crop not found");
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

// @desc    Create a crop
// @route   POST /api/crops
// @access  Private/Admin
const createCrop = asyncHandler(async (req, res) => {
    try {
        const {
            cropName,
            scientificName,
            cropFamily,
            cropType,
            cropIntro,
            cropImage,
            cropInfo,
            otherInfo,
        } = req.body;
    
        const crop = new Crop({
            cropName,
            scientificName,
            cropFamily,
            cropType,
            cropIntro,
            cropImage,
            cropInfo,
            otherInfo,
            author: req.user._id,
        });

        const createdCrop = await crop.save();

        res.status(201).json(createdCrop);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update a crop
// @route   PUT /api/crops/:id
// @access  Private/Admin
const updateCrop = asyncHandler(async (req, res) => {
    try {
        const {
            cropName,
            scientificName,
            cropFamily,
            cropType,
            cropIntro,
            cropImage,
            cropInfo,
            otherInfo,
        } = req.body;
    
        const crop = await Crop.findById(req.params.id);

        if (crop) {
            crop.cropName = cropName;
            crop.scientificName = scientificName;
            crop.cropFamily = cropFamily;
            crop.cropType = cropType;
            crop.cropIntro = cropIntro;
            crop.cropImage = cropImage;
            crop.cropInfo = cropInfo;
            crop.otherInfo = otherInfo;

            const updatedCrop = await crop.save();
            res.json(updatedCrop);
        } else {
            res.status(404);
            throw new Error("Crop not found");
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

// @desc    search crops
// @route   GET /api/crops/search
// @access  Public
const searchCrops = asyncHandler(async (req, res) => {
    try {
        const crops = await Crop.find({ cropName: { $regex: req.query.q, $options: "i" } });
        res.json(crops);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

export { getCrops, getCropById, deleteCrop, createCrop, updateCrop, searchCrops };