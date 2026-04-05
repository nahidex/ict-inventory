import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, branchId, designation } = req.body;

    if (!name || !email || !password || !branchId) {
      res.status(400).json({ message: "Please provide all required fields (name, email, password, branchId)" });
      return;
    }

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      res.status(400).json({ message: "User already exists with this email" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await (prisma as any).$transaction(async (tx: any) => {
      // 1. Create User
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "USER",
        },
      });

      // 2. Create Officer record (Linked to User, set to Inactive)
      const officer = await tx.officer.create({
        data: {
          name,
          email,
          designation: designation || "New User",
          isActive: false, // Set to inactive by default
          branchId: parseInt(branchId),
          userId: user.id,
        },
      });

      return { user, officer };
    });

    res.status(201).json({
      message: "Registration successful. Please wait for admin approval.",
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        officerId: result.officer.id
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUnlinkedOfficers = async (req: Request, res: Response): Promise<void> => {
  try {
    const officers = await prisma.officer.findMany({
      where: {
        userId: null,
      },
      select: {
        id: true,
        name: true,
        designation: true,
      },
    });
    res.status(200).json(officers);
  } catch (error) {
    console.error("GetUnlinkedOfficers error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Please provide email and password" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { 
        officer: {
          select: {
            id: true,
            isActive: true,
            branchId: true
          }
        } 
      }
    });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Check if account is active (for non-admin roles)
    if (user.role !== 'ADMIN' && user.officer && !user.officer.isActive) {
      res.status(403).json({ message: "আপনার একাউন্টটি বর্তমানে নিষ্ক্রিয় অবস্থায় আছে। দয়া করে অ্যাডমিনের সাথে যোগাযোগ করুন।" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        officerId: user.officer?.id || null,
        branchId: user.officer?.branchId || null
      },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        officerId: user.officer?.id || null
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // In a stateless JWT implementation, we simply return success.
    // Client-side, the token should be deleted.
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
