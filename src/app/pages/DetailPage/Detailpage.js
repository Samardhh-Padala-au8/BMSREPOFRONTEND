import { useParams } from "react-router-dom";
import { SideNavBar } from "../../components";
import { useEffect, useState } from "react";
import { Select } from "antd";
import { Tag } from "antd";
import { client, urlFor } from "../../../client";
export function Detailpage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [movloc, setMovieLoc] = useState([]);
  const [useloc, setLoc] = useState("");
  const { Option } = Select;

  useEffect(() => {
    const query = `*[_type=='movies'&& _id=='${id}']`;
    client.fetch(query).then((data) => {
      setMovie(data);
      setMovieLoc(data[0].moviedetails.map((x) => x.locationame));
      setLoc(data[0].moviedetails[0].locationame);
    });
  }, []);
  const handleChange = (value) => {
    setLoc(value);
  };
  return (
    <div style={{ display: "flex" }}>
      <SideNavBar />
      {movie ? (
        <div style={{ padding: "24px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={urlFor(movie[0]?.imgUrl).width(200).url()}
                alt={movie[0].name}
                style={{ width: "150px", height: "150px" }}
              />
              <div style={{ marginLeft: "16px" }}>
                <p>
                  <span style={{ fontWeight: "bold" }}>Name : </span>
                  {movie[0]?.name}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Cast : </span>
                  {movie[0]?.cast}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Language : </span>
                  {movie[0]?.language}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Genre : </span>
                  {movie[0]?.genre}
                </p>
              </div>
            </div>
            <div style={{ marginTop: "24px" }}>
              <div style={{ display: "flex" }}>
                <i
                  class="fa fa-map-marker"
                  aria-hidden="true"
                  style={{
                    marginTop: "5px",
                    color: "#1890ff",
                    fontSize: "20px",
                  }}
                ></i>
                <Select
                  onChange={handleChange}
                  style={{ marginLeft: "16px" }}
                  placeholder="please select location"
                  defaultValue={useloc}
                >
                  {movloc.map((x, y) => (
                    <Option value={x} key={y}>
                      {x}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            <div>
              {useloc.length > 0 &&
                movie[0].moviedetails
                  .filter((x) => x.locationame === useloc)[0]
                  .theatre.map((theatre, key) => (
                    <div
                      style={{
                        margin: "16px 0px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <p style={{ fontWeight: "bold", fontSize: "18px" }}>
                          {theatre.theatreName}
                        </p>
                        <p style={{ fontWeight: "bold", fontSize: "18px" }}>
                          {theatre.price}&#8377;{" "}
                        </p>
                      </div>
                      <div>
                        {theatre.timings.map((x, y) => (
                          <Tag color="gold" key={y}>
                            {x}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
