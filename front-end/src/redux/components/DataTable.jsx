import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import DataTable from "../../components/DataTable/DataTable.jsx";

import { columns } from "../../configs.jsx";
import { getRecords } from "../slices/finance/records.js";
import { selectRecords, selectAuth } from "../app/store.js";

export default (props) => {
  const auth = useSelector(selectAuth);
  const records = useSelector(selectRecords);
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.value.userId) {
      dispatch(
        getRecords({
          userId: auth.value.userId,
        })
      );
    }
  }, []);

  return (
    <DataTable
      rows={records.value.records}
      columns={columns}
      selectedRowIds={props.selectedRowIds}
      setSelectedRowIds={(ids) => props.setSelectedRowIds(new Set(ids))}
    />
  );
};
