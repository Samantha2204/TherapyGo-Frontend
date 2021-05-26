import React from 'react';
import './StaffPage.scss';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import MuiButton from '@material-ui/core/Button';
import { createMuiTheme } from '@material-ui/core/styles';
import { withStyles, ThemeProvider } from '@material-ui/styles';
import Swal from 'sweetalert2';
import NavBar from '../../components/NavigationBar/NavigationBar';
import TableTemplate from './Components/table/table';
import config from '../../config/index';

const url = `${config.baseUrl.dev}`;

const Button = withStyles((theme) => ({
  root: (props) =>
    props.color === 'default' && props.variant === 'contained'
      ? {
          color: theme.palette.default.contrastText,
          backgroundColor: theme.palette.default.main,
          '&:hover': {
            backgroundColor: theme.palette.default.dark,
            '@media (hover: none)': {
              backgroundColor: theme.palette.default.main,
            },
          },
        }
      : {},
}))(MuiButton);

const theme = createMuiTheme();

theme.palette.default = theme.palette.augmentColor({
  main: '#009688',
});

class StaffPage extends React.Component {
  state = {
    employees: [],
  };

  componentDidMount = () => {
    axios
      .get(`${url}/getStaff`)
      .then((response) => {
        if (response.status === 200) {
          this.setState({ employees: response.data });
        } else {
          Swal.fire(
            'Fail To Get Staff List',
            'There was an error while getting the staff list. Please try again later!',
            'error',
          );
        }
      })
      .catch((error) => {
        throw new Error(`Staff Page - fetch staff list fail\n${error}`);
      });
  };

  changeHandler = (prop) => this.setState({ [prop.name]: prop.value });

  openEditFormHandler = (id) => {
    this.props.history.replace(`/edit/${id}`);
  };

  openAddFormHandler = () => {
    window.location.href = '/add';
  };

  deleteEmployee(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${url}/therapist/${id}`).then((res) => {
          if (res.status === 200) {
            this.setState({
              employees: this.state.employees.filter((el) => el.id !== id),
            });
            Swal.fire('Staff Deleted!', 'The staff has been successfully deleted.', 'success');
          } else {
            Swal.fire(
              'Staff Not Deleted!',
              'This staff is assigned to at least an appointment. Please reassign and try again.',
              'error',
            );
          }
        });
      }
    });
  }

  render() {
    const { employees } = this.state;
    return (
      <div>
        <NavBar />
        <div className="staff">
          <Row>
            <Col className="staff_addButton">
              <ThemeProvider theme={theme}>
                <Button
                  variant="contained"
                  color="default"
                  onClick={this.openAddFormHandler.bind(this)}
                >
                  Add New Staff
                </Button>
              </ThemeProvider>
            </Col>
          </Row>
          <Row>
            <Col className="staff_staffList-content">
              <TableTemplate
                employees={employees}
                deleteEmployee={this.deleteEmployee.bind(this)}
                openEditForm={this.openEditFormHandler.bind(this)}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default StaffPage;
