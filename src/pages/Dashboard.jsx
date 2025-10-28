import { Box, LinearProgress, Typography } from "@mui/material";
import DynamicTable from "../components/DynamicTable";
import {
  useCreateVideoMutation,
  useGetDashboardQuery,
  useUpdatePhotoStatusMutation,
} from "../services/reviewer";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DashboardPage = () => {
  const [updatePhotoStatus, { isLoading: isUpdating }] =
    useUpdatePhotoStatusMutation();
  const [createVideo, { isLoading: videoLoading }] = useCreateVideoMutation();
  const navigate = useNavigate();
  const { data, isLoading: isUsersLoading } = useGetDashboardQuery();
  const users = data?.data || [
    {
      photo_id: 97,
      photo_url: `https://espark-nfc-project.s3.amazonaws.com/Sajid_Ashraf_20251024195912511670.jpg?AWSAccessKeyId=AKIAXW5OGZH2FVQHOXV2&Signature=RQl%2FOYPK0erfDObxOfeyDWY8G8I%3D&Expires=1792871952%22`,
      filename: "Sajid_Ashraf_20251024195912511670.jpg",
      status: "pending",
      created_at: "2025-10-24T19:59:12.928976",
      updated_at: "2025-10-24T19:59:12.928976",
      user: {
        user_id: 26,
        first_name: "Ashraf",
        last_name: "Sajid",
        email: "ashraf.sajid@gmail.com",
        phone: "02837594712",
      },
    },
    {
      photo_id: 38,
      photo_url:
        "https://espark-nfc-project.s3.amazonaws.com/user_testing_20251024103035256156.jpg?AWSAccessKeyId=AKIAXW5OGZH2FVQHOXV2&Signature=YDLZb4EHmeJs1cIEVRs1uYh4oXk%3D&Expires=1792837838%22",
      filename: "user_testing_20251024103035256156.jpg",
      status: "pending",
      created_at: "2025-10-24T10:30:38.110377",
      updated_at: "2025-10-24T10:30:38.110377",
      user: {
        user_id: 10,
        first_name: "testing",
        last_name: "user",
        email: "test.user@gmail.com",
        phone: "03827592712",
      },
    },
    {
      photo_id: 1,
      photo_url:
        "https://espark-nfc-project.s3.amazonaws.com/Khan_Ali_20251022104041056402.jpg?AWSAccessKeyId=AKIAXW5OGZH2FVQHOXV2&Signature=eZzCsOME6S9MkDW2kAvizN2RTOE%3D&Expires=1792665644%22",
      filename: "Khan_Ali_20251022104041056402.jpg",
      status: "pending",
      created_at: "2025-10-22T10:42:01.990268",
      updated_at: "2025-10-22T10:42:01.990268",
      user: {
        user_id: 2,
        first_name: "Ali",
        last_name: "Khan",
        email: "ali1234@gmail.com",
        phone: "05832919284",
      },
    },
  ];

  const tableData = users?.map(({ status, user }) => ({
    id: user?.user_id,
    name: user?.first_name,
    email: user?.email,
    phone: user?.phone,
    status: status,
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
      toast.error("Status update failed! Please try again.");
    }
  };

  const handleCreateVideo = async (data) => {
    const { images } = data || {};
    try {
      const photo_ids = images?.map((img) => img?.photo_id);

      if (!photo_ids.length) {
        toast.info("No images to submit");
        return;
      }

      const payload = { photo_ids };

      const res = await createVideo({ body: payload }).unwrap();

      if (res) {
        toast.success(`Video created successfully`);
        console.log("Server Response:", res.data);
      }
    } catch (err) {
      console.error("Video failed:", err);
      toast.error("Video creation failed!");
    }
  };

  const handleClickAction = (text, data) => {
    console.log(text, data);
    if (text === "view") {
      navigate(`/user/${data?.id}`);
    } else if (text === "edit") {
      handleCreateVideo(data);
    }
  };

  if (isUsersLoading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Users
      </Typography>
      <Box my={3}>
        <DynamicTable
          rows={tableData}
          columns={tableColumns}
          onStatusChange={handleStatusChange}
          onClick={handleClickAction}
        />
      </Box>
    </Box>
  );
};

export default DashboardPage;
