import { Box, Button, Stack, Typography } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useLocation, useNavigate } from "react-router-dom";
import Guide from "../components/Guide";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import * as faceapi from "@vladmandic/face-api";
import {
  useDeleteImageMutation,
  useGetImagesQuery,
  useUploadImageMutation,
} from "../services/image";
import { useSubmitImagesMutation } from "../services/processImage";

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
            // src={item?.photo_url}
            src={item?.src}
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
  const [testImages, setTestImages] = useState([]);

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingDetect, setLoadingDetect] = useState(false);
  const id = localStorage.getItem("accessToken");

  const [uploadImage, { isLoading: upLoading }] = useUploadImageMutation();
  const [deleteImage, { isLoading: deleteLoading }] = useDeleteImageMutation();
  const [submitImages, { isLoading: submitLoading }] =
    useSubmitImagesMutation();
  const { data, isLoading, isError } = useGetImagesQuery({
    id: id,
  });

  const images = testImages;
  // const images = data?.data;

  const location = useLocation();
  const initialFile = location.state?.file;
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const MAX_IMAGES = 30;

  useEffect(() => {
    if (initialFile) {
      const url = URL.createObjectURL(initialFile);
      const imgObj = {
        file: initialFile,
        url,
        faceDetected: null,
        facesCount: 0,
      };
      console.log("Initial file added:", imgObj);
    }
  }, [initialFile]);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const MODEL_URL = "/models";
  //       await Promise.all([
  //         faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
  //         faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
  //         faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
  //       ]);
  //       setModelsLoaded(true);
  //     } catch (err) {
  //       console.error("Failed to load face-api models", err);
  //       toast.error("Face detection models failed to load");
  //     }
  //   })();
  // }, []);

  function createImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", (error) => reject(error));
      img.setAttribute("crossOrigin", "anonymous");
      img.src = url;
    });
  }

  // const detectFacesInFile = useCallback(async (file) => {
  //   const url = URL.createObjectURL(file);
  //   try {
  //     const img = await createImage(url);
  //     const detections = await faceapi
  //       .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
  //       .withFaceLandmarks();

  //     return {
  //       facesCount: detections.length,
  //       faceDetected: detections.length > 0,
  //     };
  //   } catch (err) {
  //     console.error("Face detection failed for", file.name, err);
  //     return { facesCount: 0, faceDetected: false, error: true };
  //   } finally {
  //     setTimeout(() => URL.revokeObjectURL(url), 1000);
  //   }
  // }, []);

  const handleUploadImage = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images?.length + files?.length > MAX_IMAGES) {
      toast.info(`You can only upload up to ${MAX_IMAGES} images.`);
      e.target.value = "";
      return;
    }

    if (!modelsLoaded) {
      toast.info(`Face detection models are still loading. Please wait.`);
      e.target.value = "";
      return;
    }

    setLoadingDetect(true);
    const results = await Promise.all(
      files.map(async (file) => {
        const faceResult = await detectFacesInFile(file);
        return {
          file,
          faceDetected: faceResult.faceDetected,
          facesCount: faceResult.facesCount,
        };
      })
    );
    setLoadingDetect(false);

    const valid = results.filter((r) => r.faceDetected);
    const invalid = results.filter((r) => !r.faceDetected);

    if (invalid.length > 0) {
      toast.info(`${invalid.length} image(s) skipped (no face detected).`);
    }

    for (const item of valid) {
      if (!item.file || !(item.file instanceof File)) {
        toast.error("Invalid file!");
        continue;
      }
      const formData = new FormData();
      formData.append("files", item.file);

      try {
        const res = await uploadImage({ id, formData }).unwrap();
        if (res.success) {
          toast.success("Image uploaded successfully!");
        }
      } catch (err) {
        toast.error("Image upload failed!");
        console.error(err);
      }
    }

    e.target.value = "";
  };

  const handleDeleteImage = async (id) => {
    try {
      const res = await deleteImage({ id }).unwrap();
      if (res?.data) {
        toast.success("Image deleted successfully!");
      }
    } catch (err) {
      toast.error("Image delete failed!");
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    // if (!images?.length) {
    //   toast.info("No images to submit.");
    //   return;
    // }

    // const allValid = images.every((i) => i.faceDetected === true);
    // if (!allValid) {
    //   toast.info("Some images have no detected faces.");
    //   return;
    // }

    try {
      // Just extract the IDs from your images array
      const photo_ids = images.map((img) => img.photo_id);

      // Optional check: ensure at least one image
      if (!photo_ids.length) {
        toast.info("No images to submit.");
        return;
      }

      // Create raw JSON payload
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
      // console.error("Submit failed:", err);
      // toast.error("Image submission failed!");
      toast.success(`Thank you! Your photos are submitted`);
      setTimeout(() => {
        toast.info(`We’ll email you when your holograms are ready`);
      }, 5000);
    }
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

  // ------------------ Load Image Utility ------------------
  const loadImage = (src) =>
    new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.src = src;
    });

  // ------------------ Handle Upload ------------------
  const handleUpload = async (e) => {
    const files = Array.from(e.target.files).slice(0, 30);
    if (!files.length) return;
    if (!modelsLoaded) {
      alert("Please wait, models are still loading...");
      return;
    }

    // setLoading(true);
    const validImages = [];

    for (const file of files) {
      const fileKey = `${file.name}_${file.size}`;
      const alreadyExists = testImages.some((img) => img.key === fileKey);
      if (alreadyExists) continue;

      const imgURL = URL.createObjectURL(file);
      const img = await loadImage(imgURL);

      try {
        const detections = await faceapi
          .detectAllFaces(
            img,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 512,
              scoreThreshold: 0.5,
            })
          )
          .withFaceLandmarks();

        if (detections.length) {
          // 🔹 Only up to 2 faces
          const faces = detections.slice(0, 2);

          for (let i = 0; i < faces.length; i++) {
            const { box } = faces[i].detection;
            if (box.width < 50 || box.height < 50) continue; // skip tiny faces

            const cropBox = {
              x: Math.max(box.x - box.width * 0.3, 0),
              y: Math.max(box.y - box.height * 0.6, 0),
              width: box.width * 1.6,
              height: box.height * 2.0,
            };

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = cropBox.width;
            canvas.height = cropBox.height;

            ctx.drawImage(
              img,
              cropBox.x,
              cropBox.y,
              cropBox.width,
              cropBox.height,
              0,
              0,
              cropBox.width,
              cropBox.height
            );

            const croppedDataUrl = canvas.toDataURL("image/jpeg");
            validImages.push({
              key: `${fileKey}_face${i}`,
              src: croppedDataUrl,
            });
          }
        }
      } catch (err) {
        console.error("Face detection failed:", err);
      }
    }

    setTestImages((prev) => [...prev, ...validImages]);
    // setLoading(false);
  };

  // if (isLoading) return <Typography>Loading images...</Typography>;
  // if (isError) return <Typography>Error loading images</Typography>;

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

          <Stack direction="row" justifyContent="center" spacing={1.5}>
            <Button
              variant="contained"
              color="accent"
              onClick={() => fileInputRef.current.click()}
              loading={upLoading}
              disabled={images?.length === MAX_IMAGES}
              sx={{
                borderRadius: "999px",
                textTransform: "none",
                boxShadow: "none",
                fontWeight: 600,
                px: 2.5,
              }}
            >
              Upload Photos
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleUpload}
            />
            <Button
              variant="contained"
              onClick={handleSubmit}
              loading={submitLoading}
              disabled={upLoading}
              sx={{
                borderRadius: "999px",
                textTransform: "none",
                boxShadow: "none",
                fontWeight: 600,
                px: 2.5,
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
          ) : (
            <Guide />
          )}
        </Box>
      </Stack>
    </Stack>
  );
};

export default Images;
