import React, { useState } from "react";
import NoteModel from "../../../../../../models/Note";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from "@material-ui/core";
import { Upload } from "antd";
import { Publish } from "@material-ui/icons";
import { fileUploadHeaders } from "../../../../../../utils/TokenHandler";
import { useStore } from "../../../../../DarkModeProvider";
import {
    UploadFile,
    UploadChangeParam,
    RcFile
} from "antd/lib/upload/interface";
import noteApi from "../../../../../../apis/NoteAPI";

const env = process.env.NODE_ENV || "development";
const serverUrl =
    env === "development"
        ? "http://localhost:5001"
        : "https://yournote-server.herokuapp.com";

interface IAttachmentsDialogProps {
    open: boolean;
    handleClose: () => void;
    handleNoteChange: (note: NoteModel) => void;
    note: NoteModel;
}

const _filesToList = (note: NoteModel): UploadFile<any>[] => {
    return note.files.map((file, i) => {
        return {
            uid: i.toString(),
            name: file,
            status: "done",
            url: `${serverUrl}/attachments/${note._id}/${file}`,
            size: 0,
            type: "foo"
        };
    });
};

const AttachmentsDialog = ({
    open,
    handleClose,
    handleNoteChange,
    note
}: IAttachmentsDialogProps) => {
    const { darkMode } = useStore(),
        [fileList, setFileList] = useState<UploadFile<any>[]>(
            _filesToList(note)
        );

    const onChange = ({ file, fileList }: UploadChangeParam<UploadFile>) => {
        let newFileList = fileList.map((file) => {
            if (file.status === "done")
                file.url = `${serverUrl}/attachments/${note._id}/${file.name}`;

            return file;
        });

        if (file.status === "done") {
            const newNote = { ...note };

            newNote.files.push(file.name);

            handleNoteChange(newNote);
        }

        if (file.status === "removed") {
            const newNote = { ...note };

            const deletedFileIndex = newNote.files.indexOf(file.name);
            newNote.files.splice(deletedFileIndex, 1);

            noteApi.detach(newNote._id, file.name);
            handleNoteChange(newNote);
        }

        setFileList(newFileList);
    };

    const beforeUpload = (file: RcFile, FileList: RcFile[]): boolean => {
        return file.size < 10 * 1024 * 1024;
    };

    const props = {
        action: `${serverUrl}/notes/attach`,
        data: { noteId: note._id },
        headers: fileUploadHeaders(),
        onChange,
        beforeUpload
    };

    return (
        <Dialog
            className={darkMode ? "dark" : "light"}
            open={open}
            onClose={handleClose}
            fullWidth
        >
            <DialogTitle>Attachments</DialogTitle>
            <DialogContent>
                <Upload {...props} fileList={fileList}>
                    <Button startIcon={<Publish />}>Add new</Button>
                </Upload>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AttachmentsDialog;
