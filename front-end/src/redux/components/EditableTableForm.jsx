import React from "react";
import { useSelector } from "react-redux";

import { selectRecords } from "../app/store.js";
import EditableTableForm from "../../components/EditableTableForm/EditableTableForm.jsx";

export default (props) => {
  const records = useSelector(selectRecords);

  return (
    <EditableTableForm
      title={props.title}
      size={props.size}
      show={props.show}
      rows={records.value.records.filter((record) => props.selectedRowIds.has(record._id))}
      fields={props.fields}
      onHide={() => props.onHide()}
      onUpdate={(id, data) => props.onUpdate(id, data)}
    />
  );
};
