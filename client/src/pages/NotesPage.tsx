import React, { useState, useEffect, useCallback, useRef } from "react";
import { Redirect } from "react-router-dom";
import styles from "./NotesPage.module.scss";
import { isTokenPresent, removeToken } from "../utils/TokenHandler";
import { Fab, CircularProgress, useTheme } from "@material-ui/core";
import { Add } from "@material-ui/icons/";
import NoteModel from "../models/Note";
import Container from "@material-ui/core/Container";
import noteApi from "../apis/NoteAPI";
import { withThemeProvider } from "../components/DarkModeProvider";
import NotesGrid from "../components/NotesPage/NotesGrid";
import Drawer from "../components/NotesPage/Drawer";
import { getEmailFromToken } from "../utils/TokenHandler";
import AppBar from "../components/NotesPage/AppBar";
import FilterSettings from "../models/FilterSettings";

const NotesPage = () => {
    const theme = useTheme(),
        [logOut, setLogOut] = useState(false),
        [notes, setNotes] = useState<NoteModel[] | null>(null),
        [filteredNotes, setFilteredNotes] = useState<NoteModel[] | null>(null),
        [drawerOpen, setDrawerOpen] = useState(false),
        prevNotesLength = useRef(-1);

    useEffect(() => {
        const fetchNotes = async () => {
            const result = await noteApi.read();
            setNotes(result.payload);
            setFilteredNotes(result.payload);
        };

        fetchNotes();
    }, []);

    useEffect(() => {
        if (!notes || !filteredNotes) return;

        if (notes.length !== prevNotesLength.current) {
            const newFilteredNotes = [...filteredNotes];

            const newNotes = notes.filter(
                (note) => !filteredNotes.includes(note)
            );
            const deletedNotes = filteredNotes.filter(
                (note) => !notes.includes(note)
            );

            for (let note of newNotes) newFilteredNotes.push(note);

            for (let note of deletedNotes) {
                const deletedNoteIndex = filteredNotes.indexOf(note);
                newFilteredNotes.splice(deletedNoteIndex, 1);
            }

            setFilteredNotes(newFilteredNotes);

            prevNotesLength.current = notes.length;
        }
    }, [notes, filteredNotes]);

    useEffect(() => {
        const logOut = !isTokenPresent();
        setLogOut(logOut);

        if (logOut) return;
    }, [logOut]);

    const applyFilters = useCallback(
        (filterSettings: FilterSettings, searchText: string) => {
            const _filterByText = (
                filterSettings: FilterSettings,
                searchText: string
            ): NoteModel[] => {
                if (!notes) return [];
                if (searchText.length === 0) return notes;

                const filteredNotes = [];

                if (filterSettings.titles)
                    filteredNotes.push(
                        ...notes.filter((note) =>
                            note.title
                                ?.toLowerCase()
                                .includes(searchText.toLowerCase())
                        )
                    );

                if (filterSettings.contents)
                    filteredNotes.push(
                        ...notes.filter((note) =>
                            note.content
                                ?.toLowerCase()
                                .includes(searchText.toLowerCase())
                        )
                    );

                if (filterSettings.tags)
                    filteredNotes.push(
                        ...notes.filter((note) => {
                            const filteredByTags = note.tags?.filter((tag) =>
                                tag
                                    .toLowerCase()
                                    .includes(searchText.toLowerCase())
                            );

                            return filteredByTags && filteredByTags.length > 0;
                        })
                    );

                return _getUniqueNotes(filteredNotes);
            };

            const _filterByColors = (colors: string[]): NoteModel[] => {
                if (!notes) return [];
                if (colors.length === 0) return notes;

                const filteredNotes = notes.filter((note) =>
                    colors.includes(note.color.toLowerCase())
                );

                return _getUniqueNotes(filteredNotes);
            };

            const _getUniqueNotes = (notes: NoteModel[]): NoteModel[] => {
                const result = [];
                const map = new Map();
                for (const note of notes) {
                    if (!map.has(note._id)) {
                        map.set(note._id, true);
                        result.push(note);
                    }
                }

                return result;
            };

            if (!notes) return;

            if (
                filterSettings.selectedColors.length === 0 &&
                searchText === ""
            ) {
                return setFilteredNotes([...notes]);
            }

            const notesFilteredByText = _filterByText(
                filterSettings,
                searchText
            );
            const notesFilteredBySettings = _filterByColors(
                filterSettings.selectedColors
            );

            if (
                notesFilteredByText.length === 0 &&
                notesFilteredBySettings.length === 0
            ) {
                return setFilteredNotes([]);
            }

            const intersectedNotes = notesFilteredByText.filter((note) =>
                notesFilteredBySettings.includes(note)
            );

            setFilteredNotes(intersectedNotes);
        },
        [notes]
    );

    const deleteNoteFromList = (oldNote: NoteModel) => {
        if (!notes) return;

        const newNotes = notes.filter((note) => note._id !== oldNote._id);

        setNotes(newNotes);
    };

    const handleLogOutButtonClick = () => {
        removeToken();
        setLogOut(!isTokenPresent());
    };

    const renderLogOut = () => {
        if (logOut) return <Redirect to="/"></Redirect>;
    };

    const onDrawerOpen = () => setDrawerOpen(true);

    const onDrawerClose = () => setDrawerOpen(false);

    const onFabClick = async () => {
        const result = await noteApi.create();

        if (!result) return;

        const newNote = result.payload;
        newNote.wasJustCreated = true;

        setNotes([...notes, newNote]);
    };

    return (
        <div className={styles.app} id="div1">
            <AppBar onDrawerOpen={onDrawerOpen} applyFilters={applyFilters} />
            <Drawer
                notes={filteredNotes}
                drawerOpen={drawerOpen}
                onDrawerClose={onDrawerClose}
                onDrawerOpen={onDrawerOpen}
                handleLogOutButtonClick={handleLogOutButtonClick}
                getEmailFromToken={getEmailFromToken}
            />
            <div
                id="div2"
                style={{ backgroundColor: theme.palette.background.paper }}
                className={styles.container}
            >
                <Container id="container">
                    {renderLogOut()}
                    {filteredNotes ? (
                        <>
                            <NotesGrid
                                notes={filteredNotes.filter(
                                    (note) => note.owner === getEmailFromToken()
                                )}
                                deleteNoteFromList={deleteNoteFromList}
                                name="My notes"
                            />
                            <NotesGrid
                                notes={filteredNotes.filter(
                                    (note) => note.owner !== getEmailFromToken()
                                )}
                                deleteNoteFromList={deleteNoteFromList}
                                name="Notes shared to me"
                            />
                        </>
                    ) : (
                        <div className={styles.loader}>
                            <CircularProgress size={60} />
                        </div>
                    )}
                    <Fab
                        color="primary"
                        className={styles.fab}
                        onClick={onFabClick}
                    >
                        <Add />
                    </Fab>
                </Container>
            </div>
        </div>
    );
};

export default withThemeProvider(NotesPage);
