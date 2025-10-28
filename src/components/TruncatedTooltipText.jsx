import { useRef, useState, useEffect } from "react";
import { Tooltip, Typography, Box } from "@mui/material";

export default function TruncatedTooltipText({
  text,
  maxWidth = 200,
  variant = "body2",
  color = "text.secondary",
  letterSpacing = 1,
  ...props
}) {
  const textRef = useRef(null);
  const [isOverflowed, setIsOverflowed] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsOverflowed(el.scrollWidth > el.clientWidth);
    }
  }, [text]);

  const typography = (
    <Typography
      ref={textRef}
      variant={variant}
      color={color}
      letterSpacing={letterSpacing}
      noWrap
      sx={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        cursor: isOverflowed ? "pointer" : "default",
      }}
      {...props}
    >
      {text}
    </Typography>
  );

  return (
    <Box sx={{ maxWidth, mx: "auto" }}>
      {isOverflowed ? (
        <Tooltip
          title={text}
          arrow
          componentsProps={{
            tooltip: {
              sx: (theme) => ({
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontSize: 13,
                padding: "6px 10px",
                borderRadius: "6px",
                letterSpacing: 1.2,
              }),
            },
            arrow: {
              sx: (theme) => ({
                color: theme.palette.primary.main,
              }),
            },
          }}
        >
          {typography}
        </Tooltip>
      ) : (
        typography
      )}
    </Box>
  );
}
