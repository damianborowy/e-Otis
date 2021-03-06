import React, { useState } from "react";
import styles from "./CardMenu.module.scss";
import ViewModel from "../../../../../../models/View";
import NoteModel from "../../../../../../models/Note";
import { Menu, MenuItem, Typography } from "@material-ui/core";
import { Add, VisibilityOff } from "@material-ui/icons";
import { useTranslation } from "react-i18next";

interface ICardMenuProps {
    note: NoteModel;
    views: ViewModel[] | null;
    setViews: (views: ViewModel[]) => void;
    selectedView: ViewModel | null;
    setSelectedView: (selectedView: ViewModel) => void;
    anchorEl: null | HTMLElement;
    handleClose: () => void;
}

const CardMenu = (props: ICardMenuProps) => {
    const [subMenuAnchor, setSubMenuAnchor] = useState<null | HTMLElement>(
            null
        ),
        { t } = useTranslation();

    const handleMenuClose = () => setSubMenuAnchor(null);

    const handleAddMenuOpen = (event: React.MouseEvent<HTMLLIElement>) => {
        props.handleClose();
        setSubMenuAnchor(event.currentTarget);
    };

    const handleAddToView = (viewName: string) => {
        const viewsCopy = [...props.views];
        const targetViewIndex = viewsCopy.findIndex(
            (view) => view.name === viewName
        );

        if (!viewsCopy[targetViewIndex].notes.includes(props.note._id)) {
            viewsCopy[targetViewIndex].notes.push(props.note._id);
            props.setViews(viewsCopy);
        }

        handleMenuClose();
    };

    const handleHideClicked = () => {
        if (!props.selectedView) return;

        const viewsCopy = [...props.views];
        const targetViewIndex = viewsCopy.findIndex(
            (view) => view.name === props.selectedView!.name
        );

        const selectedViewCopy = { ...viewsCopy[targetViewIndex] };
        const targetNoteIndex = selectedViewCopy.notes.findIndex(
            (noteId) => noteId === props.note._id
        );

        selectedViewCopy.notes.splice(targetNoteIndex, 1);
        viewsCopy[targetViewIndex] = selectedViewCopy;

        props.setSelectedView(selectedViewCopy);
        props.setViews(viewsCopy);
        handleMenuClose();
    };

    return (
        <>
            <Menu
                anchorEl={props.anchorEl}
                keepMounted
                open={Boolean(props.anchorEl)}
                onClose={props.handleClose}
            >
                <MenuItem onClick={handleAddMenuOpen}>
                    <Add />
                    <Typography className={styles.typography}>
                        {t("notes.menu.add")}
                    </Typography>
                </MenuItem>
                <MenuItem
                    onClick={handleHideClicked}
                    disabled={
                        props.selectedView &&
                        props.selectedView.name === "All notes"
                            ? true
                            : false
                    }
                >
                    <VisibilityOff />
                    <Typography className={styles.typography}>
                        {t("notes.menu.hide")}
                    </Typography>
                </MenuItem>
            </Menu>
            <Menu
                anchorEl={subMenuAnchor}
                keepMounted
                open={Boolean(subMenuAnchor)}
                onClose={handleMenuClose}
            >
                {props.views && props.views.length > 1 ? (
                    props.views.slice(1).map((view) => (
                        <MenuItem
                            key={view.name}
                            onClick={() => handleAddToView(view.name)}
                        >
                            {view.name}
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem disabled>{t("notes.menu.noViews")}</MenuItem>
                )}
            </Menu>
        </>
    );
};

export default CardMenu;
