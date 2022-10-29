import {
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Typography,
  Select,
  Checkbox,
  InputNumber,
  message,
} from "antd";
import React, { useState } from "react";
import { client } from "../../../client";
import { ColorRing } from "react-loader-spinner";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import images from "../../utils/images";
const { Option } = Select;
export const MovieDetailModal = ({
  isModalOpen,
  handleCancel,
  setData,
  data,
  setIsModalOpen,
}) => {
  const [imagesAssets, setImagesAssets] = useState(null);
  const [form] = Form.useForm();
  // moviedetails: [
  //   {
  //     locationname: "Hyderabad",
  //     theatre: [
  //       {
  //         theatrename: "Inox Gachibowli",
  //         price: 100,
  //         timings: ["12:00pm", "1:00pm", "4:00pm", "10:00pm"],
  //       },
  //     ],
  //   },
  // ],
  // imgUrl: {
  //   _type: "image",
  //   asset: {
  //     _type: "reference",
  //     _ref: "image-752cc63bb6f1da01befe421452edf9b44e100703-1200x896-jpg",
  //   },
  // },
  const TIMINGS = [
    "9:00am",
    "10:00am",
    "11:00am",
    "12:00pm",
    "1:00pm",
    "2:00pm",
    "3:00pm",
    "4:00pm",
    "5:00pm",
    "6:00pm",
    "7:00pm",
    "8:00pm",
    "9:00pm",
    "10:00pm",
    "11:00pm",
  ];
  const [wrongTypeofImage, setWrongTypeofImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [setField] = useState();
  const uploadImage = (e) => {
    setLoading(true);
    const selectedImage = e.target.files[0];
    if (
      selectedImage.type === "image/png" ||
      selectedImage.type === "image/svg" ||
      selectedImage.type === "image/jpeg" ||
      selectedImage.type === "image/gif" ||
      selectedImage.type === "image/tiff"
    ) {
      setWrongTypeofImage(false);
      client.assets
        .upload("image", selectedImage, {
          contentType: selectedImage.type,
          filename: selectedImage.name,
        })
        .then((document) => {
          setLoading(false);
          setImagesAssets(document);
        })
        .catch((error) => {
          console.log("Upload failed:", error.message);
        });
    } else {
      setWrongTypeofImage(true);
    }
  };
  const handleAdd = (values) => {
    if (imagesAssets?._id) {
      const obj = {
        ...values,
        _type: "movies",
        imgUrl: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imagesAssets?._id,
          },
        },
      };
      client
        .create(obj)
        .then((res) => {
          message.success("Successfully Added Movie");
          setData([...data, res]);
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <>
      <Modal
        title={
          <Typography.Title level={2}>MOVIE DETAILS FORM</Typography.Title>
        }
        open={isModalOpen}
        onOk={handleAdd}
        onCancel={handleCancel}
        footer={null}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            width: "100%",
          }}
        >
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={handleAdd}
            autoComplete="off"
            layout="vertical"
          >
            <Row justify="space-between">
              <Col span={24}>
                <Form.Item
                  name="name"
                  label="Movie Name"
                  rules={[
                    { required: true, message: "Please enter movie name" },
                  ]}
                >
                  <Input placeholder="Please enter movie name" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="language"
                  label="Movie Language"
                  rules={[
                    { required: true, message: "Please enter movie Language!" },
                  ]}
                >
                  <Input placeholder="Please enter movie Language" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="genre"
                  label="Movie Genre"
                  rules={[
                    { required: true, message: "Please enter movie genre!" },
                  ]}
                >
                  <Input placeholder="Please enter movie genre" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="cast"
                  label="Movie Cast"
                  rules={[
                    { required: true, message: "Please enter movie cast!" },
                  ]}
                >
                  <Input placeholder="Please enter movie cast" />
                </Form.Item>
              </Col>
              <Col span={24}>
                {!imagesAssets ? (
                  <div style={{ display: "flex" }}>
                    <div>
                      <label for="file-upload" className="custom-file-upload">
                        <span style={{ color: "#DF1827" }}>*</span> Upload Movie
                        Image
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        name="upload-image"
                        onChange={uploadImage}
                        className="hidden"
                        style={{ display: "none" }}
                      />
                    </div>
                    {loading ? (
                      <div>
                        <ColorRing
                          visible={true}
                          height="40"
                          width="40"
                          ariaLabel="blocks-loading"
                          wrapperStyle={{}}
                          wrapperClass="blocks-wrapper"
                          colors={[""]}
                        />
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  <>
                    <Typography.Text>
                      {imagesAssets.originalFilename}{" "}
                      <img
                        src={images.del}
                        alt=""
                        srcset=""
                        style={{ cursor: "pointer" }}
                        onClick={() => setImagesAssets(null)}
                      />
                    </Typography.Text>
                  </>
                )}
              </Col>

              <Col style={{ marginTop: "24px" }} span={24}>
                <Form.List name="moviedetails">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <div
                          style={{
                            border: "1px solid black",
                            width: "100%",
                            padding: "16px",
                          }}
                        >
                          {console.log(field)}
                          <Row justify="space-between">
                            <Col span={24}>
                              <div style={{ display: "flex" }}>
                                <Typography.Title level={3}>
                                  Location Details
                                </Typography.Title>
                                <div>
                                  <img
                                    src={images.del}
                                    alt=""
                                    srcset=""
                                    style={{
                                      cursor: "pointer",
                                      width: "18px",
                                      height: "18px",
                                      marginLeft: "0.3rem",
                                      marginTop: "0.5rem",
                                    }}
                                    onClick={() => remove(field.name)}
                                  />
                                </div>
                              </div>
                            </Col>
                            <Col span={24}>
                              <Form.Item
                                label="Enter City Name"
                                name={[field.name, "locationame"]}
                                fieldKey={[field.Key, "locationame"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please enter City name",
                                  },
                                ]}
                              >
                                <Input placeholder="Please enter City Name" />
                              </Form.Item>
                            </Col>
                            <Col span={24}>
                              <Form.List
                                name={[field.name, "theatre"]}
                                fieldKey={[field.Key, "theatre"]}
                              >
                                {(fields, { add, remove }) => (
                                  <>
                                    {fields.map((field, index2) => (
                                      <div
                                        style={{
                                          border: "1px solid black",
                                          width: "100%",
                                          padding: "16px",
                                        }}
                                      >
                                        {console.log(field)}
                                        <div style={{ display: "flex" }}>
                                          <Typography.Title level={5}>
                                            Theatre Details
                                          </Typography.Title>
                                          <div>
                                            <img
                                              src={images.del}
                                              alt=""
                                              srcset=""
                                              style={{
                                                cursor: "pointer",
                                                width: "12px",
                                                height: "12px",
                                                marginLeft: "0.3rem",
                                                marginTop: "0rem",
                                              }}
                                              onClick={() => remove(field.name)}
                                            />
                                          </div>
                                        </div>
                                        <Row justify="space-between">
                                          <Col span={24}>
                                            <Form.Item
                                              label="Enter Theatre Name"
                                              name={[field.name, "theatreName"]}
                                              fieldKey={[
                                                field.Key,
                                                "theatreName",
                                              ]}
                                              key={index2}
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Enter Theatre Name",
                                                },
                                              ]}
                                            >
                                              <Input placeholder="Enter Theatre Name" />
                                            </Form.Item>
                                          </Col>
                                          <Col span={24}>
                                            <Form.Item
                                              label="Enter Ticket Price (Rupees)"
                                              name={[field.name, "price"]}
                                              fieldKey={[field.Key, "price"]}
                                              key={index2}
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Enter Ticket Price",
                                                },
                                              ]}
                                            >
                                              <InputNumber
                                                placeholder="Enter Ticket Price"
                                                min={100}
                                              />
                                            </Form.Item>
                                          </Col>
                                          <Col span={24}>
                                            <Form.Item
                                              label="Enter Timings of the Movie"
                                              name={[field.name, "timings"]}
                                              key={index2}
                                              fieldKey={[field.Key, "timings"]}
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Enter Ticket Price",
                                                },
                                              ]}
                                            >
                                              <Checkbox.Group
                                                style={{ width: "100%" }}
                                              >
                                                <Row>
                                                  {TIMINGS.map((x, y) => (
                                                    <Col span={8} key={y}>
                                                      <Checkbox value={x}>
                                                        {x}
                                                      </Checkbox>
                                                    </Col>
                                                  ))}
                                                </Row>
                                              </Checkbox.Group>
                                            </Form.Item>
                                          </Col>
                                        </Row>
                                      </div>
                                    ))}
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <Form.Item>
                                        <Button
                                          type="primary"
                                          onClick={() => {
                                            add();
                                          }}
                                          style={{ marginTop: "16px" }}
                                        >
                                          Add Theatre
                                        </Button>
                                      </Form.Item>
                                    </div>
                                  </>
                                )}
                              </Form.List>
                            </Col>
                          </Row>
                        </div>
                      ))}

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Col span={24} style={{ marginTop: "16px" }}>
                          <Form.Item>
                            <Button
                              type="primary"
                              onClick={() => {
                                add();
                              }}
                            >
                              Add Location
                            </Button>
                          </Form.Item>
                        </Col>
                      </div>
                    </>
                  )}
                </Form.List>
              </Col>

              <Col style={{ marginTop: "24px" }} span={24}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                  >
                    ADD MOVIE
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </>
  );
};
