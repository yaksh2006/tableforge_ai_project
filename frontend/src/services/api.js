import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const getTables = () => axios.get(`${BASE_URL}/tables`);
export const getTableData = (name) =>
  axios.get(`${BASE_URL}/table/${name}`);

export const updateRow = (table, id, data) =>
  axios.put(`${BASE_URL}/update/${table}/${id}`, data);

export const insertRow = (table, data) =>
  axios.post(`${BASE_URL}/insert/${table}`, data);