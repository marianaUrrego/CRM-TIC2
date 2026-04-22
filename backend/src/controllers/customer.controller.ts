import { Request, Response } from "express";
import { CustomerService } from "../services/customer.service";
import type { CustomerStatus } from "../models/customer.model";

type AuthRequest = Request & {
  user?: {
    id: string;
    email?: string;
    name?: string;
  };
};

export const CustomerController = {
  async getAll(req: AuthRequest, res: Response) {
    try {
      const ownerUserId = req.user?.id;

      if (!ownerUserId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const customers = await CustomerService.getAllByOwner(ownerUserId);
      return res.status(200).json(customers);
    } catch (error) {
      console.error("Error getting customers:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async create(req: AuthRequest, res: Response) {
    try {
      const ownerUserId = req.user?.id;

      if (!ownerUserId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const {
        full_name,
        email,
        phone_number,
        company,
        status,
        country,
        address,
      } = req.body;

      if (
        !full_name ||
        !email ||
        !phone_number ||
        !company ||
        !status ||
        !country ||
        !address
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newCustomer = await CustomerService.create({
        owner_user_id: ownerUserId,
        full_name,
        email,
        phone_number,
        company,
        status,
        country,
        address,
      });

      return res.status(201).json(newCustomer);
    } catch (error) {
      console.error("Error creating customer:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async delete(req: AuthRequest, res: Response) {
    try {
      const ownerUserId = req.user?.id;
      const id = String(req.params.id);

      if (!ownerUserId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const deletedCustomer = await CustomerService.delete(id, ownerUserId);

      if (!deletedCustomer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      return res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
      console.error("Error deleting customer:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async updateStatus(req: AuthRequest, res: Response) {
    try {
      const ownerUserId = req.user?.id;
      const id = String(req.params.id);
      const { status } = req.body as { status: CustomerStatus };

      if (!ownerUserId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const updatedCustomer = await CustomerService.updateStatus(
        id,
        ownerUserId,
        status
      );

      if (!updatedCustomer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      return res.status(200).json(updatedCustomer);
    } catch (error) {
      console.error("Error updating customer status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  async update(req: AuthRequest, res: Response) {
    try {
      const ownerUserId = req.user?.id;
      const id = String(req.params.id);

      if (!ownerUserId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const {
        full_name,
        email,
        phone_number,
        company,
        status,
        country,
        address,
      } = req.body;

      const updatedCustomer = await CustomerService.update(
        id,
        ownerUserId,
        {
          full_name,
          email,
          phone_number,
          company,
          status,
          country,
          address,
        }
      );

      if (!updatedCustomer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      return res.status(200).json(updatedCustomer);
    } catch (error) {
      console.error("Error updating customer:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};