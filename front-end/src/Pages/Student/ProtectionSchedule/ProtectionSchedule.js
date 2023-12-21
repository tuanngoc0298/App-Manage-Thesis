import DefaultLayout from "~/Layout/DefaultLayout";
import { Modal } from "~/components";

import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";

import classNames from "classnames/bind";
import styles from "./ProtectionSchedule.module.scss";

const cx = classNames.bind(styles);

function ProtectionSchedule() {
  const url = process.env.REACT_APP_URL;

  const [schedule, setSchedule] = useState({});

  const [error, setError] = useState("");

  const { token } = useContext(HeaderContext);

  useEffect(getSchedule, [token]);

  function getSchedule() {
    axios
      .get(`${url}/api/protectionSchedule`, {
        withCredentials: true,
        baseURL: `${url}`,
      })
      .then((res) => {
        setSchedule(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Lịch bảo vệ KLTN</h2>
      <div className={cx("function")}>
        <div className={cx("function__allow")}></div>
      </div>

      <div>
        <table className={cx("data")}>
          <thead>
            <tr>
              <th>Mã học phần</th>
              <th>Tên học phần</th>
              <th>Ca thi/Mã phòng thi</th>
              <th>Ngày thi</th>
            </tr>
          </thead>

          {schedule && (
            <tbody>
              <tr>
                <td>
                  <div>{schedule.codeCapstoneProject}</div>
                </td>
                <td>
                  <div>{schedule.nameCapstoneProject}</div>
                </td>
                <td>
                  <div>
                    {schedule.protectionCouncil?.shift}/
                    {schedule.protectionCouncil?.roomCode}
                  </div>
                </td>
                <td>
                  <div>
                    {new Date(
                      schedule.protectionCouncil?.time
                    ).toLocaleDateString("vi-VI", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                  </div>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </DefaultLayout>
  );
}

export default ProtectionSchedule;
