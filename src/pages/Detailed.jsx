import { Box, Grid, LinearProgress, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  useDeleteImageForReviewerMutation,
  useGetDashboardQuery,
} from "../services/reviewer";
import { toast } from "react-toastify";
import { DETAILED_STYLE } from "../style";

const StandardImageList = ({
  userId = "",
  navigate,
  images = [],
  handleDeleteImage = () => {},
}) => {
  const { container, imageBox, image, iconStack, deleteIcon } =
    DETAILED_STYLE || {};
  return (
    <Grid container spacing={2} maxWidth={1920} sx={container}>
      {images?.map((item, index) => (
        <Grid item key={index} xs={3} xl={2.4}>
          <Box sx={imageBox}>
            <Box
              component="img"
              src={item?.photo_url}
              alt={`${item?.photo_id}`}
              loading="lazy"
              onClick={() => navigate(`/user/${userId}/${item?.photo_id}`)}
              sx={image}
            />
            <Stack direction={"row"} spacing={1} sx={iconStack}>
              <HighlightOffIcon
                onClick={() => handleDeleteImage(item?.photo_id)}
                sx={deleteIcon}
              />
            </Stack>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

const Detailed = () => {
  const [deleteImage, { isLoading: deleteLoading }] =
    useDeleteImageForReviewerMutation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, refetch, isLoading } = useGetDashboardQuery();

  const users = data?.data || [
    {
      photo_id: 1,
      photo_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuNhTZJTtkR6b-ADMhmzPvVwaLuLdz273wvQ&s",
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

  const userImages = users?.filter(
    (item) => item?.user?.user_id === Number(id)
  );

  const handleDeleteImage = async (id) => {
    try {
      const res = await deleteImage({ id }).unwrap();
      if (res?.data) {
        toast.success("Image deleted successfully!");
        refetch();
      }
    } catch (err) {
      toast.error("Image delete failed!");
      console.error(err);
    }
  };

  if (isLoading || deleteLoading) {
    return <LinearProgress />;
  }

  return (
    <Stack spacing={2}>
      <Stack>
        <Typography variant="h5" fontWeight={600} mb={3}>
          Images
        </Typography>
      </Stack>
      {userImages?.length > 0 ? (
        <StandardImageList
          userId={id}
          navigate={navigate}
          images={userImages}
          handleDeleteImage={handleDeleteImage}
        />
      ) : (
        <Typography variant="body2">Images not found!</Typography>
      )}
    </Stack>
  );
};

export default Detailed;
