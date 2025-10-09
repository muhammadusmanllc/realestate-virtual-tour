import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ error: "Token missing" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

// Add a new property
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, description, price, location, images } = req.body;

    const property = await prisma.property.create({
      data: {
        title,
        description,
        price,
        location,
        images: JSON.stringify(images), // array of URLs
        ownerId: req.user.id,
      },
    });

    res.json({ message: "Property added", property });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all properties
router.get("/", async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      include: { owner: true },
    });
    res.json(properties);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get single property
router.get("/:id", async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { owner: true },
    });

    if (!property) return res.status(404).json({ error: "Property not found" });
    res.json(property);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a property
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!property) return res.status(404).json({ error: "Property not found" });
    if (property.ownerId !== req.user.id)
      return res.status(403).json({ error: "Not authorized" });

    const updatedProperty = await prisma.property.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });

    res.json({ message: "Property updated", updatedProperty });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a property
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!property) return res.status(404).json({ error: "Property not found" });
    if (property.ownerId !== req.user.id)
      return res.status(403).json({ error: "Not authorized" });

    await prisma.property.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Property deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;