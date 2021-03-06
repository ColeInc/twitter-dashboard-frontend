import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import queryString, { ParseOptions } from "query-string";
import { useSelector, useDispatch } from "react-redux";
import { loadingActions } from "../store/loading-slice";
import { userActions } from "../store/user-slice";
import { RootState } from "../store";

import TwitterIcon from "../assets/icons/iconmonstr-twitter-1.svg";
import CurvedContainer from "../components/UI/CurvedContainer";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import classes from "./Login.module.scss";
import User from "../models/User.model";

// type LocationState = {
//     from: {
//         pathname: string;
//     };
// };

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [failedLogin, setFailedLogin] = useState(false);
    const userData = useSelector((state: RootState) => state.user);
    const loading = useSelector((state: RootState) => state.loading);
    // const location = useLocation();

    // const navigateTo = useCallback(
    //     (destination: string, config?: Object) => {
    //         navigate(destination, config);
    //     },
    //     [navigate]
    // );

    // const useNavigateRef = () => {
    //     const navigate = useNavigate();
    //     const navRef = useRef<NavigateFunction>(navigate);

    //     useEffect(() => {
    //         navRef.current = navigate;
    //     }, [navigate]);

    //     return navRef;
    // };
    // const navRef = useNavigateRef();

    // function useNav() {
    //     const navigate = useNavigate();
    //     const navigateRef = useRef({ navigate });
    //     useEffect(() => {
    //         navigateRef.current.navigate = navigate;
    //     }, [navigate]);
    //     return useCallback((location: string) => {
    //         console.log("location:", location);
    //         navigateRef.current.navigate(location);
    //     }, []);
    // }
    // const navRef = useNav();
    // navRef("/settings");

    useEffect(() => {
        // start 30 second timer till timeout:
        setTimeout(() => {
            dispatch(loadingActions.updateLoading({ loginLoading: false }));
            setFailedLogin(true);
        }, 20 * 1000);

        // any time the /login page is loaded, always run logout reducer function to log user out first:
        userActions.logout();

        // Attempt to fetch twitter code and state out of callback URL from twitter redirect:
        const query = queryString.parse(window.location.search, { ignoreQueryPrefix: true } as ParseOptions);

        // If we receive valid state & code search parameters from twitter callback:
        if (query.state && query.code) {
            // set loading slice to true:
            dispatch(loadingActions.updateLoading({ loginLoading: true }));

            // update this user's redux state with these 2 newly found variables
            dispatch(
                userActions.updateUser({
                    twitterAuth: {
                        authCode: query.code,
                        state: query.state,
                    },
                } as Partial<User>)
            );

            // send request to backend to fetch JWT token for subsequent API calls:
            const payload = {
                authCode: query.code as string,
                state: query.state as string,
            };
            const url = "/api/v1/login/access_token?" + new URLSearchParams(payload);

            fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                credentials: "same-origin",
                redirect: "follow",
            })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        // TODO: extract JWT token & user info here, store it into user slice
                        const { userData } = result;

                        // update user slice with user's successful login data:
                        dispatch(
                            userActions.updateUser({
                                id: userData.id,
                                name: userData.name ?? undefined,
                                twitterHandle: userData.username ?? undefined,
                                imageUrl: userData.profile_image_url ?? undefined,
                                loggedIn: true,
                            })
                        );
                    }
                })
                .catch(error => {
                    console.log("Error while authenticating user:\n", error);
                });
            // .finally(() => {
            //     dispatch(loadingActions.updateLoading({ loginLoading: false }));
            // });
        }
    }, [dispatch]);

    // if successfully logged in, navigate to the last page user was on OR main dashboard page:
    if (userData.loggedIn) {
        // const { from } = location.state as LocationState;
        // const origin = from.pathname || "/";
        // navRef(origin);
        navigate("/");
        dispatch(loadingActions.updateLoading({ loginLoading: false }));
    }

    const twitterSignIn = () => {
        // reset user's login attempt:
        setFailedLogin(false);

        const url = "/api/v1/login/redirect";

        const requestOptions: RequestInit = {
            method: "GET",
            redirect: "follow",
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(twitterResponse => {
                // redirect user to the fetched "redirect URL" to login to Twitter:
                window.location.href = twitterResponse.url;
            })
            .catch(error => console.log("Error while authenticating user:\n", error));
    };

    const failureMessage = (
        <>
            <h2>Failed to log in</h2>
            <h3>Are you connected to the internet?</h3>
        </>
    );

    const onFormSubmitHandler = (event: React.FormEvent) => {
        event.preventDefault();
    };

    return (
        <div className={classes["login__container"]}>
            <CurvedContainer className={classes["login__main-box"]}>
                {loading.loginLoading ? (
                    <LoadingSpinner />
                ) : (
                    <form className={classes["login__form"]} onSubmit={onFormSubmitHandler}>
                        <h1>LOG IN</h1>
                        <button onClick={twitterSignIn} className={classes["login__twitter-button"]}>
                            <TwitterIcon />
                            <p>Testing OAuth 2.0</p>
                        </button>
                        {failedLogin && failureMessage}
                    </form>
                )}
            </CurvedContainer>
        </div>
    );
};

export default Login;
