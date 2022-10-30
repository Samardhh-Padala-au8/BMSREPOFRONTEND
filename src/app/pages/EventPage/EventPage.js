import { Typography } from "antd";
import { SideNavBar } from "../../components";

export function EventPage() {
  return (
    <div style={{ display: "flex" }}>
      <SideNavBar />
      <div
        style={{
          padding: "24px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography.Title>Coming Soon......</Typography.Title>
      </div>
    </div>
  );
}
