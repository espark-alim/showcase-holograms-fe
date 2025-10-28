// import { useEffect, useState, useCallback } from "react";
// import { Box, Grid, Slider, Button, Stack } from "@mui/material";
// import Cropper from "react-easy-crop";
// import * as faceapi from "face-api.js";
// import Toolbar from "../components/Toolbar";
// import Guide from "../components/Guide";
// import { toast } from "react-toastify";
// import {
//   useAdjustImageMutation,
//   useGetSingleImageQuery,
//   useUploadImageMutation,
// } from "../services/image";
// import { useNavigate, useParams } from "react-router-dom";

// function createImage(url) {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.crossOrigin = "anonymous";
//     img.onload = () => resolve(img);
//     img.onerror = reject;
//     img.src = url;
//   });
// }

// async function getCroppedImg(imageSrc, croppedAreaPixels) {
//   const image = await createImage(imageSrc);
//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");

//   canvas.width = Math.max(1, Math.floor(croppedAreaPixels.width));
//   canvas.height = Math.max(1, Math.floor(croppedAreaPixels.height));

//   ctx.drawImage(
//     image,
//     croppedAreaPixels.x,
//     croppedAreaPixels.y,
//     croppedAreaPixels.width,
//     croppedAreaPixels.height,
//     0,
//     0,
//     croppedAreaPixels.width,
//     croppedAreaPixels.height
//   );

//   return new Promise((resolve) => {
//     canvas.toBlob((blob) => {
//       resolve({ blob, url: URL.createObjectURL(blob) });
//     }, "image/jpeg");
//   });
// }

// const Upload = () => {
//   const [cropping, setCropping] = useState(false);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [croppedImageUrl, setCroppedImageUrl] = useState(null);
//   const [adjustImage, { isLoading: upLoading }] = useAdjustImageMutation();
//   const { data, isLoading } = useGetSingleImageQuery({ id });
//   const imageData = data?.data;
//   const imageUrl = `https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg`;

//   // Load face detection models once
//   useEffect(() => {
//     (async () => {
//       try {
//         const MODEL_URL = "/models";
//         await Promise.all([
//           faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
//           faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
//         ]);
//       } catch (err) {
//         console.error("Failed to load face-api models", err);
//         toast.error("Failed to load face detection models");
//       }
//     })();
//   }, []);

//   const detectFacesInBlob = useCallback(async (blob) => {
//     const img = await createImage(URL.createObjectURL(blob));
//     const detections = await faceapi.detectAllFaces(
//       img,
//       new faceapi.TinyFaceDetectorOptions()
//     );
//     return detections.length > 0;
//   }, []);

//   const handleCrop = useCallback(async () => {
//     try {
//       if (!imageUrl) return;

//       // crop result
//       const { blob, url } = await getCroppedImg(imageUrl, croppedAreaPixels);

//       // detect face in cropped result
//       const hasFace = await detectFacesInBlob(blob);
//       if (!hasFace) {
//         toast.info("No face detected in cropped image.");
//         return;
//       }

//       // ✅ show cropped image instantly
//       setCroppedImageUrl(url);
//       setCropping(false);

//       // return cropped blob + url to use later
//       return { blob, url };
//     } catch (err) {
//       console.error("Crop error:", err);
//       toast.error("Something went wrong while cropping");
//     }
//   }, [imageUrl, croppedAreaPixels, detectFacesInBlob]);

//   // ✅ 2️⃣ Save only (API upload)
//   const handleSave = useCallback(
//     async (blob, url) => {
//       try {
//         if (!blob) {
//           toast.error("No cropped image found.");
//           return;
//         }

//         // blob → file convert
//         const blobToFile = async (blob, url) => {
//           const fileName = url?.split("/").pop() || "file.jpg";
//           const extension = blob.type.split("/")[1] || "jpeg";
//           const finalName = `${fileName}.${extension}`;
//           return new File([blob], finalName, { type: blob.type });
//         };

//         // async function urlToFile(url, fileName = "image.jpg") {
//         //   try {
//         //     const response = await fetch(url);
//         //     const blob = await response.blob();
//         //     const file = new File([blob], fileName, { type: blob.type });
//         //     return file;
//         //   } catch (error) {
//         //     console.error("Error converting URL to File:", error);
//         //     throw error;
//         //   }
//         // }
//         const file = await blobToFile(blob, url);

//         // send to API
//         const formData = new FormData();
//         formData.append("file", file);

//         const res = await adjustImage({ id, formData }).unwrap();

//         if (res?.data) {
//           toast.success("Cropped image uploaded successfully!");
//           setCropping(false);
//           setTimeout(() => {
//             navigate("/uploads");
//           }, 3000);
//         } else {
//           toast.error("Upload failed!");
//         }
//       } catch (err) {
//         console.error("Upload error:", err);
//         toast.error("Something went wrong during upload");
//       }
//     },
//     [adjustImage, id, setCropping]
//   );

//   const onCropAndSave = async () => {
//     const result = await handleCrop();
//     if (result) {
//       await handleSave(result.blob, result.url);
//     }
//   };

//   const onCropComplete = useCallback((_, croppedPixels) => {
//     setCroppedAreaPixels(croppedPixels);
//   }, []);

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//       }}
//     >
//       <Grid
//         container
//         mx="auto"
//         maxWidth="775px"
//         alignItems="center"
//         justifyContent="center"
//         // height="100%"
//         // maxHeight="1080px"
//         rowGap={3}
//         py={2.5}
//       >
//         <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
//           <Toolbar
//             onCrop={setCropping}
//             onSave={onCropAndSave}
//             onSaveLoading={upLoading}
//             addImageLoading={isLoading}
//           />
//         </Grid>

//         {/* Image or Cropper */}
//         <Grid
//           size={12}
//           px={2}
//           sx={{ display: "flex", justifyContent: "center" }}
//         >
//           {cropping ? (
//             // Cropper view
//             <Box
//               sx={{
//                 position: "relative",
//                 mx: "auto",
//                 width: "95%",
//                 height: 250,
//                 overflow: "hidden",
//               }}
//             >
//               <Cropper
//                 image={croppedImageUrl || imageUrl} // 👈 show cropped if available
//                 crop={crop}
//                 zoom={zoom}
//                 aspect={1}
//                 cropShape="round"
//                 showGrid={false}
//                 onCropChange={setCrop}
//                 onZoomChange={setZoom}
//                 onCropComplete={onCropComplete}
//                 style={{
//                   cropAreaStyle: {
//                     border: "4px solid red",
//                     borderRadius: "50%",
//                   },
//                 }}
//               />
//             </Box>
//           ) : croppedImageUrl ? ( // 👈 show cropped preview if exists
//             <Box
//               component="img"
//               src={croppedImageUrl}
//               sx={{
//                 mx: "auto",
//                 maxWidth: "90vw",
//                 minHeight: "380px",
//                 maxHeight: "60vh",
//                 objectFit: "contain",
//                 display: "block",
//               }}
//             />
//           ) : imageUrl ? (
//             <Box
//               component="img"
//               src={imageUrl}
//               sx={{
//                 mx: "auto",
//                 maxWidth: "90vw",
//                 minHeight: "380px",
//                 maxHeight: "60vh",
//                 objectFit: "contain",
//                 display: "block",
//               }}
//             />
//           ) : (
//             <Guide />
//           )}
//         </Grid>
//         <Grid sx={12}>
//           {cropping && (
//             <Stack spacing={2} alignItems="center" my={3}>
//               <Slider
//                 value={zoom}
//                 min={1}
//                 max={3}
//                 step={0.1}
//                 onChange={(e, z) => setZoom(z)}
//                 sx={{ width: 200 }}
//               />
//               <Stack direction={"row"} spacing={1.5}>
//                 <Button
//                   variant="contained"
//                   onClick={handleCrop}
//                   sx={{
//                     borderRadius: "999px",
//                     textTransform: "none",
//                     boxShadow: "none",
//                     fontWeight: 600,
//                     px: 2.5,
//                   }}
//                 >
//                   Save
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="accent"
//                   onClick={() => setCropping(false)}
//                   sx={{
//                     borderRadius: "999px",
//                     textTransform: "none",
//                     boxShadow: "none",
//                     fontWeight: 600,
//                     px: 2.5,
//                   }}
//                 >
//                   Cancel
//                 </Button>
//               </Stack>
//             </Stack>
//           )}
//           <Stack spacing={2} alignItems="center">
//             <Button
//               variant="contained"
//               onClick={() => navigate("/uploads")}
//               // loading={submitLoading}
//               // disabled={upLoading}
//               sx={{
//                 borderRadius: "999px",
//                 textTransform: "none",
//                 boxShadow: "none",
//                 fontWeight: 600,
//                 px: 2.5,
//               }}
//             >
//               {"Go to back"}
//             </Button>
//           </Stack>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default Upload;

// import { useEffect, useState, useCallback } from "react";
// import { Box, Grid, Slider, Button, Stack } from "@mui/material";
// import Cropper from "react-easy-crop";
// import * as faceapi from "face-api.js";
// import Toolbar from "../components/Toolbar";
// import Guide from "../components/Guide";
// import { toast } from "react-toastify";
// import { useAdjustImageMutation } from "../services/image";
// import { useNavigate, useLocation } from "react-router-dom";

// function createImage(url) {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.crossOrigin = "anonymous";
//     img.onload = () => resolve(img);
//     img.onerror = reject;
//     img.src = url;
//   });
// }

// async function getCroppedImg(imageSrc, croppedAreaPixels) {
//   const image = await createImage(imageSrc);
//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");

//   canvas.width = Math.max(1, Math.floor(croppedAreaPixels.width));
//   canvas.height = Math.max(1, Math.floor(croppedAreaPixels.height));

//   ctx.drawImage(
//     image,
//     croppedAreaPixels.x,
//     croppedAreaPixels.y,
//     croppedAreaPixels.width,
//     croppedAreaPixels.height,
//     0,
//     0,
//     croppedAreaPixels.width,
//     croppedAreaPixels.height
//   );

//   return new Promise((resolve) => {
//     canvas.toBlob((blob) => {
//       resolve({ blob, url: URL.createObjectURL(blob) });
//     }, "image/jpeg");
//   });
// }

// const Upload = () => {
//   const [cropping, setCropping] = useState(false);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [croppedImageUrl, setCroppedImageUrl] = useState(null);
//   const [imageUrl, setImageUrl] = useState(null); // 👈 holds uploaded image preview URL

//   const navigate = useNavigate();
//   const location = useLocation(); // 👈 get the uploaded image from navigation
//   const [adjustImage, { isLoading: upLoading }] = useAdjustImageMutation();

//   // 🔹 Load image from navigation state (useLocation)
//   useEffect(() => {
//     if (location?.state?.file) {
//       const file = location.state.file;
//       const url = URL.createObjectURL(file);
//       setImageUrl(url);

//       // cleanup URL when leaving page
//       return () => URL.revokeObjectURL(url);
//     } else {
//       toast.info("No image found. Please upload again.");
//       navigate("/uploads");
//     }
//   }, [location, navigate]);

//   // 🔹 Load face detection models once
//   useEffect(() => {
//     (async () => {
//       try {
//         const MODEL_URL = "/models";
//         await Promise.all([
//           faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
//           faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
//         ]);
//       } catch (err) {
//         console.error("Failed to load face-api models", err);
//         toast.error("Failed to load face detection models");
//       }
//     })();
//   }, []);

//   // 🔹 Face check in cropped blob
//   const detectFacesInBlob = useCallback(async (blob) => {
//     const img = await createImage(URL.createObjectURL(blob));
//     const detections = await faceapi.detectAllFaces(
//       img,
//       new faceapi.TinyFaceDetectorOptions()
//     );
//     return detections.length > 0;
//   }, []);

//   // 🔹 Crop function
//   const handleCrop = useCallback(async () => {
//     try {
//       if (!imageUrl) return;

//       const { blob, url } = await getCroppedImg(imageUrl, croppedAreaPixels);

//       const hasFace = await detectFacesInBlob(blob);
//       if (!hasFace) {
//         toast.info("No face detected in cropped image.");
//         return;
//       }

//       setCroppedImageUrl(url);
//       setCropping(false);

//       return { blob, url };
//     } catch (err) {
//       console.error("Crop error:", err);
//       toast.error("Something went wrong while cropping");
//     }
//   }, [imageUrl, croppedAreaPixels, detectFacesInBlob]);

//   // 🔹 Upload cropped image
//   const handleSave = useCallback(
//     async (blob, url) => {
//       try {
//         if (!blob) {
//           toast.error("No cropped image found.");
//           return;
//         }

//         const fileName = `cropped_${Date.now()}.jpg`;
//         const file = new File([blob], fileName, { type: blob.type });

//         const formData = new FormData();
//         formData.append("file", file);

//         const res = await adjustImage({ formData }).unwrap();

//         if (res?.data) {
//           toast.success("Cropped image uploaded successfully!");
//           setCropping(false);
//           setTimeout(() => navigate("/uploads"), 2000);
//         } else {
//           toast.error("Upload failed!");
//         }
//       } catch (err) {
//         console.error("Upload error:", err);
//         toast.error("Something went wrong during upload");
//       }
//     },
//     [adjustImage, navigate]
//   );

//   const onCropAndSave = async () => {
//     const result = await handleCrop();
//     if (result) await handleSave(result.blob, result.url);
//   };

//   const onCropComplete = useCallback((_, croppedPixels) => {
//     setCroppedAreaPixels(croppedPixels);
//   }, []);

//   // ---------------- UI ----------------
//   return (
//     <Box
//       sx={{
//         width: "100%",
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//       }}
//     >
//       <Grid
//         container
//         mx="auto"
//         maxWidth="775px"
//         alignItems="center"
//         justifyContent="center"
//         rowGap={3}
//         py={2.5}
//       >
//         <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
//           <Toolbar
//             onCrop={setCropping}
//             onSave={onCropAndSave}
//             onSaveLoading={upLoading}
//           />
//         </Grid>

//         <Grid
//           size={12}
//           px={2}
//           sx={{ display: "flex", justifyContent: "center" }}
//         >
//           {cropping ? (
//             <Box
//               sx={{
//                 position: "relative",
//                 mx: "auto",
//                 width: "95%",
//                 height: 250,
//                 overflow: "hidden",
//               }}
//             >
//               <Cropper
//                 image={croppedImageUrl || imageUrl}
//                 crop={crop}
//                 zoom={zoom}
//                 aspect={1}
//                 cropShape="round"
//                 showGrid={false}
//                 onCropChange={setCrop}
//                 onZoomChange={setZoom}
//                 onCropComplete={onCropComplete}
//                 style={{
//                   cropAreaStyle: {
//                     border: "4px solid red",
//                     borderRadius: "50%",
//                   },
//                 }}
//               />
//             </Box>
//           ) : croppedImageUrl ? (
//             <Box
//               component="img"
//               src={croppedImageUrl}
//               sx={{
//                 mx: "auto",
//                 maxWidth: "90vw",
//                 minHeight: "380px",
//                 maxHeight: "60vh",
//                 objectFit: "contain",
//                 display: "block",
//               }}
//             />
//           ) : imageUrl ? (
//             <Box
//               component="img"
//               src={imageUrl}
//               sx={{
//                 mx: "auto",
//                 maxWidth: "90vw",
//                 minHeight: "380px",
//                 maxHeight: "60vh",
//                 objectFit: "contain",
//                 display: "block",
//               }}
//             />
//           ) : (
//             <Guide />
//           )}
//         </Grid>

//         <Grid sx={12}>
//           {cropping && (
//             <Stack spacing={2} alignItems="center" my={3}>
//               <Slider
//                 value={zoom}
//                 min={1}
//                 max={3}
//                 step={0.1}
//                 onChange={(e, z) => setZoom(z)}
//                 sx={{ width: 200 }}
//               />
//               <Stack direction={"row"} spacing={1.5}>
//                 <Button
//                   variant="contained"
//                   onClick={handleCrop}
//                   sx={{
//                     borderRadius: "999px",
//                     textTransform: "none",
//                     boxShadow: "none",
//                     fontWeight: 600,
//                     px: 2.5,
//                   }}
//                 >
//                   Save
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="accent"
//                   onClick={() => setCropping(false)}
//                   sx={{
//                     borderRadius: "999px",
//                     textTransform: "none",
//                     boxShadow: "none",
//                     fontWeight: 600,
//                     px: 2.5,
//                   }}
//                 >
//                   Cancel
//                 </Button>
//               </Stack>
//             </Stack>
//           )}

//           <Stack spacing={2} alignItems="center">
//             <Button
//               variant="contained"
//               onClick={() => navigate("/uploads")}
//               sx={{
//                 borderRadius: "999px",
//                 textTransform: "none",
//                 boxShadow: "none",
//                 fontWeight: 600,
//                 px: 2.5,
//               }}
//             >
//               Go Back
//             </Button>
//           </Stack>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default Upload;

// import { useEffect, useState, useCallback } from "react";
// import { Box, Grid, Slider, Button, Stack } from "@mui/material";
// import Cropper from "react-easy-crop";
// import * as faceapi from "face-api.js";
// import Toolbar from "../components/Toolbar";
// import Guide from "../components/Guide";
// import { toast } from "react-toastify";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useAdjustImageMutation } from "../services/image";

// // ---------------- Load Image Utility ----------------
// const loadImage = (src) =>
//   new Promise((resolve) => {
//     const img = new Image();
//     img.crossOrigin = "anonymous";
//     img.onload = () => resolve(img);
//     img.src = src;
//   });

// // ---------------- Cropper Utility ----------------
// async function getCroppedImg(imageSrc, croppedAreaPixels) {
//   const image = await loadImage(imageSrc);
//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");

//   canvas.width = Math.max(1, Math.floor(croppedAreaPixels.width));
//   canvas.height = Math.max(1, Math.floor(croppedAreaPixels.height));

//   ctx.drawImage(
//     image,
//     croppedAreaPixels.x,
//     croppedAreaPixels.y,
//     croppedAreaPixels.width,
//     croppedAreaPixels.height,
//     0,
//     0,
//     croppedAreaPixels.width,
//     croppedAreaPixels.height
//   );

//   return new Promise((resolve) => {
//     canvas.toBlob((blob) => {
//       resolve({ blob, url: URL.createObjectURL(blob) });
//     }, "image/jpeg");
//   });
// }

// export default function Upload() {
//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const [imageUrl, setImageUrl] = useState(null);
//   const [cropping, setCropping] = useState(true);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [croppedImageUrl, setCroppedImageUrl] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [adjustImage, { isLoading: upLoading }] = useAdjustImageMutation();

//   // ---------------- Load Models ----------------
//   useEffect(() => {
//     (async () => {
//       await Promise.all([
//         faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
//         faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
//       ]);
//       setModelsLoaded(true);
//     })();
//   }, []);

//   // ---------------- On File Load ----------------
//   useEffect(() => {
//     if (!location?.state?.file) {
//       toast.info("No image found. Please upload again.");
//       navigate("/uploads");
//       return;
//     }
//     const file = location.state.file;
//     const url = URL.createObjectURL(file);
//     setImageUrl(url);
//     return () => URL.revokeObjectURL(url);
//   }, [location, navigate]);

//   // ---------------- Detect Face & Create Profile Image ----------------
//   useEffect(() => {
//     if (!imageUrl || !modelsLoaded) return;

//     (async () => {
//       try {
//         const img = await loadImage(imageUrl);
//         const detections = await faceapi
//           .detectAllFaces(
//             img,
//             new faceapi.TinyFaceDetectorOptions({
//               inputSize: 512,
//               scoreThreshold: 0.5,
//             })
//           )
//           .withFaceLandmarks();

//         if (!detections.length) {
//           toast.error("No face detected in image.");
//           return;
//         }

//         const { box } = detections[0].detection;

//         // 🔹 Create a profile-style crop box (face + body)
//         const cropBox = {
//           x: Math.max(box.x - box.width * 0.3, 0),
//           y: Math.max(box.y - box.height * 0.6, 0),
//           width: box.width * 1.6,
//           height: box.height * 2.0,
//         };

//         const canvas = document.createElement("canvas");
//         const ctx = canvas.getContext("2d");
//         canvas.width = cropBox.width;
//         canvas.height = cropBox.height;

//         ctx.drawImage(
//           img,
//           cropBox.x,
//           cropBox.y,
//           cropBox.width,
//           cropBox.height,
//           0,
//           0,
//           cropBox.width,
//           cropBox.height
//         );

//         // Convert canvas to new image URL
//         const croppedDataUrl = canvas.toDataURL("image/jpeg");
//         setImageUrl(imageUrl);
//         toast.success("Profile view generated successfully!");
//       } catch (err) {
//         console.error("Face detection failed:", err);
//         toast.error("Could not prepare profile image.");
//       }
//     })();
//   }, [imageUrl, modelsLoaded]);

//   // ---------------- Crop & Save ----------------
//   const handleCrop = useCallback(async () => {
//     try {
//       if (!imageUrl || !croppedAreaPixels) return;
//       const { blob, url } = await getCroppedImg(imageUrl, croppedAreaPixels);
//       setCroppedImageUrl(url);
//       toast.success("Image cropped successfully!");
//     } catch (err) {
//       console.error("Crop error:", err);
//       toast.error("Something went wrong while cropping");
//     }
//   }, [imageUrl, croppedAreaPixels]);

//   const handleSave = useCallback(async () => {
//     if (!croppedImageUrl) {
//       toast.error("No cropped image to preview.");
//       return;
//     }
//     // Hide cropper
//     setCropping(false);
//     toast.success("Cropped image saved! Preview below.");
//     // Optional: upload to server here if needed
//   }, [croppedImageUrl]);

//   const onCropComplete = useCallback((_, croppedPixels) => {
//     setCroppedAreaPixels(croppedPixels);
//   }, []);

//   // ---------------- UI ----------------
//   return (
//     <Box
//       sx={{
//         width: "100%",
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//       }}
//     >
//       <Grid
//         container
//         mx="auto"
//         maxWidth="775px"
//         alignItems="center"
//         justifyContent="center"
//         rowGap={3}
//         py={2.5}
//       >
//         <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
//           <Toolbar
//             onCrop={() => handleCrop()}
//             onSave={handleSave}
//             onSaveLoading={upLoading}
//           />
//         </Grid>

//         {/* Cropper View */}
//         <Grid
//           size={12}
//           px={2}
//           sx={{ display: "flex", justifyContent: "center" }}
//         >
//           {cropping && imageUrl ? (
//             <Box
//               sx={{
//                 position: "relative",
//                 mx: "auto",
//                 width: "95%",
//                 height: 250,
//               }}
//             >
//               <Cropper
//                 image={imageUrl}
//                 crop={crop}
//                 zoom={zoom}
//                 aspect={1}
//                 cropShape="round"
//                 showGrid={false}
//                 onCropChange={setCrop}
//                 onZoomChange={setZoom}
//                 onCropComplete={onCropComplete}
//                 style={{
//                   cropAreaStyle: {
//                     border: "4px solid red",
//                     borderRadius: "50%",
//                   },
//                 }}
//               />
//             </Box>
//           ) : croppedImageUrl ? (
//             // ✅ Preview the saved cropped image
//             <Box
//               component="img"
//               src={croppedImageUrl}
//               sx={{
//                 mx: "auto",
//                 maxWidth: "90vw",
//                 minHeight: "380px",
//                 maxHeight: "60vh",
//                 objectFit: "contain",
//                 display: "block",
//                 borderRadius: "50%", // optional, keep it round
//                 border: "4px solid red",
//               }}
//             />
//           ) : (
//             <Guide />
//           )}
//         </Grid>

//         {/* Zoom & Buttons */}
//         {cropping && (
//           <Stack spacing={2} alignItems="center" my={3}>
//             <Slider
//               value={zoom}
//               min={1}
//               max={3}
//               step={0.1}
//               onChange={(e, z) => setZoom(z)}
//               sx={{ width: 200 }}
//             />
//             <Stack direction="row" spacing={1.5}>
//               <Button variant="contained" onClick={handleCrop}>
//                 Crop
//               </Button>
//               <Button variant="contained" color="accent" onClick={handleSave}>
//                 Save
//               </Button>
//             </Stack>
//           </Stack>
//         )}
//       </Grid>
//     </Box>
//   );
// }

import { useEffect, useState, useCallback } from "react";
import { Box, Grid, Slider, Button, Stack } from "@mui/material";
import Cropper from "react-easy-crop";
import * as faceapi from "face-api.js";
import Toolbar from "../components/Toolbar";
import Guide from "../components/Guide";
import { toast } from "react-toastify";
import { useUploadImageMutation } from "../services/image";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { apiSlice } from "../api/apiSlice";
import { useDispatch } from "react-redux";

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
      console.log(imgObj, "url");
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

      // crop result
      const { blob, url } = await getCroppedImg(
        imageUrl.url,
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
  }, [imageUrl, croppedAreaPixels, detectFacesInBlob]);

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
        formData.append("files", result?.file);

        const res = await uploadImage({ id, formData }).unwrap();

        if (res?.data) {
          toast.success("Cropped image uploaded successfully!");
          setCropping(false);
          dispatch(apiSlice.util.invalidateTags(["Images"]));
          setTimeout(() => {
            navigate("/uploads");
          }, 3000);
        } else {
          toast.error("Upload failed!");
        }
      } catch (err) {
        console.error("Upload error:", err);
        toast.error("Something went wrong during upload");
      }
    },
    [uploadImage, id, setCropping]
  );

  const onCropAndSave = async () => {
    const result = await handleCrop();
    if (result) {
      await handleSave(result.blob, result.url);
    }
  };

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
          {image && (
            <Toolbar
              onCrop={setCropping}
              onSave={onCropAndSave}
              onSaveLoading={upLoading}
              onSaveDisabled={cropping}
            />
          )}
        </Grid>

        {/* Image or Cropper */}
        <Grid
          size={12}
          px={2}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          {cropping ? (
            // Cropper view
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
                // image={croppedImageUrl || imageUrl.url}
                image={imageUrl.url}
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
          ) : imageUrl ? (
            <Box
              component="img"
              src={imageUrl.url}
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
              onClick={() => navigate("/uploads")}
              loading={upLoading}
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

export default Upload;
