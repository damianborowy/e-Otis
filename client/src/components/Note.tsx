import React from "react";
import styles from "./Note.module.scss";
import {
    Card,
    CardContent,
    Typography,
    Dialog,
    DialogContentText,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Hidden,
    IconButton
} from "@material-ui/core";
import NoteModel from "../models/Note";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import noteApi from "../apis/NoteAPI";
import { ArrowBack } from "@material-ui/icons";

interface INoteProps {
    model: NoteModel;
}

const pickColorClass = (colorNum: number) => {
    return styles.color;
};

const Note = ({ model }: INoteProps) => {
    const note = { ...model },
        [open, setOpen] = React.useState(false),
        [title, setTitle] = React.useState(note.title),
        [content, setContent] = React.useState(note.content),
        color = note.color ? pickColorClass(note.color) : "",
        theme = useTheme(),
        fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

    const openDialog = () => setOpen(true);
    const closeDialog = () => setOpen(false);

    const updateNote = async () => await noteApi.update(note);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const title = event.target.value;
        setTitle(title);
        note.title = title;
        updateNote();
    };

    const handleContentChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const content = event.target.value;
        setContent(content);
        note.content = content;
        updateNote();
    };

    return (
        <>
            <Card
                className={clsx(styles.card)}
                variant="outlined"
                onClick={openDialog}
            >
                <CardContent className={styles.cardContent}>
                    <Typography style={{ fontWeight: "bold" }}>
                        {title}
                    </Typography>
                    <Typography>{content}</Typography>
                </CardContent>
            </Card>
            <Dialog fullWidth open={open} fullScreen={fullScreen}>
                <DialogTitle className={color}>
                    <Hidden smUp>
                        <IconButton onClick={closeDialog}>
                            <ArrowBack />
                        </IconButton>
                    </Hidden>
                    <TextField
                        value={title}
                        placeholder="Title"
                        onChange={handleTitleChange}
                        fullWidth
                    />
                </DialogTitle>
                <DialogContent className={color}>
                    <DialogContentText>
                        <TextField
                            multiline
                            rowsMax={20}
                            value={content}
                            placeholder="Content"
                            onChange={handleContentChange}
                            fullWidth
                        />
                    </DialogContentText>
                </DialogContent>
                <Hidden xsDown>
                    <DialogActions className={color}>
                        <Button color="primary" onClick={closeDialog}>
                            Close
                        </Button>
                    </DialogActions>
                </Hidden>
            </Dialog>
        </>
    );
};

export default Note;
