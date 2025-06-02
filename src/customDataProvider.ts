// src/customDataProvider.ts
import { DataProvider } from "@refinedev/core";
import qs from "query-string";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const customDataProvider: DataProvider = {
  getList: async ({
    resource,
    pagination = {},
    filters = [],
    sorters = [],
  }) => {
    const query: Record<string, any> = {};

    // Pagination
    query.page = pagination.current;
    query.limit = pagination.pageSize;

    // Filters
    filters.forEach(({ field, operator, value }) => {
      if (operator === "eq") {
        query[field] = value;
      }
      // Add more operators as needed
    });

    // Sorting
    if (sorters.length > 0) {
      const sorter = sorters[0];
      query.sort = `${sorter.order === "desc" ? "-" : ""}${sorter.field}`;
    }

    const url = `${API_URL}/${resource}?${qs.stringify(query)}`;
    const response = await fetch(url);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Error fetching list");
    }

    return {
      data: result.data.map((record: any) => ({
        id: record._id,
        ...record,
      })),
      total: result.total,
    };
  },
  getOne: async (resource, { id }) => {
    const response = await fetch(`${API_URL}/${resource}/${id}`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Error fetching record");
    }

    const record = result.data;

    return {
      data: {
        id: record._id, // <- this is the key part
        ...record,
      },
    };
  },

  create: async (resource, { variables }) => {
    const response = await fetch(`${API_URL}/${resource}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(variables),
    });
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Error creating record");
    }

    return {
      data: result.data,
    };
  },

  update: async (resource, { id, variables }) => {
    const response = await fetch(`${API_URL}/${resource}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(variables),
    });
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Error updating record");
    }

    return {
      data: result.data,
    };
  },

  deleteOne: async (resource, { id }) => {
    const response = await fetch(`${API_URL}/${resource}/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Error deleting record");
    }

    return {
      data: result.data,
    };
  },

  // Optional: implement `getMany`, `createMany`, etc. as needed
};
