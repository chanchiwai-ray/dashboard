"use strict";

export const columns = [
  {
    field: "amount",
    headerName: "Amount",
    width: 150,
  },
  {
    field: "category",
    headerName: "Category",
    width: 150,
  },
  {
    field: "description",
    headerName: "Description",
    width: 160,
  },
  {
    field: "date",
    headerName: "Date",
    width: 150,
  },
];

export const categoryFields = [
  {
    id: 1,
    type: "text",
    name: "label",
    label: "Category",
    required: true,
    default: "",
  },
];

export const accountFields = [
  {
    id: 1,
    type: "text",
    name: "bankName",
    label: "Bank Name",
    required: true,
    default: "",
  },
  {
    id: 2,
    type: "text",
    name: "accountNumber",
    label: "Account Number",
    required: true,
    default: "",
  },
  {
    id: 3,
    type: "number",
    name: "accountBalance",
    label: "Account Balance",
    required: false,
    default: 0,
  },
];

export const recordFields = [
  {
    id: 1,
    name: "amount",
    type: "number",
    label: "Amount",
    required: true,
    default: 0,
  },
  {
    id: 2,
    as: "select",
    name: "category",
    type: "text",
    label: "Category",
    choices: [],
    required: true,
  },
  {
    id: 4,
    type: "text",
    name: "description",
    label: "Description",
    required: false,
    default: "",
  },
  {
    id: 5,
    type: "date",
    name: "date",
    label: "Date",
    required: false,
    default: Date.now(),
  },
];
