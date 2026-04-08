import { pool } from "../config/db";
import type { CreateCustomerDto, CustomerStatus } from "../models/customer.model";

export const CustomerService = {
  async getAllByOwner(ownerUserId: string) {
    const query = `
      SELECT
        id,
        owner_user_id,
        full_name,
        email,
        phone_number,
        company,
        status,
        country,
        address,
        created_at,
        updated_at
      FROM customers
      WHERE owner_user_id = $1
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [ownerUserId]);
    return result.rows;
  },

  async create(data: CreateCustomerDto) {
    const query = `
      INSERT INTO customers (
        owner_user_id,
        full_name,
        email,
        phone_number,
        company,
        status,
        country,
        address
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING
        id,
        owner_user_id,
        full_name,
        email,
        phone_number,
        company,
        status,
        country,
        address,
        created_at,
        updated_at
    `;

    const values = [
      data.owner_user_id,
      data.full_name,
      data.email,
      data.phone_number,
      data.company,
      data.status,
      data.country,
      data.address,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async delete(id: string, ownerUserId: string) {
    const query = `
      DELETE FROM customers
      WHERE id = $1 AND owner_user_id = $2
      RETURNING id
    `;

    const result = await pool.query(query, [id, ownerUserId]);
    return result.rows[0];
  },

  async updateStatus(id: string, ownerUserId: string, status: CustomerStatus) {
    const query = `
      UPDATE customers
      SET
        status = $1,
        updated_at = NOW()
      WHERE id = $2 AND owner_user_id = $3
      RETURNING
        id,
        owner_user_id,
        full_name,
        email,
        phone_number,
        company,
        status,
        country,
        address,
        created_at,
        updated_at
    `;

    const result = await pool.query(query, [status, id, ownerUserId]);
    return result.rows[0];
  },
};