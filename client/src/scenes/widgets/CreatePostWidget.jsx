import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Divider,
  InputBase,
  useTheme,
} from "@mui/material";
import {
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  DeleteOutlined
} from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector, useDispatch } from "react-redux";
import { setPosts } from "state";

const CreatePostWidget = ({ id, profilePicturePath }) => {
  const dispatch = useDispatch();

  // State to toggle image upload, State to store selected image and description
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");

  // Get authentication token from Redux state
  const token = useSelector((state) => state.token);

  // MUI theme for styling
  const { palette } = useTheme();
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  // Function to handle post submission
  const handlePost = async () => {
    const data = {
      userId: id,
      description,
      postPicturePath: image ? image.name : null, // Set image name if an image is selected
    };

    const response = await fetch(`http://localhost:3001/posts/createPost`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const feed = await response.json(); // Get updated feed from server
    dispatch(setPosts(feed)); // Update Redux state with new feed

    // Reset state after posting
    setDescription("");
    setImage(null);
    setIsImage(false);
  };

  const handleSubmit = () => {
    handlePost(); // Call handlePost when user clicks submit
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={profilePicturePath} /> {/* Display user's profile picture */}

        <InputBase
          placeholder={description || "What's on your mind..."} // Placeholder text for input field
          onChange={(e) => setDescription(e.target.value)} // Update description state on change
          value={description} // Controlled input value
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>

      {isImage && (
        <Box border={`1px solid ${palette.neutral.medium}`} borderRadius="5px" mt="1rem" p="1rem">
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png" // Only accept image files
            multiple={false} // Only allow single file upload
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])} // Set the selected image file
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`} // Border styling for dropzone
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <Typography variant="body2" color="text.secondary">Add Image Here</Typography> // Placeholder text
                  ) : (
                    <FlexBetween alignItems="center">
                      <Typography variant="body2">{image.name}</Typography> {/* Display selected image name */}
                      <IconButton onClick={() => setImage(null)} size="small">
                        <DeleteOutlined /> {/* Button to remove selected image */}
                      </IconButton>
                    </FlexBetween>
                  )}
                </Box>
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween alignItems="center">
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>

        <FlexBetween gap="0.25rem">
          <GifBoxOutlined sx={{ color: mediumMain }} />
          <Typography color={mediumMain}>Clip</Typography>
        </FlexBetween>

        <FlexBetween gap="0.25rem">
          <AttachFileOutlined sx={{ color: mediumMain }} />
          <Typography color={mediumMain}>Attachment</Typography>
        </FlexBetween>

        <FlexBetween gap="0.25rem">
          <MicOutlined sx={{ color: mediumMain }} />
          <Typography color={mediumMain}>Audio</Typography>
        </FlexBetween>

        <Button
          onClick={handleSubmit} // Handle post submission
          disabled={!description && !image} // Disable button if no content or image
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          Post
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default CreatePostWidget;