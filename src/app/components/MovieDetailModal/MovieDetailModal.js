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
import images from "../../utils/images";
import { v4 as uuid } from "uuid";
const { Option } = Select;
export const MovieDetailModal = ({
  isModalOpen,

  setData,
  data,
  setIsModalOpen,
}) => {
  const [imagesAssets, setImagesAssets] = useState(null);
  const [movLoad, setMovLoad] = useState(false);
  const [form] = Form.useForm();
  const LANGUAGE_OPTIONS = [
    {
      text: "Telugu",
      value: "Telugu",
    },
    {
      text: "Tamil",
      value: "Tamil",
    },
    {
      text: "Hindi",
      value: "Hindi",
    },
    {
      text: "Kannada",
      value: "Kannada",
    },
    {
      text: "Malayalam",
      value: "Malayalam",
    },
    {
      text: "English",
      value: "English",
    },
    {
      text: "Other",
      value: "Other",
    },
  ];
  const GENRE_OPTIONS = [
    {
      text: "Action",
      value: "Action",
    },
    {
      text: "Romance",
      value: "Romance",
    },
    {
      text: "Suspense Thriller",
      value: "Suspense Thriller",
    },
    {
      text: "Horror",
      value: "Horror",
    },
    {
      text: "Science Fiction",
      value: "Science Fiction",
    },
    {
      text: "Documentary",
      value: "Documentary",
    },
    {
      text: "Biopic",
      value: "Biopic",
    },
    {
      text: "Drama",
      value: "Drama",
    },
    {
      text: "Super Hero",
      value: "Super Hero",
    },
    {
      text: "History",
      value: "History",
    },
  ];
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
  const [loading, setLoading] = useState(false);
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
          message.error("Upload Failed Please Try again");
        });
    } else {
      message.error("Please Upload Correct Format of image");
    }
  };
  const handleAdd = (values) => {
    setMovLoad(true);
    if (imagesAssets?._id) {
      const obj = {
        ...values,
        _type: "movies",
        _key: uuid(),
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
          setMovLoad(false);
          setIsModalOpen(false);
          setImagesAssets(null);
          form.resetFields();
        })
        .catch(() => {
          setMovLoad(false);
          message.error("Some Error Occured Please Try again");
          setImagesAssets(null);
          form.resetFields();
        });
    } else {
      message.warning("Image must be uploaded");
      setMovLoad(false);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  return (
    <>
      <Modal
        title={<Typography.Title level={3}>Movie Details</Typography.Title>}
        open={isModalOpen}
        onOk={handleAdd}
        onCancel={handleCancel}
        footer={null}
        width={"70%"}
      >
        <div
          style={{
            display: "flex",
            border: "1px solid #1890ff",
            padding: "16px",
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
            form={form}
          >
            <Row justify="space-between">
              <Col span={11}>
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
              <Col span={11}>
                <Form.Item
                  name="language"
                  label="Movie Language"
                  rules={[
                    { required: true, message: "Please enter movie Language!" },
                  ]}
                >
                  <Select placeholder="Please select movie Language">
                    {LANGUAGE_OPTIONS.map((x, y) => (
                      <Option value={x.text} key={y}>
                        {x.value}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item
                  name="genre"
                  label="Movie Genre"
                  rules={[
                    { required: true, message: "Please enter movie genre!" },
                  ]}
                >
                  {/* <Input placeholder="Please enter movie genre" /> */}
                  <Select placeholder="Please select movie genre">
                    {GENRE_OPTIONS.map((x, y) => (
                      <Option value={x.text} key={y}>
                        {x.value}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={11}>
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
                        <span style={{ color: "red" }}>*</span> Upload Movie
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
                  <div style={{ padding: "8px" }}>
                    <p style={{ fontWeight: "bold" }}>
                      {imagesAssets.originalFilename}{" "}
                      <img
                        src={images.del}
                        alt=""
                        srcset=""
                        style={{
                          cursor: "pointer",
                          width: "15px",
                          height: "15px",
                        }}
                        onClick={() => setImagesAssets(null)}
                      />
                    </p>
                  </div>
                )}
              </Col>

              <Col span={24}>
                <Form.List name="moviedetails">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <div
                          style={{
                            border: "1px solid #1890ff",
                            width: "100%",
                            padding: "16px",
                            marginTop: "16px",
                          }}
                        >
                          <Row justify="space-between">
                            <Col span={24}>
                              <div style={{ display: "flex" }}>
                                <Typography.Title level={4}>
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
                            <Col span={12}>
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
                                          border: "1px solid #1890ff",
                                          width: "100%",
                                          padding: "16px",
                                          marginTop: "16px",
                                        }}
                                      >
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
                                        <Row
                                          justify="space-between"
                                          style={{ marginTop: "16px" }}
                                        >
                                          <Col span={12}>
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
                                          <Col span={11}>
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
                                              <InputNumber min={100} />
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
                    loading={movLoad}
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
