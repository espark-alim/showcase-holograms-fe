import { Box, Grid, Typography, Card } from "@mui/material";

import DynamicTable from "../components/DynamicTable";
import { useUpdatePhotoStatusMutation } from "../services/reviewer";

const DashboardPage = () => {
  const {
    data: users = [
      {
        id: 1,
        name: "John Doe",
        email: "john@company.com",
        phone: "+123456789",
        status: "Approved",
      },
      {
        id: 2,
        name: "Alex Doe",
        email: "alex@company.com",
        phone: "+123456789",
        status: "Approved",
      },
    ],
    isLoading: isUsersLoading,
  } = {};

  const [updatePhotoStatus, { isLoading: isUpdating }] =
    useUpdatePhotoStatusMutation();

  const tableData = users?.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    status: u.status,
  }));

  const tableColumns = [
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone Number" },
    { id: "status", label: "Status" },
  ];

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updatePhotoStatus({
        id,
        data: { status: newStatus.toLowerCase() },
      }).unwrap();

      console.log(`✅ Status of user ${id} updated to ${newStatus}`);
    } catch (err) {
      console.error("❌ Failed to update:", err);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Users
      </Typography>

      {/* Dynamic Table */}
      <Box my={3}>
        <DynamicTable
          rows={tableData}
          columns={tableColumns}
          onStatusChange={handleStatusChange}
        />
      </Box>
    </Box>
  );
};

export default DashboardPage;
