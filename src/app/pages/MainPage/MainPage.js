/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Button,
  Space,
  Table,
  Popconfirm,
  Typography,
  Form,
  Input,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { client } from "../../../client";
import { SideNavBar, MovieDetailModal } from "../../components";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export function MainPage() {
  const history = useNavigate();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});
  const [filteredInfo, setFilteredInfo] = useState({});
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record._id === editingKey;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    setLoading(true);
    const query = `*[_type=='movies']`;
    client.fetch(query).then((data) => {
      setData(data);
      setLoading(false);
    });
  }, []);
  const updateData = (id, record) => {
    client
      .patch(id)
      .set(record)
      .commit()
      .then(() => {
        message.success("Movie Updated");
      })
      .catch((err) => {
        message.error("Some Error Occured Please Try again");
      });
  };

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      cast: "",
      language: "",
      genre: "",
      ...record,
    });
    setEditingKey(record._id);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item._id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        updateData(key, row);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      message.error("Some Error Occured");
    }
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      editable: true,
      sorter: (a, b) => {
        if (a.name === b.name) return 0;
        return a.name > b.name ? 1 : -1;
      },
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
    },
    {
      title: "Cast",
      dataIndex: "cast",
      key: "cast",
      editable: true,
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
      editable: true,
      sorter: (a, b) => {
        if (a.language === b.language) return 0;
        return a.language > b.language ? 1 : -1;
      },
      sortOrder: sortedInfo.columnKey === "language" ? sortedInfo.order : null,
      filters: [
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
      ],
      onFilter: (value, record) => {
        return record.language.includes(value);
      },
      filteredValue: filteredInfo.language || null,
    },
    {
      title: "Genre",
      dataIndex: "genre",
      key: "genre",
      editable: true,
      filters: [
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
      ],
      onFilter: (value, record) => {
        return record.genre.includes(value);
      },
      filteredValue: filteredInfo.genre || null,
    },
    {
      title: "No of Locations",
      key: "locations",
      render: (_, record) => (
        <>{record.moviedetails ? record.moviedetails.length : 0}</>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            style={{
              color: "white",
              backgroundColor: "#1890ff",
              borderRadius: "0.3rem",
            }}
            onClick={() => history(`/detail/${record._id}`)}
          >
            Details
          </Button>
        </Space>
      ),
    },
    {
      title: "Edit",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record._id)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <div style={{ display: "flex" }}>
      <SideNavBar />
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Spin indicator={antIcon} />
        </div>
      ) : (
        <div style={{ padding: "24px" }}>
          <Form form={form} component={false}>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              dataSource={data}
              bordered
              columns={mergedColumns}
              rowClassName="editable-row"
              onChange={handleChange}
              pagination={{
                onChange: cancel,
              }}
              loading={{
                indicator: <Spin indicator={antIcon} />,
                spinning: !data,
              }}
            />
          </Form>
          <Button
            onClick={showModal}
            type="primary"
            style={{
              marginBottom: 16,
              backgroundColor: "#1890ff",
            }}
          >
            Add a movie
          </Button>

          <MovieDetailModal
            isModalOpen={isModalOpen}
            setData={setData}
            data={data}
            setIsModalOpen={setIsModalOpen}
          />
        </div>
      )}
    </div>
  );
}
