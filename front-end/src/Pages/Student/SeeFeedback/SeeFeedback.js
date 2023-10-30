import DefaultLayout from "~/Layout/DefaultLayout";
import { Modal } from "~/components";

import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";

import classNames from "classnames/bind";
import styles from "./SeeFeedback.module.scss";

const cx = classNames.bind(styles);

function SeeFeedback() {
  const host = process.env.REACT_APP_HOST;
  const port = process.env.REACT_APP_PORT;

  const [feedback, setFeedback] = useState({});

  const [errorEdit, setErrorEdit] = useState("");

  const { token } = useContext(HeaderContext);

  useEffect(getFeedback, [token]);

  function getFeedback() {
    axios
      .get(`${host}:${port}/api/seeFeedback`, {
        withCredentials: true,
        baseURL: `${host}:${port}`,
      })
      .then((res) => {
        setFeedback(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Xem nhận xét bảo vệ</h2>
      <div className={cx("function")}></div>
      <div>
        <table className={cx("data")}>
          <thead>
            <tr>
              <th>Trạng thái đánh giá KL</th>
              <th>
                <span className="material-symbols-outlined">folder_zip</span>
              </th>
              <th>Thời gian</th>
            </tr>
          </thead>

          {feedback && (
            <tbody>
              <tr>
                <td>
                  <div>{feedback.feedback?.stateFeedback} </div>
                </td>
                <td>
                  <a
                    className={cx("linkDownload")}
                    href={`${host}:${port}/api/feedback/${feedback._id}`}
                    download={feedback.feedback?.fileFeedback?.nameFile}
                  >
                    {feedback.feedback?.fileFeedback?.nameFile}
                  </a>
                </td>
                <td>
                  <div>{feedback.feedback?.timeFeedback} </div>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </DefaultLayout>
  );
}

export default SeeFeedback;
