import {
  Box,
  Button,
  CircularProgress,
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
import { IMAGES_STYLE } from "../style";

const StandardImageList = ({
  navigate,
  images = [],
  handleDeleteImage = () => {},
}) => {
  const { imageListContainer, imageBox, image, deleteIconStack, deleteIcon } =
    IMAGES_STYLE || {};
  return (
    <Box sx={imageListContainer(images?.length)}>
      {images?.map((item, index) => (
        <Box key={index} sx={imageBox}>
          <Box
            onClick={() => navigate(`/uploads/${item?.photo_id}`)}
            component="img"
            sx={image}
            src={item?.photo_url}
            alt={`${item?.photo_id}`}
            loading="lazy"
          />
          <Stack direction={"row"} spacing={1} sx={deleteIconStack}>
            <HighlightOffIcon
              onClick={() => handleDeleteImage(item?.photo_id)}
              sx={deleteIcon}
            />
          </Stack>
        </Box>
      ))}
    </Box>
  );
};

const Images = () => {
  const { container, innerStack, uploadButton, submitButton, scrollBox } =
    IMAGES_STYLE || {};
  const id = localStorage.getItem("accessToken");
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [deleteImage] = useDeleteImageMutation();
  const [submitImages, { isLoading: submitLoading }] =
    useSubmitImagesMutation();

  const { data, isLoading } = useGetImagesQuery({
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
    <Stack sx={container}>
      <Stack sx={innerStack}>
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
              sx={uploadButton}
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
              sx={submitButton}
            >
              Submit Photos
            </Button>
          </Stack>
        </Stack>

        <Box sx={scrollBox}>
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
