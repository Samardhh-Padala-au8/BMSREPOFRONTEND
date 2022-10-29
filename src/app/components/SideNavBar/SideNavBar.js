/* eslint-disable jsx-a11y/anchor-is-valid */
import { Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./SideNavBar.css";
import images from "../../utils/images";
export function SideNavBar() {
  const history = useNavigate();
  const menuItems = [
    {
      text: "Movies",
      icon: images.movie,
      route: "/",
    },
  ];
  return (
    <div className={"side-nav-container"}>
      <div className="nav-upper">
        <div className="nav-heading">
          <div className="nav-brand">
            <img
              src={images.Logo}
              alt=""
              srcset=""
              style={{ width: "65px", height: "50px", marginTop: "1.2rem" }}
            />
            <Typography.Title
              style={{ color: "white", marginTop: "1.8rem" }}
              level={3}
            >
              BMSPORTAL
            </Typography.Title>
          </div>
        </div>
        <div className="nav-menu">
          {menuItems.map(({ text, icon }) => (
            <div onClick={() => history("/")}>
              <div className={"menu-item"} href="#">
                <img
                  src={icon}
                  alt=""
                  srcset=""
                  style={{
                    width: "40px",
                    height: "40px",
                    marginTop: "0.3rem",
                    paddingLeft: "0.5rem",
                    marginRight: "0.4rem",
                  }}
                />
                <Typography.Text
                  style={{ color: "white", marginTop: "0.9rem" }}
                >
                  {text}
                </Typography.Text>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
