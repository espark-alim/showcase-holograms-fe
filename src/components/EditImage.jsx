import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Grid,
  Slider,
  Button,
  Stack,
  LinearProgress,
} from "@mui/material";
import Cropper from "react-easy-crop";
import * as faceapi from "face-api.js";
import Toolbar from "../components/Toolbar";
import Guide from "../components/Guide";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useEditImageMutation,
  useGetImageByIdQuery,
} from "../services/reviewer";

function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function getCroppedImg(imageSrc, croppedAreaPixels) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = Math.max(1, Math.floor(croppedAreaPixels.width));
  canvas.height = Math.max(1, Math.floor(croppedAreaPixels.height));

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve({ blob, url: URL.createObjectURL(blob) });
    }, "image/jpeg");
  });
}

const EditImage = () => {
  const [cropping, setCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const navigate = useNavigate();
  const { id, imageId } = useParams({});
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [editImage, { isLoading: upLoading }] = useEditImageMutation();
  const [image, setImage] = useState("");
  const location = useLocation();
  const { data, isLoading, isError } = useGetImageByIdQuery({
    id: imageId,
  });

  const imageData = data?.data || {
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
  };

  useEffect(() => {
    (async () => {
      try {
        const MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
      } catch (err) {
        console.error("Failed to load face-api models", err);
        toast.error("Failed to load face detection models");
      }
    })();
  }, []);

  const detectFacesInBlob = useCallback(async (blob) => {
    const img = await createImage(URL.createObjectURL(blob));
    const detections = await faceapi.detectAllFaces(
      img,
      new faceapi.TinyFaceDetectorOptions()
    );
    return detections.length > 0;
  }, []);

  const handleCrop = useCallback(async () => {
    try {
      if (!imageData?.photo_url) return;

      // crop result
      const { blob, url } = await getCroppedImg(
        imageData?.photo_url,
        croppedAreaPixels
      );

      // detect face in cropped result
      const hasFace = await detectFacesInBlob(blob);
      if (!hasFace) {
        toast.info("No face detected in cropped image.");
        return;
      }

      setCroppedImageUrl(url);
      setCropping(false);

      return { blob, url };
    } catch (err) {
      console.error("Crop error:", err);
      toast.error("Something went wrong while cropping");
    }
  }, [imageData?.photo_url, croppedAreaPixels, detectFacesInBlob]);

  const handleSave = useCallback(
    async (blob, url) => {
      try {
        function blobToFileObject(blob, blobUrl) {
          const fileType = blob.type || "application/octet-stream";
          const extension = fileType.split("/")[1] || "bin";
          const fileName = `image_${Date.now()}.${extension}`;
          const file = new File([blob], fileName, { type: fileType });

          return {
            file,
            url: blobUrl,
          };
        }

        const result = blobToFileObject(blob, url);
        const formData = new FormData();
        formData.append("file", result?.file);

        const res = await editImage({ id, formData }).unwrap();

        if (res?.data) {
          toast.success("Cropped image uploaded successfully!");
          setCropping(false);
          setTimeout(() => {
            navigate("/uploads");
          }, 3000);
        }
      } catch (err) {
        console.error("Upload error:", err);
        toast.error("Something went wrong during upload");
      }
    },
    [id, setCropping]
  );

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Grid
        container
        mx="auto"
        maxWidth="775px"
        alignItems="center"
        justifyContent="center"
        rowGap={3}
        py={2.5}
      >
        <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Toolbar
            onCrop={setCropping}
            onSave={handleSave}
            onSaveLoading={upLoading || isLoading}
            onSaveDisabled={cropping}
          />
        </Grid>

        <Grid
          size={12}
          px={2}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          {cropping ? (
            <Box
              sx={{
                position: "relative",
                mx: "auto",
                width: "80vw",
                height: "35vh",
                minHeight: 250,
                overflow: "hidden",
              }}
            >
              <Cropper
                image={imageData?.photo_url}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                style={{
                  cropAreaStyle: {
                    border: "4px solid red",
                    borderRadius: "50%",
                  },
                }}
              />
            </Box>
          ) : croppedImageUrl ? (
            <Box
              component="img"
              src={croppedImageUrl}
              sx={{
                mx: "auto",
                maxWidth: "90vw",
                minHeight: "380px",
                maxHeight: "60vh",
                objectFit: "contain",
                display: "block",
              }}
            />
          ) : imageData?.photo_url ? (
            <Box
              component="img"
              src={imageData?.photo_url}
              sx={{
                mx: "auto",
                maxWidth: "90vw",
                minHeight: "380px",
                maxHeight: "60vh",
                objectFit: "contain",
                display: "block",
              }}
            />
          ) : (
            <Guide />
          )}
        </Grid>
        <Grid sx={12}>
          {cropping && (
            <Stack spacing={2} alignItems="center" my={3}>
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e, z) => setZoom(z)}
                sx={{ width: 200 }}
              />
              <Stack direction={"row"} spacing={1.5}>
                <Button
                  variant="contained"
                  onClick={handleCrop}
                  sx={{
                    borderRadius: "999px",
                    textTransform: "none",
                    boxShadow: "none",
                    fontWeight: 600,
                    px: 2.5,
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="accent"
                  onClick={() => setCropping(false)}
                  sx={{
                    borderRadius: "999px",
                    textTransform: "none",
                    boxShadow: "none",
                    fontWeight: 600,
                    px: 2.5,
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          )}
          <Stack spacing={2} alignItems="center">
            <Button
              variant="contained"
              onClick={() => navigate(`/user/${id}`)}
              loading={upLoading || isLoading}
              disabled={upLoading || cropping}
              sx={{
                borderRadius: "999px",
                textTransform: "none",
                boxShadow: "none",
                fontWeight: 600,
                px: 2.5,
              }}
            >
              {"Go to back"}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditImage;
