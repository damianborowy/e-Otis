import React, { useEffect } from "react";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import { Route, BrowserRouter } from "react-router-dom";
import SharedNotePage from "../pages/SharedNotePage";
import NotesPage from "../pages/NotesPage";
import AdminPage from "../pages/AdminPage";
import { I18nextProvider } from "react-i18next";
import i18n from "../locales/i18n";
import LanguageWrapper from "./LanguageWrapper";
import "./Antd.scss";

const App = () => {
    return (
        <I18nextProvider i18n={i18n}>
            <LanguageWrapper>
                <BrowserRouter>
                    <Route exact path="/" component={LoginPage} />
                    <Route path="/register" component={RegisterPage} />
                    <Route exact path="/notes" component={NotesPage} />
                    <Route
                        path="/notes/public/:noteId"
                        component={SharedNotePage}
                    />
                    <Route path="/admin" component={AdminPage} />
                </BrowserRouter>{" "}
            </LanguageWrapper>
        </I18nextProvider>
    );
};

export default App;
