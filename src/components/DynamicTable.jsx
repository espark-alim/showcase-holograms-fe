import { DataGrid } from "@mui/x-data-grid";
import { Box, IconButton, MenuItem, Select } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import SlowMotionVideoIcon from "@mui/icons-material/SlowMotionVideo";

const STATUS_OPTIONS = ["Pending", "Approved", "Rejected"];

const DynamicDataGrid = ({ rows, columns, onStatusChange }) => {
  const enhancedColumns = [
    ...columns.map((col) => ({
      field: col.id,
      headerName: col.label,
      flex: 1,
      minWidth: 150,
      sortable: false,
      filterable: false,
      renderCell:
        col.id === "status"
          ? (params) => (
              <Select
                size="small"
                value={params.value}
                onChange={(e) => onStatusChange(params.row.id, e.target.value)}
                sx={{ width: "100%", fontSize: 14 }}
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            )
          : undefined,
    })),
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 160,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => console.log("View", params.row)}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            color="warning"
            onClick={() => console.log("Edit", params.row)}
          >
            <SlowMotionVideoIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => console.log("Delete", params.row)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        maxheight: "80vh",
        width: "100%",
        "& .MuiDataGrid-root": {
          border: "none", // Grid ka border remove
        },
        "& .MuiDataGrid-columnHeaderTitleContainer": {
          justifyContent: "center !important",
          fontWeight: 600,
        },
        "& .MuiDataGrid-columnHeaderTitle": {
          textAlign: "center !important",
          width: "100%",
        },
        "& .MuiDataGrid-cell": {
          textAlign: "center !important",
        },
        "& .MuiDataGrid-row": {
          borderBottom: "none !important",
          borderRadius: "6px",
          backgroundColor: "#fff",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "scale(1.01)",
            backgroundColor: "#fff !important",
            boxShadow: "inset 0px 8px 25px hsla(220, 50%, 10%, 0.09)",
          },
        },
        "& .MuiDataGrid-main": {
          backgroundColor: "#fff",
        },

        "& .MuiDataGrid-row.Mui-selected": {
          backgroundColor: "transparent !important",
          boxShadow: "inset 0px 8px 25px hsla(220, 50%, 10%, 0.09)",
        },
        "& .MuiDataGrid-row.Mui-selected:hover": {
          backgroundColor: "transparent !important",
          boxShadow: "inset 0px 8px 25px hsla(220, 50%, 10%, 0.09)",
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={enhancedColumns}
        disableColumnFilter
        disableColumnMenu
        disableSelectionOnClick
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        getRowId={(row) => row.id}
      />
    </Box>
  );
};

export default DynamicDataGrid;
