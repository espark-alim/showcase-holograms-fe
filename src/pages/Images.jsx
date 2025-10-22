import { Box, Button, Stack, Typography } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useLocation, useNavigate } from "react-router-dom";
import Guide from "../components/Guide";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import * as faceapi from "face-api.js";
import { useDispatch, useSelector } from "react-redux";
import { addImage, addImages } from "../store/slices/image/imageSlice";
import { v4 as uuidv4 } from "uuid"; // install if not installed: npm i uuid

const itemData = [
  {
    img: "https://media.istockphoto.com/id/537692968/photo/capturing-the-beauty-of-nature.jpg?s=612x612&w=0&k=20&c=V1HaryvwaOZfq80tAzeVPJST9iPoGnWb8ICmE-lmXJA=",
    title: "Breakfast",
  },
  {
    img: "https://media.istockphoto.com/id/537692968/photo/capturing-the-beauty-of-nature.jpg?s=612x612&w=0&k=20&c=V1HaryvwaOZfq80tAzeVPJST9iPoGnWb8ICmE-lmXJA=",
    title: "Burger",
  },
  {
    img: "https://shorthand.com/the-craft/raster-images/assets/5kVrMqC0wp/sh-unsplash_5qt09yibrok-4096x2731.jpeg",
    title: "Fern",
  },
  {
    img: "https://shorthand.com/the-craft/raster-images/assets/5kVrMqC0wp/sh-unsplash_5qt09yibrok-4096x2731.jpeg",
    title: "Mushrooms",
  },
  {
    img: "https://tse1.mm.bing.net/th/id/OET.7252da000e8341b2ba1fb61c275c1f30?w=594&h=594&c=7&rs=1&o=5&cb=12&pid=1.9&ucfimg=1",
    title: "Mushrooms",
  },
  {
    img: "https://tse1.mm.bing.net/th/id/OET.7252da000e8341b2ba1fb61c275c1f30?w=594&h=594&c=7&rs=1&o=5&cb=12&pid=1.9&ucfimg=1",
    title: "Tomato basil",
  },
];

const StandardImageList = ({ navigate, images, selectedIndex }) => {
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
      {images.map((item, index) => (
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
            onClick={() => navigate(`/uploads/${item?.id}`)}
            component="img"
            sx={{
              width: "243px",
              height: "228px",
              cursor: "pointer",
              objectFit: "contain",
              objectPosition: "center",
            }}
            src={item?.url}
            alt={""}
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
            {/* <EditIcon
              sx={{
               backgroundColor: "#fff",
                borderRadius: "50%",
                color: "primary.main",
                "&:hover": {
                  color: "red",
                },
              }}
            /> */}
            <HighlightOffIcon
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

function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (error) => reject(error));
    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
  });
}

const Images = () => {
  const location = useLocation();
  const initialFile = location.state?.file;
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const MAX_IMAGES = 30;
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingDetect, setLoadingDetect] = useState(false);

  useEffect(() => {
    if (initialFile) {
      const url = URL.createObjectURL(initialFile);
      const imgObj = {
        file: initialFile,
        url,
        faceDetected: null,
        facesCount: 0,
      };
      setImages([imgObj]);
    }
  }, [initialFile]);

  useEffect(() => {
    (async () => {
      try {
        const MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Failed to load face-api models", err);
        toast.success("Face detection models failed");
      }
    })();
  }, []);

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
      console.error("face detection failed for file", file.name, err);
      return { facesCount: 0, faceDetected: false, error: true };
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }, []);

  const handleUploadImage = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // enforce max count
    if (images.length + files.length > MAX_IMAGES) {
      toast.info(
        `You can only upload up to ${MAX_IMAGES} images. Remove some before adding more.`
      );
      e.target.value = "";
      return;
    }

    const newFiles = files.filter(
      (file) =>
        !images.some(
          (img) =>
            img.file?.name === file.name &&
            img.file?.size === file.size &&
            img.file?.lastModified === file.lastModified
        )
    );

    if (newFiles.length === 0) {
      toast.info(`No new images to add (duplicates skipped).`);
      e.target.value = "";
      return;
    }

    if (!modelsLoaded) {
      toast.info(
        `Face detection models are still loading. Please wait a moment and try again.`
      );
      e.target.value = "";
      return;
    }

    setLoadingDetect(true);
    const results = await Promise.all(
      newFiles.map(async (file) => {
        const url = URL.createObjectURL(file);
        let faceResult = { facesCount: 0, faceDetected: false };
        try {
          faceResult = await detectFacesInFile(file);
        } catch (err) {
          console.error("error detecting", err);
        }
        return {
          file,
          url,
          faceDetected: faceResult.faceDetected,
          facesCount: faceResult.facesCount,
          validationMessage:
            faceResult.faceDetected === false
              ? "No human face detected — image will be skipped."
              : undefined,
        };
      })
    );
    setLoadingDetect(false);

    // separate valid and invalid
    const valid = results.filter((r) => r.faceDetected);
    const invalid = results.filter((r) => !r.faceDetected);

    if (invalid.length > 0) {
      toast.info(
        `${
          invalid.length > 1 ? invalid.length + " " + "images" : "image"
        } skipped because no human face was detected.`
      );
    }

    // Append valid images
    if (valid.length > 0) {
      setImages((prev) => {
        const next = [...prev, ...valid];
        // ensure selectedIndex set
        if (prev.length === 0) setSelectedIndex(0);
        return next;
      });
    }

    e.target.value = "";
  };

  const handleClickPlus = async () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    const fileToBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    const allImagesValid =
      images.length > 0 && images.every((i) => i.faceDetected === true);

    if (!allImagesValid) {
      toast.info("Some images are invalid or have no detected faces.");
      return;
    }

    const formData = new FormData();
    const imageMetadata = [];

    for (const img of images) {
      formData.append("images", img.file, img.file.name);

      // Convert file to base64 for Redux
      const base64 = await fileToBase64(img.file);

      imageMetadata.push({
        id: uuidv4(),
        name: img.file.name,
        facesCount: img.facesCount,
        url: base64,
      });
    }

    dispatch(addImages(imageMetadata));
    toast.success("Images saved in Redux (Base64 mode)");
    toast.info(`Ready to upload (example). Implement your upload logic.`);
  };

  console.log(images, "images");
  return (
    <Stack
      minHeight={"100vh"}
      alignItems={"center"}
      justifyContent={"center"}
      overflow={"hidden"}
    >
      <Stack py={4} width={"85%"} maxWidth={1080} alignItems={"center"}>
        <Stack spacing={3} alignItems={"center"}>
          <Stack spacing={1} alignItems={"center"} textAlign={"center"}>
            <Typography variant="h4" fontWeight={600} letterSpacing={0.5}>
              {`Add your photos: (${images?.length}/30 uploaded)`}
            </Typography>
            <Typography variant="body2" letterSpacing={0.5}>
              Note: Only upload photos of people with focused, clear, and up
              close faces
            </Typography>
          </Stack>
          <Stack
            width={"100%"}
            direction={"row"}
            justifyContent={"center"}
            spacing={1.5}
          >
            <Button
              variant="contained"
              color="accent"
              //   onClick={() => navigate("/uploads/add")}
              onClick={() => handleClickPlus()}
              sx={{
                width: "100%",
                maxWidth: "140px",
                borderRadius: "999px",
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "none",
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
              onChange={handleUploadImage}
            />
            <Button
              variant="contained"
              //   disabled
              onClick={() => handleSubmit()}
              sx={{
                width: "100%",
                maxWidth: "140px",
                borderRadius: "999px",
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "none",
              }}
            >
              Submit Photos
            </Button>
          </Stack>
          {/* <Typography variant="h6" letterSpacing={0.5}>
            Done adding all photos!
          </Typography> */}
        </Stack>
        <Box
          sx={{
            // maxHeight: "60vh",
            // overflowY: "auto",
            // overflowX: "hidden",
            mt: 2,
            p: 1,

            "&::-webkit-scrollbar": {
              width: "8px",
            },
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

            /* ✅ For Firefox */
            scrollbarWidth: "thin",
            scrollbarColor: "#0cc5db #f1f1f1",
          }}
        >
          {images.length > 0 ? (
            <StandardImageList
              navigate={navigate}
              images={images}
              selectedIndex={selectedIndex}
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
