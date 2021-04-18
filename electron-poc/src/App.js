import React from "react";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Container,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { CreateUser, GetAllUsers } from "./service/service";
import { Alert } from "@material-ui/lab";

const App = () => {
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [connectivity, setConnectivity] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState(null);

  const fetchData = async () => {
    const response = await GetAllUsers();
    if (response && response.isSuccess) {
      setUsers(response.data.users);
      setConnectivity(true);
      localStorage.setItem("users", JSON.stringify(response.data.users));
    } else {
      setConnectivity(false);
      setUsers(JSON.parse(localStorage.getItem("users")));
    }
  };

  const getOfflineData = async () => {
    const pending = JSON.parse(localStorage.getItem("pendingUsers"));

    if (pending) {
      setPendingUsers(pending);
      if (navigator.onLine) {
        pending.map(async (data) => {
          const response = await CreateUser(data);

          if (response && response.isSuccess) {
            setUsers([
              ...JSON.parse(localStorage.getItem("users")),
              response.data.user,
            ]);
            localStorage.setItem(
              "users",
              JSON.stringify([
                ...JSON.parse(localStorage.getItem("users")),
                response.data.user,
              ])
            );
            setPendingUsers(pendingUsers.filter((obj) => obj !== data));
            localStorage.setItem(
              "pendingUsers",
              JSON.stringify(pendingUsers.filter((obj) => obj !== data))
            );
          } else {
            console.log("Could not create this user!");
          }
        });
      }
    }
  };

  const handleCloseFeedback = () => {
    setShowFeedback(false);
  };

  useEffect(() => {
    getOfflineData();
    fetchData();
  }, []);

  const handleSubmmit = async (e) => {
    e.preventDefault();
    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      address: e.target.address.value,
    };

    console.log(data);
    if (navigator.onLine) {
      const response = await CreateUser(data);

      console.log(response);
      if (response && response.isSuccess) {
        setUsers([...users, response.data.user]);
      }
    } else {
      console.log("offline");
      setPendingUsers([...pendingUsers, data]);
      localStorage.setItem(
        "pendingUsers",
        JSON.stringify([...pendingUsers, data])
      );
      setShowFeedback(true);
      setFeedbackType("warning");
      setFeedbackMessage(
        "You are offline, your request is pending and will save after the app goes online!"
      );
    }
  };

  return (
    <Container maxWidth="lg">
      <div className="d-flex flex-column justify-content-center text-center vh-80">
        {!connectivity && <Alert severity="warning">You are offline!</Alert>}
        <div className="d-flex justify-content-center text-center">
          <Card variant="elevation" className="m-2">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h5" component="h2">
                {users.length}
              </Typography>
            </CardContent>
          </Card>
          <Card variant="elevation" className="m-2">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Users
              </Typography>
              <Typography variant="h5" component="h2">
                {pendingUsers.length}
              </Typography>
            </CardContent>
          </Card>
        </div>
        <form
          className="d-flex flex-column justify-content-center text-center mt-2"
          onSubmit={handleSubmmit}
        >
          <TextField
            required
            className="mb-2"
            name="name"
            label="Name"
            variant="outlined"
          />
          <TextField
            required
            className="mb-2"
            name="email"
            label="Email"
            variant="outlined"
          />
          <TextField
            className="mb-2"
            name="phone"
            label="Phone"
            variant="outlined"
          />
          <TextField
            className="mb-2"
            label="Address"
            name="address"
            variant="outlined"
            multiline
            rows="3"
          />
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
      </div>
      <Snackbar
        open={showFeedback}
        autoHideDuration={6000}
        onClose={handleCloseFeedback}
      >
        <Alert onClose={handleCloseFeedback} severity={feedbackType}>
          {feedbackMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default App;
