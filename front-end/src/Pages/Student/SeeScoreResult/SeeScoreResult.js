import DefaultLayout from "~/Layout/DefaultLayout";
import { Modal } from "~/components";

import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";

import classNames from "classnames/bind";
import styles from "./SeeScoreResult.module.scss";

const cx = classNames.bind(styles);

function SeeScoreResult() {
  const host = process.env.REACT_APP_HOST;
  const port = process.env.REACT_APP_PORT;

  const [result, setResult] = useState({});

  const [error, setError] = useState("");

  const { token } = useContext(HeaderContext);

  useEffect(getResult, [token]);

  function getResult() {
    axios
      .get(`${host}:${port}/api/seeScoreResult`, {
        withCredentials: true,
        baseURL: `${host}:${port}`,
      })
      .then((res) => {
        setResult(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Điểm KLTN</h2>
      <div className={cx("function")}>
        <div className={cx("function__allow")}></div>
      </div>

      <div>
        <table className={cx("data")}>
          <thead>
            <tr>
              <th>Mã học phần</th>
              <th>Tên học phần</th>
              <th>Điểm</th>
            </tr>
          </thead>

          {result && (
            <tbody>
              <tr>
                <td>
                  <div>{result.codeCapstoneProject}</div>
                </td>
                <td>
                  <div>{result.nameCapstoneProject}</div>
                </td>
                <td>
                  <div>{result.scoreResult?.average}</div>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </DefaultLayout>
  );
}

export default SeeScoreResult;
