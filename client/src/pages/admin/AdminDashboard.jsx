import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmBanId, setConfirmBanId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        axiosInstance.get("/admin/stats"),
        axiosInstance.get("/admin/users"),
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
    } catch (err) {
      void err;
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async () => {
    try {
      await axiosInstance.put(`/admin/users/${confirmBanId}/ban`);
      setUsers(
        users.map((u) =>
          u._id === confirmBanId ? { ...u, isActive: !u.isActive } : u,
        ),
      );
      setConfirmBanId(null);
    } catch (err) {
      void err;
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/admin/users/${confirmDeleteId}`);
      setUsers((prev) => prev.filter((u) => u._id !== confirmDeleteId));
      setConfirmDeleteId(null);
    } catch (err) {
      void err;
    }
  };

  const navigate = useNavigate();
  const handleView = (id) => {
    navigate(`/admin/users/${id}`);
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--surface)",
        }}>
        <div
          style={{
            fontSize: "14px",
            color: "var(--outline)",
            fontFamily: "var(--font-body)",
          }}>
          Loading…
        </div>
      </div>
    );

  const banTargetUser = users.find((u) => u._id === confirmBanId);

  return (
    <div>
      <div className='dashboard-wrap'>
        <Navbar />

        <div
          className='dashboard-content px-3 sm:px-4 md:px-6'
          style={{
            maxWidth: "1300px",
            margin: "0 auto",
            paddingBottom: "48px",
          }}>
          {/* ── Page Header ── */}
          <div className='mb-6 sm:mb-8' style={{ marginBottom: "36px" }}>
            <div className='dashboard-title text-2xl sm:text-3xl'>
              Admin Dashboard
            </div>
            <div className='dashboard-subtitle text-sm sm:text-base'>
              Platform overview and management
            </div>
          </div>

          {/* ── Stats ── */}
          <div
            className='stats-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6'
            style={{
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
            }}>
            <div className='stat-card'>
              <div className='stat-card-label'>Total Customers</div>
              <div className='stat-card-value'>{stats?.totalUsers ?? 0}</div>
            </div>
            <div className='stat-card'>
              <div className='stat-card-label'>Total Verified Cooks</div>
              <div className='stat-card-value green'>
                {stats?.totalCooks ?? 0}
              </div>
            </div>
            <div className='stat-card'>
              <div className='stat-card-label'>Pending Approvals</div>
              <div className='stat-card-value amber'>
                {stats?.pendingCooks ?? 0}
              </div>
            </div>
          </div>

          {/* ── Quick Actions ── */}
          <div className='table-card' style={{ marginBottom: "28px" }}>
            <div className='table-card-header'>
              <div className='table-card-title'>Quick Actions</div>
            </div>
            <div style={{ padding: "20px 28px" }}>
              <Link
                to='/admin/pending-cooks'
                style={{ textDecoration: "none" }}>
                <button
                  className='auth-btn'
                  style={{
                    width: "min(100%, 320px)",
                    padding: "10px 24px",
                    fontSize: "0.8125rem",
                    marginTop: 0,
                  }}>
                  Review Pending Cooks ({stats?.pendingCooks ?? 0})
                </button>
              </Link>
            </div>
          </div>

          {/* ── All Users Table ── */}
          <div className='table-card'>
            <div className='table-card-header'>
              <div className='table-card-title'>All Users</div>
              <div
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--outline)",
                  fontFamily: "var(--font-body)",
                }}>
                {users.length} total
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>City</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td
                      style={{
                        fontWeight: 600,
                        color: "var(--on-surface)",
                        fontFamily: "var(--font-display)",
                      }}>
                      {u.name}
                    </td>
                    <td
                      style={{
                        color: "var(--outline)",
                        fontSize: "0.8125rem",
                      }}>
                      {u.email}
                    </td>
                    <td>
                      <span className={`badge badge-${u.role}`}>{u.role}</span>
                    </td>
                    <td
                      style={{
                        color: "var(--on-surface-variant)",
                        fontSize: "0.875rem",
                      }}>
                      {u.city}
                    </td>
                    <td>
                      <span
                        className={`badge ${u.isActive ? "badge-verified" : "badge-rejected"}`}>
                        {u.isActive ? "Active" : "Banned"}
                      </span>
                    </td>
                    <td>
                      {u.role !== "admin" && (
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                          }}>
                          <button
                            className={
                              u.isActive ? "btn-reject" : "btn-approve"
                            }
                            style={{ marginLeft: 0 }}
                            onClick={() => setConfirmBanId(u._id)}>
                            {u.isActive ? "Ban" : "Unban"}
                          </button>
                          <button
                            className='btn-reject'
                            style={{ marginLeft: 0 }}
                            onClick={() => setConfirmDeleteId(u._id)}>
                            Delete
                          </button>
                          <button
                            className='btn-approve'
                            style={{ marginLeft: 0 }}
                            onClick={() => handleView(u._id)}>
                            View
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Footer />
      </div>

      {/* ── Confirm Ban / Unban Dialog ── */}
      {confirmBanId && (
        <ConfirmDialog
          message={
            banTargetUser?.isActive
              ? `Are you sure you want to ban '${banTargetUser?.name}' ?`
              : `Are you sure you want to unban ${banTargetUser?.name}?`
          }
          confirmLabel={banTargetUser?.isActive ? "Ban" : "Unban"}
          confirmColor={banTargetUser?.isActive ? "#DC2626" : "#16A34A"}
          onConfirm={handleBan}
          onCancel={() => setConfirmBanId(null)}
        />
      )}

      {/* ── Confirm Delete Dialog ── */}
      {confirmDeleteId && (
        <ConfirmDialog
          message='Are you sure you want to delete this user? This cannot be undone.'
          confirmLabel='Delete'
          confirmColor='#DC2626'
          onConfirm={handleDelete}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
