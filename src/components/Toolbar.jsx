import { Stack, Button, Typography } from "@mui/material";
import LayersClearIcon from "@mui/icons-material/LayersClear";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import FaceIcon from "@mui/icons-material/Face";
import MovieCreationIcon from "@mui/icons-material/MovieCreation";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CropIcon from "@mui/icons-material/Crop";
import { useDispatch, useSelector } from "react-redux";

import { useLocation } from "react-router-dom";
import {
  useCreateVideoMutation,
  useDetectFaceMutation,
  useRemoveBgMutation,
  useSolidFillMutation,
} from "../services/image";

const Toolbar = ({ onCrop }) => {
  const dispatch = useDispatch();

  const { url, images } = useSelector((state) => state.images);

  const [removeBg] = useRemoveBgMutation();
  const [solidFill] = useSolidFillMutation();
  const [detectFace] = useDetectFaceMutation();
  const [createVideo] = useCreateVideoMutation();

  const items = [
    // {
    //   label: "Remove Background",
    //   icon: <LayersClearIcon fontSize="small" />,
    //   type: "remove-bg",
    // },
    // {
    //   label: "Solid Fill",
    //   icon: <FormatColorFillIcon fontSize="small" />,
    //   type: "solid-fill",
    // },
    // {
    //   label: "Detect Face",
    //   icon: <FaceIcon fontSize="small" />,
    //   type: "detect-face",
    // },
    {
      label: "Adjust",
      icon: <CropIcon fontSize="small" />,
      type: "crop",
    },
    // {
    //   label: "Create Video",
    //   icon: <MovieCreationIcon fontSize="small" />,
    //   type: "create-video",
    // },
  ];

  const location = useLocation();
  const initialFile = location.state?.file;

  const handleAction = async (type) => {
    if (type === "download") {
      if (!url) {
        console.error("❌ No URL found to download");
        return;
      }

      try {
        // blob fetch krte hain taake download proper ho
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = "downloaded-image.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("❌ Download failed:", error);
      }
      return;
    }

    dispatch(setLoading(true));
    // try {
    //   const formData = new FormData();
    //   formData.append("files", initialFile);

    //   let res;
    //   if (type === "remove-bg") res = await removeBg(formData).unwrap();
    //   if (type === "solid-fill") res = await solidFill(formData).unwrap();
    //   if (type === "detect-face") res = await detectFace(formData).unwrap();
    //   if (type === "create-video") res = await createVideo(formData).unwrap();

    //   console.log(res?.paths[0], "res");
    //   if (res.paths) {
    //     dispatch(setImageUrl(res.paths[0]));
    //   }
    // } catch (err) {
    //   console.error("❌ API Error:", err);
    // } finally {
    //   dispatch(setLoading(false));
    // }

    try {
      const formData = new FormData();
      formData.append("files", initialFile);

      let res;
      if (type === "remove-bg") {
        res = await removeBg(formData).unwrap();
        // if (res.paths) dispatch(setImageUrl(""));
      }

      if (type === "solid-fill") {
        res = await solidFill(formData).unwrap();
        // if (res.paths) dispatch(setImageUrl(""));
      }

      if (type === "detect-face") {
        res = await detectFace(formData).unwrap();
        // if (res.paths) dispatch(setImageUrl(""));
      }

      if (type === "crop") {
        // res = await createVideo(formData).unwrap();
        // if (res.paths) dispatch(setImageUrl(res.paths[0]));
      }

      if (type === "create-video") {
        res = await createVideo(formData).unwrap();
        // if (res.paths) dispatch(setImageUrl(res.paths[0]));
      }

      console.log(res?.paths[0], "res");
    } catch (err) {
      console.error("❌ API Error:", err);
    } finally {
      // dispatch(setLoading(false));
    }
  };

  return (
    <Stack
      direction={{ xs: "row", sm: "row" }}
      alignItems="center"
      spacing={{ xs: 0.5, sm: 1.5 }}
      sx={{
        borderRadius: "999px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        pl: { xs: 0.5, sm: 1 },
        pr: { xs: 0.5, sm: 1 },
        bgcolor: "#fff",
      }}
    >
      {items.map((item, idx) => (
        <Stack
          key={idx}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          spacing={1}
          sx={{
            py: 1.5,
            px: 1,
            textTransform: "none",
            color: "black",
            fontWeight: 500,
            cursor: "pointer",
            "&:hover span": {
              color: "primary.main",
            },
          }}
          // onClick={() => handleAction(item.type)}
          onClick={() => onCrop(true)}
        >
          <Box component={"img"} src={''} >{item.icon}</Box>
          <Typography
            sx={{
              display: { xs: "none", md: "flex" },
            }}
          >
            {item.label}
          </Typography>
        </Stack>
      ))}

      <Button
        variant="contained"
        color="primary"
        // disabled={url === null}
        sx={{
          borderRadius: "999px",
          textTransform: "none",
          boxShadow: "none",
          fontWeight: 600,
          px: 2.5,
        }}
        onClick={() => handleAction("download")}
      >
        Save Photo
      </Button>
    </Stack>
  );
};

export default Toolbar;
