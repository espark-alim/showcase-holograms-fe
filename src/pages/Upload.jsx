import { useEffect, useState, useCallback } from "react";
import { Box, Grid, Slider, Button, Stack } from "@mui/material";
import Cropper from "react-easy-crop";
import * as faceapi from "face-api.js";
import Toolbar from "../components/Toolbar";
import Guide from "../components/Guide";
import { toast } from "react-toastify";
import { useUploadImageMutation } from "../services/image";
import { useLocation, useNavigate } from "react-router-dom";
import { apiSlice } from "../api/apiSlice";
import { useDispatch } from "react-redux";
import { UPLOAD_STYLE } from "../style";
import { createImage, getCroppedImg } from "../services/_utils";

const Upload = () => {
  const {
    rootBox,
    containerGrid,
    toolbarGrid,
    imageGrid,
    cropBox,
    cropperStyle,
    imagePreview,
    sliderStyle,
    actionButton,
  } = UPLOAD_STYLE || {};
  const [cropping, setCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const navigate = useNavigate();
  const id = localStorage.getItem("accessToken");
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [uploadImage, { isLoading: upLoading }] = useUploadImageMutation();
  const [image, setImage] = useState("");
  const location = useLocation();
  const initialFile = location.state?.file;
  const imageUrl = image;
  const dispatch = useDispatch();

  useEffect(() => {
    if (initialFile) {
      const url = URL.createObjectURL(initialFile);
      const imgObj = { file: initialFile, url };
      setImage(imgObj);
    }
  }, [initialFile]);

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
      const { blob, url } = await getCroppedImg(
        imageUrl.url,
        croppedAreaPixels
      );
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
  }, [imageUrl, croppedAreaPixels, detectFacesInBlob]);

  const handleSave = useCallback(
    async (blob, url) => {
      try {
        function blobToFileObject(blob, blobUrl) {
          const fileType = blob.type || "application/octet-stream";
          const extension = fileType.split("/")[1] || "bin";
          const fileName = `image_${Date.now()}.${extension}`;
          const file = new File([blob], fileName, { type: fileType });
          return { file, url: blobUrl };
        }

        const result = blobToFileObject(blob, url);
        const formData = new FormData();
        formData.append("files", result?.file);

        const res = await uploadImage({ id, formData }).unwrap();
        if (res?.data) {
          toast.success("Cropped image uploaded successfully!");
          setCropping(false);
          dispatch(apiSlice.util.invalidateTags(["Images"]));
          setTimeout(() => navigate("/uploads"), 3000);
        } else toast.error("Upload failed!");
      } catch (err) {
        console.error("Upload error:", err);
        toast.error("Something went wrong during upload");
      }
    },
    [uploadImage, id, setCropping]
  );

  const onCropAndSave = async () => {
    const result = await handleCrop();
    if (result) await handleSave(result.blob, result.url);
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  return (
    <Box sx={rootBox}>
      <Grid container sx={containerGrid}>
        <Grid size={12} sx={toolbarGrid}>
          {image && (
            <Toolbar
              onCrop={setCropping}
              onSave={onCropAndSave}
              onSaveLoading={upLoading}
              onSaveDisabled={cropping}
            />
          )}
        </Grid>

        <Grid size={12} sx={imageGrid}>
          {cropping ? (
            <Box sx={cropBox}>
              <Cropper
                image={imageUrl.url}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                style={cropperStyle}
              />
            </Box>
          ) : croppedImageUrl ? (
            <Box component="img" src={croppedImageUrl} sx={imagePreview} />
          ) : imageUrl ? (
            <Box component="img" src={imageUrl.url} sx={imagePreview} />
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
                sx={sliderStyle}
              />
              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="contained"
                  onClick={handleCrop}
                  sx={actionButton}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="accent"
                  onClick={() => setCropping(false)}
                  sx={actionButton}
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
              loading={upLoading}
              disabled={upLoading || cropping}
              sx={actionButton}
            >
              Go to back
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Upload;
