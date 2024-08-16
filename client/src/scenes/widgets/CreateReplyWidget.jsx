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

const CreateReplyWidget = ({ id, profilePicturePath, parentPostId = null, replyingTo, onSubmit }) => {
    // State to manage the visibility of the image upload option, State to store the selected image file and reply description
    const [isImage, setIsImage] = useState(false);
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState("");
  
    // Retrieve the theme object from MUI for consistent styling
    const { palette } = useTheme();
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;

    // Handler function for submitting the reply
    const handleSubmit = () => {
        onSubmit(id, description, image, parentPostId, replyingTo);
    };
    
    return (
        <WidgetWrapper>
          <FlexBetween gap="1.5rem">
            <UserImage image={profilePicturePath} /> {/* Display user's profile picture */}
    
            <InputBase
              placeholder={description || "What's on your mind..."} // Placeholder text for the reply input
              onChange={(e) => setDescription(e.target.value)} // Update description state on input change
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
                acceptedFiles=".jpg,.jpeg,.png" // Only accept specific image file types
                multiple={false} // Restrict to single file upload
                onDrop={(acceptedFiles) => setImage(acceptedFiles[0])} // Update image state on file drop
              >
                {({ getRootProps, getInputProps }) => (
                  <FlexBetween>
                    <Box
                      {...getRootProps()}
                      border={`2px dashed ${palette.primary.main}`} // Style for the dropzone border
                      p="1rem"
                      width="100%"
                      sx={{ "&:hover": { cursor: "pointer" } }}
                    >
                      <input {...getInputProps()} /> {/* Hidden input for file selection */}
                      {!image ? (
                        <Typography variant="body2" color="text.secondary">Add Image Here</Typography> // Prompt text
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
    
          <Divider sx={{ margin: "1.25rem 0" }} /> {/* Divider between sections */}
    
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
              onClick={handleSubmit} // Trigger reply submission on button click
              disabled={!description && !image} // Disable button if no content or image is provided
              sx={{
                color: palette.background.alt,
                backgroundColor: palette.primary.main,
                borderRadius: "3rem",
              }}
            >
                Reply
            </Button>

          </FlexBetween>
        </WidgetWrapper>
    );  
};

export default CreateReplyWidget;