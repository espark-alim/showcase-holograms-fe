import {
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useNavigate } from "react-router-dom";
import Guide from "../components/Guide";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import * as faceapi from "face-api.js";
import { useDeleteImageMutation, useGetImagesQuery } from "../services/image";
import { useSubmitImagesMutation } from "../services/processImage";
import { useDispatch } from "react-redux";
import { apiSlice } from "../api/apiSlice";

const StandardImageList = ({
  navigate,
  images = [],
  handleDeleteImage = () => {},
}) => {
  return (
    <Box
      sx={{
        px: 1.5,
        py: 1.5,
        rowGap: 0.5,
        columnGap: 1.2,
        display: "grid",
        maxWidth: "1080px",
        justifyContent: "center",
        gridTemplateColumns: {
          xs: `repeat(1, ${images.length < 5 ? "auto" : "1fr"})`,
          sm: `repeat(${Math.min(images.length, 2)}, ${
            images.length < 5 ? "auto" : "1fr"
          })`,
          md: `repeat(${Math.min(images.length, 3)}, ${
            images.length < 5 ? "auto" : "1fr"
          })`,
          lg: `repeat(${Math.min(images.length, 4)}, ${
            images.length < 5 ? "auto" : "1fr"
          })`,
          xl: `repeat(${Math.min(images.length, 5)}, ${
            images.length < 5 ? "auto" : "1fr"
          })`,
        },
      }}
    >
      {images?.map((item, index) => (
        <Box
          key={index}
          sx={{
            position: "relative",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.08)",
              boxShadow: "0 6px 12px rgba(12, 197, 219, 0.4)",
            },
          }}
        >
          <Box
            onClick={() => navigate(`/uploads/${item?.photo_id}`)}
            component="img"
            sx={{
              width: "243px",
              height: "228px",
              cursor: "pointer",
              objectFit: "contain",
              objectPosition: "center",
            }}
            src={item?.photo_url}
            alt={`${item?.photo_id}`}
            loading="lazy"
          />
          <Stack
            direction={"row"}
            spacing={1}
            sx={{
              position: "absolute",
              zIndex: 1,
              top: -2.5,
              right: -2.5,
              cursor: "pointer",
            }}
          >
            <HighlightOffIcon
              onClick={() => handleDeleteImage(item?.photo_id)}
              sx={{
                backgroundColor: "#fff",
                borderRadius: "50%",
                color: "primary.main",
                "&:hover": {
                  color: "red",
                },
              }}
            />
          </Stack>
        </Box>
      ))}
    </Box>
  );
};

const Images = () => {
  const id = localStorage.getItem("accessToken");
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [deleteImage, { isLoading: deleteLoading }] = useDeleteImageMutation();
  const [submitImages, { isLoading: submitLoading }] =
    useSubmitImagesMutation();

  const { data, isLoading, isError } = useGetImagesQuery({
    id: id,
  });

  const images = data?.data;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      ]);
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  const loadImage = (src) =>
    new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.src = src;
    });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!modelsLoaded) {
      toast.info("Please wait, face detection is loading...");
      return;
    }

    const imageURL = URL.createObjectURL(file);
    const img = await loadImage(imageURL);

    try {
      const detections = await faceapi.detectAllFaces(
        img,
        new faceapi.TinyFaceDetectorOptions()
      );

      if (detections.length === 0) {
        toast.error("No human face detected. Please try another photo.");
        return;
      }

      navigate("/uploads/image", { state: { file } });
    } catch (error) {
      console.error("Face detection failed:", error);
      toast.error("Error detecting face. Please try again.");
    } finally {
      URL.revokeObjectURL(imageURL);
    }
  };

  const handleDeleteImage = async (id) => {
    try {
      const res = await deleteImage({ id }).unwrap();
      if (res?.data) {
        toast.success("Image deleted successfully!");
        dispatch(apiSlice.util.invalidateTags(["Images"]));
      }
    } catch (err) {
      toast.error("Image delete failed!");
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    try {
      const photo_ids = images?.map((img) => img?.photo_id);

      if (!photo_ids?.length) {
        toast.info("No images to submit");
        return;
      }

      const payload = { photo_ids };
      const res = await submitImages({ id, body: payload }).unwrap();

      if (res) {
        toast.success(`Thank you! Your photos are submitted`);
        setTimeout(() => {
          toast.info(`We’ll email you when your holograms are ready`);
        }, 5000);
        console.log("Server Response:", res.data);
      }
    } catch (err) {
      console.error("Submit failed:", err);
      toast.error("Image submission failed!");
    }
  };

  return (
    <Stack
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
    >
      <Stack py={3.5} width="85%" maxWidth={1080} alignItems="center">
        <Stack spacing={1.5} alignItems="center">
          <Stack spacing={1} alignItems="center" textAlign="center">
            <Typography variant="h4" fontWeight={600}>
              {`Add your photos: (${images?.length}/30 uploaded)`}
            </Typography>
            <Typography variant="body2">
              Only upload clear, focused face photos.
            </Typography>
          </Stack>

          <Stack
            direction="row"
            justifyContent="center"
            spacing={{ xs: 1, sm: 1.5 }}
          >
            <Button
              variant="contained"
              color="accent"
              onClick={handleClick}
              sx={{
                borderRadius: "999px",
                textTransform: "none",
                boxShadow: "none",
                fontWeight: 600,
                fontSize: { xs: "12px", md: "16px" },
                px: { xs: 1.5, sm: 2.5 },
              }}
            >
              Upload Photos
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <Button
              variant="contained"
              onClick={handleSubmit}
              loading={submitLoading}
              sx={{
                borderRadius: "999px",
                textTransform: "none",
                boxShadow: "none",
                fontWeight: 600,
                fontSize: { xs: "12px", md: "16px" },
                px: { xs: 1.5, sm: 2.5 },
              }}
            >
              Submit Photos
            </Button>
          </Stack>
        </Stack>

        <Box
          sx={{
            mt: 1.5,
            p: 1,
            "&::-webkit-scrollbar": { width: "8px" },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
              borderRadius: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#0cc5db",
              borderRadius: "8px",
              transition: "background-color 0.3s",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#099fb3",
            },
            scrollbarWidth: "thin",
            scrollbarColor: "#0cc5db #f1f1f1",
          }}
        >
          {images?.length > 0 ? (
            <StandardImageList
              navigate={navigate}
              images={images}
              handleDeleteImage={handleDeleteImage}
            />
          ) : isLoading ? (
            <CircularProgress size={"30px"} />
          ) : (
            <Guide />
          )}
        </Box>
      </Stack>
    </Stack>
  );
};

export default Images;
