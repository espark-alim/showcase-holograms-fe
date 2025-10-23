import { useEffect, useState, useCallback } from "react";
import { Box, Grid, Slider, Button, Stack } from "@mui/material";
import Cropper from "react-easy-crop";
import * as faceapi from "face-api.js";
import Toolbar from "../components/Toolbar";
import Guide from "../components/Guide";
import { toast } from "react-toastify";
import {
  useGetSingleImageQuery,
  useUploadImageMutation,
} from "../services/image";
import { useNavigate, useParams } from "react-router-dom";

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

const Upload = () => {
  const [cropping, setCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const [uploadImage, { isLoading: upLoading }] = useUploadImageMutation();
  const { data, isLoading } = useGetSingleImageQuery({ id });
  const imageData = data?.data;
  const imageUrl = imageData?.photo_url;

  // Load face detection models once
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
      if (!imageUrl) return;
      const { blob, url } = await getCroppedImg(imageUrl, croppedAreaPixels);

      // detect face in cropped result
      const hasFace = await detectFacesInBlob(blob);

      if (!hasFace) {
        toast.info("No face detected in cropped image.");
        return;
      }

      // Face found → send to API
      const formData = new FormData();
      formData.append("file", blob, "cropped.jpg");

      const res = await uploadImage(formData).unwrap();
      if (res?.data) {
        toast.success("Cropped image uploaded successfully!");
        setCropping(false);
      } else {
        toast.error("Upload failed!");
      }
    } catch (err) {
      console.error("Crop/Upload error:", err);
      toast.error("Something went wrong during cropping/upload");
    }
  }, [imageUrl, croppedAreaPixels, uploadImage, detectFacesInBlob]);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
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
        // height="100%"
        // maxHeight="1080px"
        rowGap={3}
        py={2.5}
      >
        <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Toolbar
            onCrop={setCropping}
            onSave={handleCrop}
            onSaveLoading={upLoading}
            addImageLoading={isLoading}
          />
        </Grid>

        {/* Image or Cropper */}
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
                width: "95%",
                height: 250,
                overflow: "hidden",
              }}
            >
              <Cropper
                image={imageUrl}
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
          ) : imageUrl ? (
            <Box
              component="img"
              src={imageUrl}
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
                  Save Crop
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
              onClick={() => navigate("/uploads")}
              // loading={submitLoading}
              // disabled={upLoading}
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

export default Upload;
