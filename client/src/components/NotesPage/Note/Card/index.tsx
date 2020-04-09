import React from "react";
import styles from "./Card.module.scss";
import {
    Card as MaterialCard,
    CardContent,
    Typography
} from "@material-ui/core";
import clsx from "clsx";

interface ICardProps {
    openDialog: () => void;
    title: string | undefined;
    content: string | undefined;
}

const Card = ({ title, content, openDialog }: ICardProps) => {
    return (
        <MaterialCard
            className={clsx(styles.card)}
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
                    {title}
                </Typography>
                <Typography>{content}</Typography>
            </CardContent>
        </MaterialCard>
    );
};

export default Card;
