import { useEffect, useMemo, useState } from "react";
import "./App.css";

const departmentData = {
  "Computer Science": [
    { roll: "CS001", name: "Arjun Kumar", section: "A" },
    { roll: "CS002", name: "Priya Sharma", section: "A" },
    { roll: "CS003", name: "Rahul Kumar", section: "B" },
    { roll: "CS004", name: "Ananya Raj", section: "B" },
  ],

  "Information Technology": [
    { roll: "IT001", name: "Sneha Mani", section: "A" },
    { roll: "IT002", name: "Vikram Raj", section: "A" },
    { roll: "IT003", name: "Divya Sri", section: "B" },
    { roll: "IT004", name: "Karthik M", section: "B" },
  ],

  "Artificial Intelligence": [
    { roll: "AI001", name: "Meena Priya", section: "A" },
    { roll: "AI002", name: "Adithya Kumar", section: "A" },
    { roll: "AI003", name: "Harish S", section: "B" },
    { roll: "AI004", name: "Nithya R", section: "B" },
  ],

  "Electronics & Communication": [
    { roll: "EC001", name: "Rohit Kumar", section: "A" },
    { roll: "EC002", name: "Keerthana S", section: "A" },
    { roll: "EC003", name: "Manoj R", section: "B" },
    { roll: "EC004", name: "Swetha P", section: "B" },
  ],
};

const departments = Object.keys(departmentData);

function getToday() {
  return new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
}

function App() {
  const [page, setPage] = useState(
    window.location.hash.replace("#/", "") || "dashboard"
  );

  const [department, setDepartment] = useState("Computer Science");
  const [section, setSection] = useState("All Sections");
  const [attendance, setAttendance] = useState(() => {
    return JSON.parse(localStorage.getItem("attendanceData")) || {};
  });

  const [search, setSearch] = useState("");

  const students = departmentData[department];

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSection =
        section === "All Sections" || student.section === section;

      const matchesSearch =
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.roll.toLowerCase().includes(search.toLowerCase());

      return matchesSection && matchesSearch;
    });
  }, [department, section, search, students]);

  useEffect(() => {
    localStorage.setItem("attendanceData", JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    const handleHashChange = () => {
      setPage(window.location.hash.replace("#/", "") || "dashboard");
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const navigate = (target) => {
    window.location.hash = `/${target}`;
  };

  const markAttendance = (roll, status) => {
    const key = `${getToday()}-${department}-${roll}`;

    setAttendance((prev) => ({
      ...prev,
      [key]: {
        status,
        department,
        date: getToday(),
        roll,
      },
    }));
  };

  const getStatus = (roll) => {
    const key = `${getToday()}-${department}-${roll}`;
    return attendance[key]?.status || "Not Marked";
  };

  const presentCount = students.filter(
    (student) => getStatus(student.roll) === "Present"
  ).length;

  const absentCount = students.filter(
    (student) => getStatus(student.roll) === "Absent"
  ).length;

  const totalStudents = students.length;

  const attendancePercentage =
    totalStudents > 0
      ? Math.round((presentCount / totalStudents) * 100)
      : 0;

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">SA</div>

          <div>
            <h2>Student<span>Attend</span></h2>
            <p>Attendance Management</p>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-avatar">A</div>

          <div>
            <strong>Welcome,</strong>
            <span>Administrator</span>
          </div>
        </div>

        <div className="menu-title">MAIN MENU</div>

        <button
          className={`menu-item ${page === "dashboard" ? "active" : ""}`}
          onClick={() => navigate("dashboard")}
        >
          <span>▣</span>
          Dashboard
        </button>

        <button
          className={`menu-item ${page === "students" ? "active" : ""}`}
          onClick={() => navigate("students")}
        >
          <span>♟</span>
          Students
        </button>

        <div className="menu-title">ATTENDANCE</div>

        <button
          className={`menu-item ${
            page === "attendance" ? "active" : ""
          }`}
          onClick={() => navigate("attendance")}
        >
          <span>✓</span>
          Mark Attendance
        </button>

        <button
          className={`menu-item ${
            page === "report" ? "active" : ""
          }`}
          onClick={() => navigate("report")}
        >
          <span>▥</span>
          Attendance Report
        </button>

        <div className="menu-title">MANAGEMENT</div>

        <button
          className={`menu-item ${page === "settings" ? "active" : ""}`}
          onClick={() => navigate("settings")}
        >
          <span>⚙</span>
          Settings
        </button>

        <div className="sidebar-bottom">
          <div className="online">
            <span></span>
            <div>
              <strong>System Online</strong>
              <small>All services operational</small>
            </div>
          </div>

          <p>© 2026 Student Attendance</p>
        </div>

      </aside>


      {/* MAIN CONTENT */}
      <main className="main">

        {/* TOP BAR */}
        <header className="topbar">

          <div>
            <p className="breadcrumb">
              Administration / {page}
            </p>

            <h1>
              {page === "dashboard" && "Dashboard"}
              {page === "students" && "Students"}
              {page === "attendance" && "Daily Attendance"}
              {page === "report" && "Attendance Report"}
              {page === "settings" && "Settings"}
            </h1>
          </div>

          <div className="profile">
            <div className="profile-avatar">A</div>

            <div>
              <strong>Administrator</strong>
              <span>Admin</span>
            </div>
          </div>

        </header>


        {/* DASHBOARD */}
        {page === "dashboard" && (
          <section>

            <div className="welcome-section">
              <div>
                <span className="small-label">OVERVIEW</span>
                <h2>Good day, Administrator 👋</h2>
                <p>
                  Monitor student attendance and manage academic records.
                </p>
              </div>

              <button
                className="primary-btn"
                onClick={() => navigate("attendance")}
              >
                + Mark Attendance
              </button>
            </div>


            <div className="stats-grid">

              <div className="stat-card">
                <div className="stat-icon blue">♟</div>
                <div>
                  <span>Total Students</span>
                  <h3>248</h3>
                  <small>Registered students</small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon green">✓</div>
                <div>
                  <span>Present Today</span>
                  <h3>{presentCount}</h3>
                  <small>Currently present</small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon red">×</div>
                <div>
                  <span>Absent Today</span>
                  <h3>{absentCount}</h3>
                  <small>Need attention</small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon purple">%</div>
                <div>
                  <span>Attendance Rate</span>
                  <h3>{attendancePercentage}%</h3>
                  <small>Today's attendance</small>
                </div>
              </div>

            </div>


            <div className="dashboard-grid">

              <div className="panel">

                <div className="panel-header">
                  <div>
                    <h3>Today's Attendance</h3>
                    <p>Current department overview</p>
                  </div>

                  <button onClick={() => navigate("report")}>
                    View Report →
                  </button>
                </div>

                <div className="attendance-overview">

                  <div className="progress-circle">
                    <strong>{attendancePercentage}%</strong>
                    <span>Present</span>
                  </div>

                  <div className="overview-info">
                    <div>
                      <span className="dot green-dot"></span>
                      Present
                      <strong>{presentCount}</strong>
                    </div>

                    <div>
                      <span className="dot red-dot"></span>
                      Absent
                      <strong>{absentCount}</strong>
                    </div>

                    <div>
                      <span className="dot gray-dot"></span>
                      Not Marked
                      <strong>
                        {totalStudents - presentCount - absentCount}
                      </strong>
                    </div>
                  </div>

                </div>

              </div>


              <div className="panel">

                <div className="panel-header">
                  <div>
                    <h3>Quick Actions</h3>
                    <p>Manage your attendance</p>
                  </div>
                </div>

                <div className="quick-actions">

                  <button onClick={() => navigate("students")}>
                    <span>♟</span>
                    <div>
                      <strong>Manage Students</strong>
                      <small>View student list</small>
                    </div>
                  </button>

                  <button onClick={() => navigate("attendance")}>
                    <span>✓</span>
                    <div>
                      <strong>Mark Attendance</strong>
                      <small>Record today's attendance</small>
                    </div>
                  </button>

                  <button onClick={() => navigate("report")}>
                    <span>▥</span>
                    <div>
                      <strong>View Reports</strong>
                      <small>Analyze attendance data</small>
                    </div>
                  </button>

                </div>

              </div>

            </div>

          </section>
        )}


        {/* STUDENTS PAGE */}
        {page === "students" && (
          <section>

            <div className="page-heading">
              <div>
                <span className="small-label">STUDENT MANAGEMENT</span>
                <h2>Students</h2>
                <p>View and manage registered students.</p>
              </div>

              <button
                className="primary-btn"
                onClick={() => navigate("attendance")}
              >
                + Mark Attendance
              </button>
            </div>


            <div className="filter-card">

              <div>
                <label>Department</label>

                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  {departments.map((dept) => (
                    <option key={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label>Section</label>

                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                >
                  <option>All Sections</option>
                  <option>A</option>
                  <option>B</option>
                </select>
              </div>

              <div>
                <label>Search</label>

                <input
                  placeholder="Search student..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

            </div>


            <div className="table-card">

              <div className="table-title">
                <div>
                  <h3>{department}</h3>
                  <p>{filteredStudents.length} students found</p>
                </div>
              </div>

              <div className="table-wrapper">

                <table>

                  <thead>
                    <tr>
                      <th>ROLL NO</th>
                      <th>STUDENT NAME</th>
                      <th>SECTION</th>
                      <th>DEPARTMENT</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredStudents.map((student) => (
                      <tr key={student.roll}>

                        <td>
                          <strong>{student.roll}</strong>
                        </td>

                        <td>
                          <div className="student-cell">
                            <div className="student-avatar">
                              {student.name
                                .split(" ")
                                .map((x) => x[0])
                                .join("")
                                .slice(0, 2)}
                            </div>

                            <strong>{student.name}</strong>
                          </div>
                        </td>

                        <td>
                          <span className="section-badge">
                            {student.section}
                          </span>
                        </td>

                        <td>{department}</td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          </section>
        )}


        {/* ATTENDANCE PAGE */}
        {page === "attendance" && (
          <section>

            <div className="page-heading">

              <div>
                <span className="small-label">ATTENDANCE MANAGEMENT</span>
                <h2>Daily Attendance</h2>
                <p>Mark and manage student attendance for today.</p>
              </div>

              <div className="date-box">
                <span>Today</span>
                <strong>{getToday()}</strong>
              </div>

            </div>


            <div className="filter-card">

              <div>
                <label>Department</label>

                <select
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setSection("All Sections");
                  }}
                >
                  {departments.map((dept) => (
                    <option key={dept}>{dept}</option>
                  ))}
                </select>
              </div>


              <div>
                <label>Section</label>

                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                >
                  <option>All Sections</option>
                  <option>A</option>
                  <option>B</option>
                </select>
              </div>

              <div className="filter-button-area">
                <button
                  className="primary-btn"
                  onClick={() => {
                    setSection("All Sections");
                  }}
                >
                  Get Students
                </button>
              </div>

            </div>


            <div className="table-card">

              <div className="table-title">

                <div>
                  <h3>Student Attendance</h3>
                  <p>
                    {department} · {getToday()}
                  </p>
                </div>

                <div className="attendance-summary">
                  <span className="present-summary">
                    ✓ {presentCount} Present
                  </span>

                  <span className="absent-summary">
                    × {absentCount} Absent
                  </span>
                </div>

              </div>


              <div className="table-wrapper">

                <table>

                  <thead>
                    <tr>
                      <th>ROLL NO</th>
                      <th>STUDENT NAME</th>
                      <th>SECTION</th>
                      <th>IN TIME</th>
                      <th>OUT TIME</th>
                      <th>STATUS</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredStudents.map((student) => {

                      const status = getStatus(student.roll);

                      return (
                        <tr key={student.roll}>

                          <td>
                            <strong>{student.roll}</strong>
                          </td>

                          <td>
                            <div className="student-cell">
                              <div className="student-avatar">
                                {student.name
                                  .split(" ")
                                  .map((x) => x[0])
                                  .join("")
                                  .slice(0, 2)}
                              </div>

                              <strong>{student.name}</strong>
                            </div>
                          </td>

                          <td>
                            <span className="section-badge">
                              {student.section}
                            </span>
                          </td>

                          <td>
                            {status === "Present" ? "09:00 AM" : "—"}
                          </td>

                          <td>
                            {status === "Present" ? "04:30 PM" : "—"}
                          </td>

                          <td>

                            {status === "Present" && (
                              <span className="status present">
                                ✓ Present
                              </span>
                            )}

                            {status === "Absent" && (
                              <span className="status absent">
                                × Absent
                              </span>
                            )}

                            {status === "Not Marked" && (
                              <span className="status pending">
                                • Not Marked
                              </span>
                            )}

                          </td>

                          <td>

                            <div className="attendance-actions">

                              <button
                                className="present-btn"
                                onClick={() =>
                                  markAttendance(
                                    student.roll,
                                    "Present"
                                  )
                                }
                              >
                                ✓ Present
                              </button>

                              <button
                                className="absent-btn"
                                onClick={() =>
                                  markAttendance(
                                    student.roll,
                                    "Absent"
                                  )
                                }
                              >
                                × Absent
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>

            </div>

          </section>
        )}


        {/* REPORT PAGE */}
        {page === "report" && (
          <section>

            <div className="page-heading">

              <div>
                <span className="small-label">ANALYTICS</span>
                <h2>Attendance Report</h2>
                <p>Review student attendance performance.</p>
              </div>

              <button className="primary-btn">
                ↓ Export Report
              </button>

            </div>


            <div className="stats-grid">

              <div className="stat-card">
                <div className="stat-icon blue">♟</div>
                <div>
                  <span>Total Students</span>
                  <h3>{totalStudents}</h3>
                  <small>{department}</small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon green">✓</div>
                <div>
                  <span>Present</span>
                  <h3>{presentCount}</h3>
                  <small>Today</small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon red">×</div>
                <div>
                  <span>Absent</span>
                  <h3>{absentCount}</h3>
                  <small>Today</small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon purple">%</div>
                <div>
                  <span>Attendance</span>
                  <h3>{attendancePercentage}%</h3>
                  <small>Overall today</small>
                </div>
              </div>

            </div>


            <div className="table-card">

              <div className="table-title">

                <div>
                  <h3>Detailed Attendance Report</h3>
                  <p>{department} · {getToday()}</p>
                </div>

              </div>

              <div className="table-wrapper">

                <table>

                  <thead>
                    <tr>
                      <th>ROLL NO</th>
                      <th>STUDENT</th>
                      <th>SECTION</th>
                      <th>STATUS</th>
                      <th>ATTENDANCE</th>
                    </tr>
                  </thead>

                  <tbody>

                    {students.map((student) => {

                      const status = getStatus(student.roll);

                      return (
                        <tr key={student.roll}>

                          <td>{student.roll}</td>

                          <td>
                            <strong>{student.name}</strong>
                          </td>

                          <td>{student.section}</td>

                          <td>

                            {status === "Present" && (
                              <span className="status present">
                                ✓ Present
                              </span>
                            )}

                            {status === "Absent" && (
                              <span className="status absent">
                                × Absent
                              </span>
                            )}

                            {status === "Not Marked" && (
                              <span className="status pending">
                                • Not Marked
                              </span>
                            )}

                          </td>

                          <td>
                            <div className="mini-progress">
                              <div
                                style={{
                                  width:
                                    status === "Present"
                                      ? "100%"
                                      : status === "Absent"
                                      ? "0%"
                                      : "50%",
                                }}
                              ></div>
                            </div>
                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>

            </div>

          </section>
        )}


        {/* SETTINGS PAGE */}
        {page === "settings" && (
          <section>

            <div className="page-heading">

              <div>
                <span className="small-label">SYSTEM MANAGEMENT</span>
                <h2>Settings</h2>
                <p>Manage application preferences.</p>
              </div>

            </div>


            <div className="settings-grid">

              <div className="settings-card">

                <div className="settings-icon">🏫</div>

                <div>
                  <h3>Institution Details</h3>
                  <p>Configure your institution information.</p>
                </div>

                <input
                  defaultValue="Student Attendance Management System"
                />

              </div>


              <div className="settings-card">

                <div className="settings-icon">👤</div>

                <div>
                  <h3>Administrator</h3>
                  <p>Manage administrator profile.</p>
                </div>

                <input defaultValue="Administrator" />

              </div>


              <div className="settings-card">

                <div className="settings-icon">🔔</div>

                <div>
                  <h3>Notifications</h3>
                  <p>Configure attendance notifications.</p>
                </div>

                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span></span>
                </label>

              </div>


              <div className="settings-card">

                <div className="settings-icon">💾</div>

                <div>
                  <h3>Local Data</h3>
                  <p>Attendance data is stored in browser storage.</p>
                </div>

                <button
                  className="danger-btn"
                  onClick={() => {
                    localStorage.removeItem("attendanceData");
                    setAttendance({});
                  }}
                >
                  Clear Attendance Data
                </button>

              </div>

            </div>

          </section>
        )}

      </main>

    </div>
  );
}

export default App;