import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90, hide: true },
  {
    field: 'functionName',
    headerName: 'Lambda Function Name',
    width: 250,
    editable: true,
  },
  {
    field: 'invocations',
    headerName: 'Invocations',
    type: 'number',
    width: 150,
    editable: true,
  },
  {
    field: 'throttles',
    headerName: 'Throttles',
    type: 'number',
    width: 150,
    editable: true,
  },
  {
    field: 'errors',
    headerName: 'Errors',
    type: 'number',
    width: 150,
    editable: true,
  },
];

export default function DataTable(props) {
  let rows = [];
  console.log(props);

  let invocationsArr = props.invocations.series.map(
    (funcData) => funcData.total
  );
  let throttlesArr = props.throttles.series.map((funcData) => funcData.total);
  let errorsArr = props.errors.series.map((funcData) => funcData.total);

  props.funcNames.forEach((func, index) => {
    let rowData = {
      id: index,
      functionName: func,
      invocations: invocationsArr[index],
      throttles: throttlesArr[index],
      errors: errorsArr[index],
    };
    rows.push(rowData);
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={20}
        disableSelectionOnClick
      />
    </div>
  );
}
