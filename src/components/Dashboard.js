import { useEffect } from "react";
import jwt from "jwt-decode";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

import "../plugins/fontawesome-free/css/all.min.css";
import "../styles/Dashboard.css";

function Dashboard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [ProjectList, setProjectsLists] = useState([]);

  //Create new project list
  const [userId, setUserid] = useState("");
  const addValues = { title: "", description: "" };
  const [addFormValues, setaddFormValues] = useState(addValues);
  const [addBtn, setaddBtn] = useState(false);
  const [addformErrors, setaddFormErrors] = useState({});

  //Update project list
  const editValues = { title: "", description: "" };
  const [editFormValues, seteditFormValues] = useState(editValues);
  const [editBtn, seteditBtn] = useState(false);
  const [editformErrors, seteditFormErrors] = useState({});
  const [editId, setEditId] = useState("");

  //User data/record verification
  function userData() {
    fetch("http://localhost:3001/api/auth", {
      method: "POST",
      headers: {
        access_token: localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setName(data.userData.fname + " " + data.userData.lname);
        setEmail(data.userData.email);
        setProjectsLists(data.projectData);
      });
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      //User for security purposes
      const user = jwt(token);
      if (!user) {
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        setUserid(user.userId);
        userData();
      }
    } else {
      window.location.href = "/";
    }

    if (Object.keys(addformErrors).length === 0 && addBtn) {
      axios
        .post("http://localhost:3001/api/create", {
          ...addFormValues,
          user_id: userId,
        })
        .then(function (response) {
          if (response.data.status === "success") {
            Swal.fire({
              title: "SUCCESS",
              text: "Added Successfully",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            console.log(response.data);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    if (Object.keys(editformErrors).length === 0 && editBtn) {
      axios
        .post("http://localhost:3001/api/update", {
          ...editFormValues,
          userId: userId,
          projectId: editId 
        })
        .then(function (response) {
          seteditBtn(false);
          if (response.status === 200) {
            seteditBtn(false);
            Swal.fire({
              title: "SUCCESS",
              text: "Updated Successfully",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
            setIsOpen2(false);
          } else {
            console.log(response.data);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

  }, [addformErrors, addBtn, addFormValues, userId, editformErrors, editBtn, editFormValues, editId]);

  const logout_user = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const addProject = () => {
    setIsOpen(!isOpen);
  };

  const addHandleChange = (e) => {
    const { name, value } = e.target;
    setaddFormValues({ ...addFormValues, [name]: value });
    setaddBtn(false);
  };

  const addHandleSubmit = (e) => {
    e.preventDefault();
    setaddFormErrors(addValidation(addFormValues));
    setaddBtn(true);
  };

  const addValidation = (values) => {
    const errors = {};

    if (!values.title) {
      errors.title = "Please enter your description of your project";
    } else if (values.title.length < 5) {
      errors.title = "Title must at least 5 - 10 characters in length.";
    }

    if (!values.description) {
      errors.description = "Please enter your description of your project";
    } else if (values.description.length < 50) {
      errors.description =
        "Description must at least 50 - 210 characters in length.";
    }

    return errors;
  };

  const delete_list = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your project has been deleted",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          axios.delete(`http://localhost:3001/api/delete/${id}`);
          window.location.reload();
        }, 1500);
      }
    });
  };

  
  const editProject = (id) => {
    axios.get(`http://localhost:3001/api/record/${id}`).then((res) => {
      if (res.status === 200) {
        setEditId(res.data.record._id);
        seteditFormValues({...editFormValues, title: res.data.record.title, description: res.data.record.description});
        setIsOpen2(true);
      }
    });
  };

  const updateProject = (e) => {
    e.preventDefault();
    seteditFormErrors(editValidation(editFormValues));
    seteditBtn(true);
  };

  const editHandleChange = (e) => {
    const { name, value } = e.target;
    seteditFormValues({ ...editFormValues, [name]: value });
    seteditBtn(false);
  };

  //Edit form validation
  const editValidation = (values) => {
    const errors = {};

    if (!values.title) {
      errors.title = "Please enter your description of your project";
    } else if (values.title.length < 5) {
      errors.title = "Title must at least 5 - 10 characters in length.";
    }

    if (!values.description) {
      errors.description = "Please enter your description of your project";
    } else if (values.description.length < 50) {
      errors.description =
        "Description must at least 50 - 210 characters in length.";
    }

    return errors;
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome to Dashboard</h1>
      </header>
      <div className="container">
        <div className="user-info">
          <div className="user-details">
            <p>Name : {name}</p>
            <p>Email Address : {email}</p>
          </div>
          <button className="btn-logout" onClick={logout_user}>
            Logout <i className="fa fa-sign-out-alt"></i>
          </button>
        </div>
        <div className="container-project">
          <header>
            <h1>Project Lists</h1>
            <button onClick={addProject}>
              <i className="fa fa-plus"></i> Add project
            </button>
          </header>
          <div className="container-project-body">
            {ProjectList.map((val) => {
              return (
                <div className="card" key={val._id}>
                  <div className="card-header">
                    <h1 className="card-title">{val.title}</h1>
                  </div>
                  <div className="card-body">
                    <p>{val.description}</p>
                  </div>
                  <div className="card-footer">
                    <button
                      onClick={() => {
                        editProject(val._id);
                      }}
                      className="btn-success"
                    >
                      <i className="fa fa-edit"></i> Edit
                    </button>
                    <button
                      onClick={() => {
                        delete_list(val._id);
                      }}
                      className="btn-danger"
                    >
                      <i className="fa fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={`modal${isOpen ? " show-modal" : ""}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title">New Project</h1>
            <span className="modal-close" onClick={() => setIsOpen(false)}>
              ✖
            </span>
          </div>
          <form onSubmit={addHandleSubmit}>
            <div className="modal-body">
              <div className="input-group">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    className="form-control"
                    value={addFormValues.title}
                    onChange={addHandleChange}
                    name="title"
                  ></input>
                </div>
                <span className="error-text">{addformErrors.title}</span>
              </div>
              <div className="input-group">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    cols="10"
                    rows="8"
                    name="description"
                    minLength="50"
                    maxLength="210"
                    value={addFormValues.description}
                    onChange={addHandleChange}
                  ></textarea>
                </div>
                <span className="error-text">{addformErrors.description}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setIsOpen(false)} className="btn-danger">
                Close
              </button>
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className={`modal${isOpen2 ? " show-modal" : ""}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title">Edit Project</h1>
            <span className="modal-close" onClick={() => setIsOpen2(false)}>
              ✖
            </span>
          </div>
          <form onSubmit={updateProject}>
            <div className="modal-body">
              <div className="input-group">
                <div className="form-group">
                  <label>Project Name</label>
                  <input
                    className="form-control"
                    value={editFormValues.title}
                    onChange={editHandleChange}
                    name="title"
                  ></input>
                </div>
                <span className="error-text">{editformErrors.title}</span>
              </div>

              <div className="input-group">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    cols="10"
                    rows="8"
                    name="description"
                    maxLength="210"
                    value={editFormValues.description}
                    onChange={editHandleChange}
                  ></textarea>
                </div>
                <span className="error-text">{editformErrors.description}</span>
              </div>
            </div>
            <div className="modal-footer">
              <span onClick={() => setIsOpen2(false)} className="btn-danger">
                Close
              </span>
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/*
      <div className="card">
              <div className="card-header">
                <h1 className="card-title">Project Lee</h1>
              </div>
              <div className="card-body">
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Obcaecati repellendus nisi fuga explicabo, dolorum molestiae.
                </p>
              </div>
              <div className="card-footer">
                <button onClick={modalShow2} className="btn-success">
                  <i className="fa fa-edit"></i> Edit
                </button>
                <button onClick={delete_list} className="btn-danger">
                  <i className="fa fa-trash"></i> Delete
                </button>
              </div>
            </div>
*/

export default Dashboard;
