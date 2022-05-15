import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteTweet, toggleDraft } from "../../../store/posts-actions";
import { ReactComponent as QueueIcon } from "../../../assets/icons/noun-time-4691990.svg";
import { ReactComponent as SettingsIcon } from "../../../assets/icons/noun-settings-2650508.svg";
import CurvedContainer from "../../UI/CurvedContainer";
import PostType from "../../../models/Post";
import classes from "./Post.module.css";
import moment from "moment";
import EditPostModal from "../../UI/EditPostModal";

const formatDateTime = (dateToFormat: string) => {
    const momentDateToFormat = moment(dateToFormat);
    const diff = momentDateToFormat.diff(moment(), "days");
    const timeStr = "h:mma";
    const dateStr = diff >= 7 ? "dddd, Do MMM" : "dddd";

    const formattedTime = momentDateToFormat.format(timeStr);
    const formattedDate = momentDateToFormat.format(dateStr);
    return [formattedTime, formattedDate];
};

const Post: React.FC<{ post: PostType }> = props => {
    const [modalShown, setModalShown] = useState(false);
    const dispatch = useDispatch();
    const { scheduledTime } = props.post;

    const formattedTime = useMemo(() => {
        return formatDateTime(scheduledTime);
    }, [scheduledTime]);

    const moveToDraftsHandler = () => {
        dispatch(
            toggleDraft({
                ...props.post,
                threadId: undefined,
                media: undefined,
            })
        );
    };

    const deleteTweetHandler = () => {
        dispatch(deleteTweet({ id: props.post.id, type: props.post.type }));
    };

    const toggleModalHandler = () => {
        setModalShown(s => {
            return !s;
        });
    };

    return (
        <CurvedContainer className={classes["post__container"]}>
            <div className={classes.icon}>
                <QueueIcon />
            </div>
            <div className={classes["post__right-column"]}>
                <div className={classes["post__right-column-heading"]}>
                    <h1>
                        <b>{formattedTime[0]}</b> - {formattedTime[1]}
                    </h1>

                    <div className={classes["dropdown-parent"]}>
                        <button className={classes["dropdown-button"]}>
                            <SettingsIcon />
                        </button>
                        <ul className={classes["dropdown-content"]}>
                            <li onClick={toggleModalHandler}>Edit</li>
                            <li onClick={moveToDraftsHandler}>Move to Drafts</li>
                            <li onClick={deleteTweetHandler}>Delete Tweet</li>
                        </ul>
                    </div>
                </div>
                <div className={classes["post__divider"]} />
                <p>{props.post.body}</p>
                {modalShown && <EditPostModal post={props.post} onConfirm={toggleModalHandler} />}
            </div>
        </CurvedContainer>
    );
};

export default React.memo(Post);
