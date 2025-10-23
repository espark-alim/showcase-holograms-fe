import { Box, Grid, Typography, Card } from "@mui/material";

import DynamicTable from "../components/DynamicTable";

const DashboardPage = () => {
  const tableData = [
    {
      id: 1,
      name: "John Doe",
      email: "john@company.com",
      phone: "+123456789",
      status: "Approved",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@company.com",
      phone: "+123456789",
      status: "Pending",
    },
    {
      id: 3,
      name: "Sam Wilson",
      email: "sam@company.com",
      phone: "+123456789",
      status: "Pending",
    },
  ];

  const tableColumns = [
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone Number" },
    { id: "status", label: "Status" },
  ];

  const COLORS = ["#0088FE", "#FFBB28"];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Users
      </Typography>

      {/* Dynamic Table */}
      <Box mt={3}>
        <DynamicTable rows={tableData} columns={tableColumns} />
      </Box>
    </Box>
  );
};

export default DashboardPage;
