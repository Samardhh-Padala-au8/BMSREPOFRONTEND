import {
  Button,
  Space,
  Table,
  Popconfirm,
  Typography,
  Form,
  Input,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { client } from "../../../client";
import { SideNavBar, MovieDetailModal } from "../../components";

export function MainPage() {
  const history = useNavigate();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);

  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record._id === editingKey;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    const query = `*[_type=='movies']`;
    client.fetch(query).then((data) => {
      console.log(data);
      setData(data);
    });
  }, []);
  useEffect(() => {
    console.log(data);
  }, [data]);
  const updateData = (id, record) => {
    client
      .patch(id)
      .set(record)
      .commit()
      .then((updated) => {
        console.log("Movie Updated");
        console.log(updated);
      })
      .catch((err) => {
        console.error("Oh no, the update failed: ", err.message);
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
      console.log(row);
      const newData = [...data];
      console.log(newData);
      const index = newData.findIndex((item) => key === item._id);
      if (index > -1) {
        const item = newData[index];
        console.log(item);
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
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      editable: true,
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
    },
    {
      title: "Genre",
      dataIndex: "genre",
      key: "genre",
      editable: true,
    },
    {
      title: "Locations",
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
              backgroundColor: "#DF1827",
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
  return data ? (
    <div style={{ display: "flex" }}>
      <SideNavBar />
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
            pagination={{
              onChange: cancel,
            }}
          />
        </Form>
        <Button
          onClick={showModal}
          type="primary"
          style={{
            marginBottom: 16,
            backgroundColor: "#DF1827",
          }}
        >
          Add a movie
        </Button>

        <MovieDetailModal
          isModalOpen={isModalOpen}
          handleCancel={handleCancel}
          setData={setData}
          data={data}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
    </div>
  ) : (
    ""
  );
}
