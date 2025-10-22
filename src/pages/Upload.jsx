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
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (error) => reject(error));
    img.setAttribute("crossOrigin", "anonymous");
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
      resolve(URL.createObjectURL(blob));
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
  const {
    data: images = {},
    isLoading,
    isError,
  } = useGetSingleImageQuery({
    id: id,
  });

  console.log(id, "id");

  useEffect(() => {
    (async () => {
      try {
        const MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
      } catch (err) {
        console.error("Failed to load face-api models", err);
        toast.error("Face detection models failed to load");
      }
    })();
  }, []);

  function createImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", (error) => reject(error));
      img.setAttribute("crossOrigin", "anonymous");
      img.src = url;
    });
  }

  const detectFacesInFile = useCallback(async (file) => {
    const url = URL.createObjectURL(file);
    try {
      const img = await createImage(url);
      const detections = await faceapi
        .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      return {
        facesCount: detections.length,
        faceDetected: detections.length > 0,
      };
    } catch (err) {
      console.error("Face detection failed for", file.name, err);
      return { facesCount: 0, faceDetected: false, error: true };
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }, []);

  const handleUploadImage = async (e) => {
    const formData = new FormData();
    formData.append("file", "croped image");

    try {
      const res = await uploadImage(formData).unwrap();
      if (res?.data) {
        toast.success("Image uploaded successfully!");
        console.log("Uploaded:", res.data.filePath);
      } else {
        toast.error("Image upload failed!");
      }
    } catch (err) {
      toast.error("Image upload failed!");
      console.error(err);
    }
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCrop = useCallback(async () => {
    try {
      const currentImg = "";
      if (!currentImg) return;
      const croppedUrl = await getCroppedImg(currentImg.url, croppedAreaPixels);

      setCropping(false);
    } catch (e) {
      console.error(e);
      toast.error(`Crop failed`);
    }
  }, [images, croppedAreaPixels]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
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
        height="100%"
        maxHeight="1080px"
        rowGap={3}
        py={2.5}
      >
        <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Toolbar
            onCrop={setCropping}
            onSave={handleUploadImage}
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
                height: 450,
                overflow: "hidden",
              }}
            >
              <Cropper
                image={images?.url}
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
          ) : images.length > 0 ? (
            <Box
              component="img"
              src={images?.url}
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
          {!images.length > 0 && (
            <Stack spacing={2} alignItems="center" my={3}>
              {!cropping && (
                <>
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
                </>
              )}
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
