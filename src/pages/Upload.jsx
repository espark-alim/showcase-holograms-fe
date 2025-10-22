// import { useRef, useState, useEffect, useCallback } from "react";
// import {
//   Box,
//   Stack,
//   Typography,
//   Button,
//   IconButton,
//   Grid,
//   Paper,
//   Avatar,
//   Tooltip,
//   Dialog,
//   Slider,
// } from "@mui/material";
// import UploadFileIcon from "@mui/icons-material/UploadFile";
// import DeleteIcon from "@mui/icons-material/Delete";
// import Cropper from "react-easy-crop";

// const Upload = ({ max = 30, onDone }) => {
//   const [files, setFiles] = useState([]); // [{ file, preview, id }]
//   const inputRef = useRef(null);

//   // Crop state
//   const [imageSrc, setImageSrc] = useState(null);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [openCrop, setOpenCrop] = useState(false);

//   // cleanup URLs
//   useEffect(() => {
//     return () => {
//       files.forEach((f) => URL.revokeObjectURL(f.preview));
//     };
//   }, [files]);

//   const isDuplicate = (file) =>
//     files.some(
//       (f) =>
//         f.file.name === file.name &&
//         f.file.size === file.size &&
//         f.file.lastModified === file.lastModified
//     );

//   const handleFilesSelected = async (e) => {
//     const selected = Array.from(e.target.files || []);
//     if (!selected.length) return;

//     const firstFile = selected[0];
//     if (isDuplicate(firstFile)) {
//       alert("This photo already exists!");
//       e.target.value = null;
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = () => {
//       setImageSrc(reader.result);
//       setOpenCrop(true);
//     };
//     reader.readAsDataURL(firstFile);
//     e.target.value = null;
//   };

//   const handleClickUpload = () => {
//     if (files.length >= max) return;
//     inputRef.current?.click();
//   };

//   const handleRemove = (id) => {
//     setFiles((prev) => {
//       const found = prev.find((p) => p.id === id);
//       if (found) URL.revokeObjectURL(found.preview);
//       return prev.filter((p) => p.id !== id);
//     });
//   };

//   const handleDone = () => {
//     if (typeof onDone === "function") {
//       onDone(files.map((f) => f.file));
//     } else {
//       alert(`${files.length} photo(s) ready to upload`);
//     }
//   };

//   const onCropComplete = useCallback((_, croppedPixels) => {
//     setCroppedAreaPixels(croppedPixels);
//   }, []);

//   // Convert cropped area to blob URL
//   const getCroppedImage = async (imageSrc, cropPixels) => {
//     const image = await createImage(imageSrc);
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     canvas.width = cropPixels.width;
//     canvas.height = cropPixels.height;

//     ctx.drawImage(
//       image,
//       cropPixels.x,
//       cropPixels.y,
//       cropPixels.width,
//       cropPixels.height,
//       0,
//       0,
//       cropPixels.width,
//       cropPixels.height
//     );

//     return new Promise((resolve) => {
//       canvas.toBlob((blob) => {
//         const file = new File([blob], "cropped_photo.jpg", {
//           type: "image/jpeg",
//         });
//         const preview = URL.createObjectURL(blob);
//         resolve({ file, preview });
//       }, "image/jpeg");
//     });
//   };

//   const createImage = (url) =>
//     new Promise((resolve, reject) => {
//       const image = new Image();
//       image.addEventListener("load", () => resolve(image));
//       image.addEventListener("error", (error) => reject(error));
//       image.src = url;
//     });

//   const handleCropSave = async () => {
//     const { file, preview } = await getCroppedImage(
//       imageSrc,
//       croppedAreaPixels
//     );
//     setFiles((prev) => [
//       ...prev,
//       { file, preview, id: Math.random().toString(36).slice(2, 9) },
//     ]);
//     setOpenCrop(false);
//     setImageSrc(null);
//     setZoom(1);
//   };

//   return (
//     <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
//       <Stack spacing={2}>
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <Typography variant="h6">Add your photos:</Typography>
//           <Typography variant="body2">
//             ({files.length}/{max} uploaded)
//           </Typography>
//         </Box>

//         <Typography variant="caption" sx={{ color: "text.secondary" }}>
//           Note: Only upload photos of people with focused, clear, and up-close
//           faces.
//         </Typography>

//         <input
//           ref={inputRef}
//           type="file"
//           accept="image/*"
//           style={{ display: "none" }}
//           onChange={handleFilesSelected}
//         />

//         <Stack
//           direction={{ xs: "column", sm: "row" }}
//           spacing={2}
//           alignItems="center"
//         >
//           <Button
//             variant="contained"
//             startIcon={<UploadFileIcon />}
//             onClick={handleClickUpload}
//             disabled={files.length >= max}
//           >
//             Click to Upload
//           </Button>

//           <Box flexGrow={1} />

//           <Button
//             variant="outlined"
//             onClick={handleDone}
//             disabled={files.length === 0}
//           >
//             Done adding all photos!
//           </Button>
//         </Stack>

//         <Grid container spacing={2} sx={{ mt: 1 }}>
//           {files.length === 0 ? (
//             <Grid item xs={12}>
//               <Paper
//                 variant="outlined"
//                 sx={{ p: 2, textAlign: "center", bgcolor: "background.paper" }}
//               >
//                 <Typography variant="body2" color="text.secondary">
//                   No photos uploaded yet — click “Click to Upload” to add some.
//                 </Typography>
//               </Paper>
//             </Grid>
//           ) : (
//             files.map((item) => (
//               <Grid item xs={6} sm={4} md={3} key={item.id}>
//                 <Paper sx={{ p: 1, position: "relative", borderRadius: 2 }}>
//                   <Avatar
//                     src={item.preview}
//                     variant="rounded"
//                     sx={{ width: "100%", height: 140 }}
//                   />
//                   <Tooltip title="Remove photo">
//                     <IconButton
//                       size="small"
//                       color="error"
//                       sx={{
//                         position: "absolute",
//                         top: 4,
//                         right: 4,
//                         bgcolor: "background.paper",
//                       }}
//                       onClick={() => handleRemove(item.id)}
//                     >
//                       <DeleteIcon fontSize="small" />
//                     </IconButton>
//                   </Tooltip>
//                 </Paper>
//               </Grid>
//             ))
//           )}
//         </Grid>
//       </Stack>

//       {/* Crop Dialog */}
//       <Dialog
//         open={openCrop}
//         onClose={() => {
//           setOpenCrop(false);
//           setZoom(1);
//         }}
//         maxWidth="sm"
//         fullWidth
//       >
//         <Box sx={{ position: "relative", height: 400, bgcolor: "#333" }}>
//           <Cropper
//             image={imageSrc}
//             crop={crop}
//             zoom={zoom}
//             aspect={1}
//             onCropChange={setCrop}
//             onZoomChange={setZoom}
//             onCropComplete={onCropComplete}
//           />
//         </Box>
//         <Stack direction="row" alignItems="center" spacing={2} p={2}>
//           <Typography variant="body2">Zoom</Typography>
//           <Slider
//             value={zoom}
//             min={1}
//             max={3}
//             step={0.1}
//             onChange={(_, z) => setZoom(z)}
//           />
//           <Box flexGrow={1} />
//           <Button
//             variant="outlined"
//             onClick={() => {
//               setOpenCrop(false);
//               setZoom(1);
//             }}
//           >
//             Cancel
//           </Button>
//           <Button variant="contained" onClick={handleCropSave}>
//             Save
//           </Button>
//         </Stack>
//       </Dialog>
//     </Paper>
//   );
// };

// export default Upload;

// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   Grid,
//   Paper,
//   CircularProgress,
// } from "@mui/material";
// import Cropper from "react-easy-crop";
// import * as faceapi from "@vladmandic/face-api";

// export default function Upload() {
//   const [loading, setLoading] = useState(false);
//   const [processed, setProcessed] = useState([]);

//   // ------------------ Load Models ------------------
//   const loadModels = async () => {
//     await Promise.all([
//       faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
//       faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
//     ]);
//   };

//   // ------------------ Load Image Utility ------------------
//   const loadImage = (src) =>
//     new Promise((resolve) => {
//       const img = new Image();
//       img.onload = () => resolve(img);
//       img.src = src;
//     });

//   // ------------------ Handle Upload ------------------
//   const handleUpload = async (e) => {
//     const files = Array.from(e.target.files).slice(0, 30); // max 30 images
//     if (!files.length) return;

//     setLoading(true);
//     setProcessed([]);

//     // Load models before detecting
//     await loadModels();

//     const validImages = [];

//     for (const file of files) {
//       const imgURL = URL.createObjectURL(file);
//       const img = await loadImage(imgURL);

//       // Detect face using tiny face detector
//       const detections = await faceapi
//         .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
//         .withFaceLandmarks();

//       if (detections) {
//         const { box } = detections.detection;

//         // Create custom crop box for face + half-body
//         const cropBox = {
//           x: Math.max(box.x - box.width * 0.3, 0),
//           y: Math.max(box.y - box.height * 0.2, 0),
//           width: box.width * 1.6,
//           height: box.height * 10,
//         };

//         validImages.push({ src: imgURL, cropBox });
//       }
//     }

//     setProcessed(validImages);
//     setLoading(false);
//   };

//   // ------------------ UI ------------------
//   return (
//     <Paper sx={{ p: 4, borderRadius: 4 }}>
//       <Typography variant="h5" gutterBottom>
//         Upload People Photos (up to 30)
//       </Typography>
//       <Typography variant="body2" color="text.secondary" mb={2}>
//         Only clear photos of people (face + upper body) are accepted.
//       </Typography>

//       <Button variant="contained" component="label">
//         Click to Upload
//         <input
//           type="file"
//           accept="image/*"
//           hidden
//           multiple
//           onChange={handleUpload}
//         />
//       </Button>

//       {loading && (
//         <Box mt={3} textAlign="center">
//           <CircularProgress />
//           <Typography variant="body2" mt={1}>
//             Detecting faces...
//           </Typography>
//         </Box>
//       )}

//       {!loading && processed.length > 0 && (
//         <Grid container spacing={2} mt={3}>
//           {processed.map((img, i) => (
//             <Grid item xs={12} sm={6} md={4} key={i}>
//               <Paper
//                 elevation={3}
//                 sx={{
//                   borderRadius: 3,
//                   overflow: "hidden",
//                   position: "relative",
//                   height: 300,
//                 }}
//               >
//                 <Box component={"img"} src={img.src} sx />
//                 <Cropper
//                   image={img?.src}
//                   crop={{ x: 0, y: 0 }}
//                   zoom={1}
//                   aspect={3 / 4}
//                   cropSize={{
//                     width: img.cropBox.width,
//                     height: img.cropBox.height,
//                   }}
//                   showGrid={false}
//                   onCropChange={() => {}} // 🔹 added dummy handlers
//                   onZoomChange={() => {}}
//                   onCropComplete={() => {}}
//                   disabled
//                 />
//               </Paper>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       {!loading && processed.length === 0 && (
//         <Typography mt={3} align="center" color="text.secondary">
//           📸 No valid person images found.
//         </Typography>
//       )}
//     </Paper>
//   );
// }

// import { useState } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   Grid,
//   Paper,
//   CircularProgress,
// } from "@mui/material";
// import * as faceapi from "@vladmandic/face-api";

// export default function Upload() {
//   const [loading, setLoading] = useState(false);
//   const [processed, setProcessed] = useState([]);

//   // ------------------ Load Models ------------------
//   const loadModels = async () => {
//     await Promise.all([
//       faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
//       faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
//     ]);
//   };

//   // ------------------ Load Image Utility ------------------
//   const loadImage = (src) =>
//     new Promise((resolve) => {
//       const img = new Image();
//       img.onload = () => resolve(img);
//       img.src = src;
//     });

//   // ------------------ Handle Upload ------------------
//   const handleUpload = async (e) => {
//     const files = Array.from(e.target.files).slice(0, 30); // max 30 images
//     if (!files.length) return;

//     setLoading(true);

//     // Load models before detecting
//     await loadModels();

//     const validImages = [];

//     for (const file of files) {
//       // 🔹 Check duplicate by name+size
//       const fileKey = `${file.name}_${file.size}`;

//       // Skip if already processed
//       const alreadyExists = processed.some((img) => img.key === fileKey);
//       if (alreadyExists) continue;

//       const imgURL = URL.createObjectURL(file);
//       const img = await loadImage(imgURL);

//       // Detect face using tiny face detector
//       const detections = await faceapi
//         .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
//         .withFaceLandmarks();

//       if (detections) {
//         const { box } = detections.detection;

//         // Custom crop box (face + upper body)
//         const cropBox = {
//           x: Math.max(box.x - box.width * 0.3, 0),
//           y: Math.max(box.y - box.height * 0.6, 0),
//           width: box.width * 1.6,
//           height: box.height * 2.0,
//         };

//         // Crop via canvas
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

//         const croppedDataUrl = canvas.toDataURL("image/jpeg");

//         validImages.push({
//           key: fileKey, // unique id for duplicate check
//           src: croppedDataUrl,
//         });
//       }
//     }

//     // ✅ Add new (unique) cropped images
//     setProcessed((prev) => [...prev, ...validImages]);
//     setLoading(false);
//   };

//   console.log(processed, 'processed')

//   // ------------------ UI ------------------
//   return (
//     <Paper sx={{ p: 4, borderRadius: 4 }}>
//       <Typography variant="h5" gutterBottom>
//         Upload People Photos (up to 30)
//       </Typography>
//       <Typography variant="body2" color="text.secondary" mb={2}>
//         Only clear photos of people (face + upper body) are accepted.
//       </Typography>

//       <Button variant="contained" component="label">
//         Click to Upload
//         <input
//           type="file"
//           accept="image/*"
//           hidden
//           multiple
//           onChange={handleUpload}
//         />
//       </Button>

//       {loading && (
//         <Box mt={3} textAlign="center">
//           <CircularProgress />
//           <Typography variant="body2" mt={1}>
//             Detecting and cropping faces...
//           </Typography>
//         </Box>
//       )}

//       {!loading && processed.length > 0 && (
//         <Grid container spacing={2} mt={3}>
//           {processed.map((img, i) => (
//             <Grid item xs={12} sm={6} md={4} key={i}>
//               <Paper
//                 elevation={3}
//                 sx={{
//                   borderRadius: 3,
//                   overflow: "hidden",
//                   position: "relative",
//                   height: 300,
//                 }}
//               >
//                 <Box
//                   component="img"
//                   src={img.src}
//                   alt={`Cropped ${i}`}
//                   sx={{
//                     width: "100%",
//                     height: "100%",
//                     objectFit: "cover",
//                   }}
//                 />
//               </Paper>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       {!loading && processed.length === 0 && (
//         <Typography mt={3} align="center" color="text.secondary">
//           📸 No valid person images found.
//         </Typography>
//       )}
//     </Paper>
//   );
// }

// import {
//   Box,
//   Grid,
//   Typography,
//   Slider,
//   Button,
//   Stack,
//   Paper,
// } from "@mui/material";
// import { useLocation } from "react-router-dom";
// import { useEffect, useRef, useState, useCallback } from "react";
// import AddIcon from "@mui/icons-material/Add";
// import { useDispatch, useSelector } from "react-redux";
// import { addImages } from "../store/slices/image/imageSlice";
// import Toolbar from "../components/Toolbar";
// import Cropper from "react-easy-crop";
// import Guide from "../components/Guide";

// // helper for crop
// async function getCroppedImg(imageSrc, croppedAreaPixels) {
//   const image = await createImage(imageSrc);
//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");

//   canvas.width = croppedAreaPixels.width;
//   canvas.height = croppedAreaPixels.height;

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
//       resolve(URL.createObjectURL(blob));
//     }, "image/jpeg");
//   });
// }

// function createImage(url) {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.addEventListener("load", () => resolve(img));
//     img.addEventListener("error", (error) => reject(error));
//     img.setAttribute("crossOrigin", "anonymous");
//     img.src = url;
//   });
// }

// const Upload = () => {
//   const location = useLocation();
//   const initialFile = location.state?.file;
//   const fileInputRef = useRef(null);
//   const dispatch = useDispatch();
//   const { url } = useSelector((state) => state.images);

//   const [images, setImages] = useState([]);
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [cropping, setCropping] = useState(false);

//   // cropper states
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

//   useEffect(() => {
//     if (initialFile) {
//       const url = URL.createObjectURL(initialFile);
//       const imgObj = { file: initialFile, url };
//       setImages([imgObj]);
//     }
//   }, [initialFile]);

//   const handleAddImage = (e) => {
//     const files = Array.from(e.target.files);
//     const newImages = files
//       .filter(
//         (file) =>
//           !images.some(
//             (img) =>
//               img.file.name === file.name &&
//               img.file.size === file.size &&
//               img.file.lastModified === file.lastModified
//           )
//       )
//       .map((file) => ({ file, url: URL.createObjectURL(file) }));

//     if (newImages.length === 0) return;

//     setImages((prev) => [...prev, ...newImages]);
//     // dispatch(addImages(newImages));
//     if (images.length === 0) setSelectedIndex(0);
//     e.target.value = "";
//   };

//   const handleClickPlus = () => {
//     fileInputRef.current.click();
//   };

//   const onCropComplete = useCallback((_, croppedPixels) => {
//     setCroppedAreaPixels(croppedPixels);
//   }, []);

//   const handleCrop = useCallback(async () => {
//     try {
//       const currentImg = images[selectedIndex];
//       const croppedUrl = await getCroppedImg(
//         currentImg?.url,
//         croppedAreaPixels
//       );

//       const updatedImages = images.map((img, idx) =>
//         idx === selectedIndex ? { ...img, url: croppedUrl } : img
//       );

//       setImages(updatedImages);
//       setCropping(false);
//     } catch (e) {
//       console.error(e);
//     }
//   }, [images, selectedIndex, croppedAreaPixels]);

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         height: "100vh",
//         display: "flex",
//         alignItems: "center",
//       }}
//     >
//       <Grid
//         container
//         mx="auto"
//         maxWidth="775px"
//         alignItems="center"
//         justifyContent="space-between"
//         height="100%"
//         maxHeight="1080px"
//         rowGap={3}
//         py={2.5}
//       >
//         <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
//           <Toolbar onCrop={setCropping} />
//         </Grid>

//         {/* Image or Cropper */}
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
//                 height: 450,
//                 overflow: "hidden",
//               }}
//             >
//               <Cropper
//                 image={images[selectedIndex]?.url}
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
//           ) : images.length > 0 ? (
//             <Box
//               component="img"
//               src={url ? url : images[selectedIndex]?.url}
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

//         {/* Controls */}
//         <Grid size={12}>
//           <Box
//             sx={{
//               mx: "auto",
//               width: "fit-content",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: 1.5,
//               px: 1,
//             }}
//           >
//             <Box
//               onClick={handleClickPlus}
//               sx={{
//                 width: { xs: 48, sm: 63 },
//                 height: { xs: 41, sm: 56 },
//                 backgroundColor: "#f0f0f0",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 cursor: "pointer",
//                 borderRadius: "12px",
//                 border: "2px solid transparent",
//               }}
//             >
//               <AddIcon sx={{ fontSize: { xs: "16px", sm: "18px" } }} />
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 style={{ display: "none" }}
//                 onChange={handleAddImage}
//               />
//             </Box>

//             <Box
//               sx={{
//                 width: { xs: "calc(100% - 45px)", sm: "calc(100% - 60px)" },
//                 maxWidth: { xs: "200px", sm: "450px" },
//                 overflowX: "auto",
//                 display: "flex",
//                 gap: 2,
//                 alignItems: "center",
//                 py: 1.5,
//                 "&::-webkit-scrollbar": { height: 4 },
//                 "&::-webkit-scrollbar-thumb": {
//                   background: "#ccc",
//                   borderRadius: 3,
//                 },
//               }}
//             >
//               {images.map((img, idx) => (
//                 <img
//                   key={idx}
//                   src={img.url}
//                   alt={`thumbnail-${idx}`}
//                   style={{
//                     width: "60px",
//                     height: "60px",
//                     borderRadius: "8px",
//                     objectFit: "cover",
//                     objectPosition: "top center",
//                     border:
//                       selectedIndex === idx
//                         ? "2px solid #1976d2"
//                         : "2px solid transparent",
//                     cursor: "pointer",
//                   }}
//                   onClick={() => setSelectedIndex(idx)}
//                 />
//               ))}
//             </Box>
//           </Box>

//           {/* Crop Controls */}
//           {images.length > 0 && (
//             <Stack spacing={2} alignItems="center" mt={3}>
//               {cropping && (
//                 <>
//                   <Slider
//                     value={zoom}
//                     min={1}
//                     max={3}
//                     step={0.1}
//                     onChange={(e, z) => setZoom(z)}
//                     sx={{ width: 200 }}
//                   />
//                   <Stack direction={"row"} spacing={1.5}>
//                     <Button
//                       variant="contained"
//                       onClick={handleCrop}
//                       sx={{
//                         borderRadius: "999px",
//                         textTransform: "none",
//                         fontWeight: 600,
//                       }}
//                     >
//                       Save Crop
//                     </Button>
//                     <Button
//                       variant="contained"
//                       onClick={() => setCropping(false)}
//                       sx={{
//                         borderRadius: "999px",
//                         textTransform: "none",
//                         fontWeight: 600,
//                       }}
//                     >
//                       Cancel
//                     </Button>
//                   </Stack>
//                 </>
//               )}
//             </Stack>
//           )}
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default Upload;

// UploadWithFaceCheck.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Box,
  Grid,
  Typography,
  Slider,
  Button,
  Stack,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Cropper from "react-easy-crop";
import * as faceapi from "face-api.js";
import Toolbar from "../components/Toolbar";
import Guide from "../components/Guide";
import { toast } from "react-toastify";

// helper to create Image element from url (used by cropping)
function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (error) => reject(error));
    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
  });
}

// helper for crop
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

const MAX_IMAGES = 30;

const Upload = () => {
  const location = useLocation();
  const initialFile = location.state?.file;
  const fileInputRef = useRef(null);

  // images state: keep File locally and meta flags; DON'T dispatch full File to Redux
  // each image object: { file, url, faceDetected: boolean|null, facesCount: number, validationMessage?: string }
  const [images, setImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cropping, setCropping] = useState(false);

  // cropper states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // face-api models loaded flag
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

  // load face-api models from /public/models
  useEffect(() => {
    (async () => {
      try {
        // adjust path if you keep models elsewhere
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

  // Detect faces for a single File object
  const detectFacesInFile = useCallback(async (file) => {
    // create object URL and an Image element
    const url = URL.createObjectURL(file);
    try {
      // We use tinyFaceDetector for speed; ssdMobilenetv1 is more accurate but heavier.
      const img = await createImage(url);

      // use canvas-based detection
      const detections = await faceapi
        .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      // cleanup image url object (we'll reuse same url in state)
      // don't revoke here because caller stores it in state and may use it for display/cropping

      return {
        facesCount: detections.length,
        faceDetected: detections.length > 0,
      };
    } catch (err) {
      console.error("face detection failed for file", file.name, err);
      return { facesCount: 0, faceDetected: false, error: true };
    } finally {
      // revoke object url after a small delay to avoid prematurely invalidating <img> used by createImage
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }, []);

  // when user adds files
  const handleAddImage = async (e) => {
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

    // filter duplicates by name+size+lastModified
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

  const handleClickPlus = () => {
    fileInputRef.current.click();
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCrop = useCallback(async () => {
    try {
      const currentImg = images[selectedIndex];
      if (!currentImg) return;
      const croppedUrl = await getCroppedImg(currentImg.url, croppedAreaPixels);

      const updatedImages = images.map((img, idx) =>
        idx === selectedIndex ? { ...img, url: croppedUrl } : img
      );

      setImages(updatedImages);
      setCropping(false);
    } catch (e) {
      console.error(e);
      toast.error(`Crop failed`);
    }
  }, [images, selectedIndex, croppedAreaPixels]);

  // submit handler - only allow when every image has faceDetected === true
  const allImagesValid =
    images.length > 0 && images.every((i) => i.faceDetected === true);

  const handleSubmit = () => {
    if (!allImagesValid) {
      toast.info(`Some images are invalid or have no detected faces.`);
      return;
    }

    // Prepare payload WITHOUT raw File objects if you plan to use Redux
    // Example: upload files directly to server using FormData
    const formData = new FormData();
    images.forEach((img, idx) => {
      formData.append("images", img.file, img.file.name);
    });

    // Example: fetch('/api/upload', { method: 'POST', body: formData })
    toast.info(`Ready to upload (example). Implement your upload logic.`);
    // IMPORTANT: do NOT dispatch files to redux; if you must store in redux, store only metadata (url, facesCount, name).
  };

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
        justifyContent="space-between"
        height="100%"
        maxHeight="1080px"
        rowGap={3}
        py={2.5}
      >
        <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Toolbar onCrop={setCropping} />
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
                image={images[selectedIndex]?.url}
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
              src={images[selectedIndex]?.url}
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

        {/* Controls */}
        <Grid size={12}>
          <Box
            sx={{
              mx: "auto",
              width: "fit-content",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              px: 1,
            }}
          >
            <Box
              onClick={handleClickPlus}
              sx={{
                width: { xs: 48, sm: 63 },
                height: { xs: 41, sm: 56 },
                color: "#fff",
                backgroundColor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                borderRadius: "12px",
                border: "2px solid transparent",
              }}
            >
              <AddIcon sx={{ fontSize: { xs: "16px", sm: "22px" } }} />
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAddImage}
              />
            </Box>

            <Box
              sx={{
                width: { xs: "calc(100% - 45px)", sm: "calc(100% - 60px)" },
                maxWidth: { xs: "200px", sm: "450px" },
                overflowX: "auto",
                display: "flex",
                gap: 2,
                alignItems: "center",
                py: 1.5,
                "&::-webkit-scrollbar": { height: 4 },
                "&::-webkit-scrollbar-thumb": {
                  background: "#ccc",
                  borderRadius: 3,
                },
              }}
            >
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`thumbnail-${idx}`}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "8px",
                    objectFit: "cover",
                    objectPosition: "top center",
                    border:
                      selectedIndex === idx
                        ? "2px solid #1976d2"
                        : "2px solid transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedIndex(idx)}
                />
              ))}
            </Box>
          </Box>

          {/* Crop Controls */}
          {images.length > 0 && (
            <Stack spacing={2} alignItems="center" mt={3}>
              {cropping && (
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
                        fontWeight: 600,
                      }}
                    >
                      Save Crop
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => setCropping(false)}
                      sx={{
                        borderRadius: "999px",
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </>
              )}
            </Stack>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Upload;
