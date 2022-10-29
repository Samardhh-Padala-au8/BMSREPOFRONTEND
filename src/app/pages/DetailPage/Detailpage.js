import { useParams } from "react-router-dom";
import { SideNavBar } from "../../components";
import { useEffect, useState } from "react";
import { Select } from "antd";
import { client, urlFor } from "../../../client";
export function Detailpage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [movloc, setMovieLoc] = useState([]);
  const [useloc, setLoc] = useState("");
  const { Option } = Select;

  useEffect(() => {
    console.log(id);
    const query = `*[_type=='movies'&& _id=='${id}']`;
    client.fetch(query).then((data) => {
      setMovie(data);
      console.log(data[0]);
      setMovieLoc(data[0].moviedetails.map((x) => x.locationame));
    });
  }, []);
  const handleChange = (value) => {
    setLoc(value);
  };
  return (
    <div style={{ display: "flex" }}>
      <SideNavBar />
      {movie ? (
        <>
          <div style={{ padding: "24px" }}>
            <h1>Name: {movie[0]?.name}</h1>
            <h1>Cast: {movie[0]?.cast}</h1>
            <h1>Language: {movie[0]?.language}</h1>
            <h1>Genre:{movie[0]?.genre}</h1>
            <img
              src={urlFor(movie[0]?.imgUrl).width(200).url()}
              alt={movie[0].name}
            />
            {console.log(movloc)}
            <Select style={{ width: 120 }} onChange={handleChange}>
              {movloc.map((x, y) => (
                <Option value={x} key={y}>
                  {x}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            {useloc.length > 0 &&
              movie[0].moviedetails
                .filter((x) => x.locationame === useloc)[0]
                .theatre.map((theatre, key) => (
                  <div>
                    {console.log(theatre)}
                    <h1>{theatre.theatreName}</h1>
                  </div>
                ))}
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
