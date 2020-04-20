import React from "react";
import styles from "./Card.module.scss";
import {
    Card as MaterialCard,
    CardContent,
    Typography,
    useTheme
} from "@material-ui/core";
import clsx from "clsx";
import NoteModel from "../../../../../models/Note";

interface ICardProps {
    openDialog: () => void;
    note: NoteModel;
}
const Card = ({ note, openDialog }: ICardProps) => {
    const theme = useTheme();

    return (
        <MaterialCard
            className={clsx(
                styles.card,
                theme.palette.type || "light",
                note.color?.toLowerCase()
            )}
            variant="outlined"
            onClick={openDialog}
        >
            <CardContent className={styles.cardContent}>
                <Typography
                    component="span"
                    variant="body1"
                    style={{
                        fontWeight: "bold"
                    }}
                >
                    {note.title}
                </Typography>
                <Typography>{note.content}</Typography>
            </CardContent>
        </MaterialCard>
    );
};

export default Card;