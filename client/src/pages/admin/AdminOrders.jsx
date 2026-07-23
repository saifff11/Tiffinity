import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { RefreshCw, Search, SlidersHorizontal } from "lucide-react";

const initialFilters = {
  search: "",
  status: "all",
  paymentStatus: "all",
  mealType: "all",
  city: "",
  dateFrom: "",
  dateTo: "",
};

const statusOptions = [
  "all",
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "delivered",
  "cancelled",
];

const paymentOptions = ["all", "pending", "paid", "failed"];
const mealOptions = ["all", "lunch", "dinner"];

const badgeClass = (value) => {
  if (["paid", "delivered", "ready"].includes(value)) return "badge-verified";
  if (["failed", "cancelled"].includes(value)) return "badge-rejected";
  return "badge-pending";
};

const formatDateTime = (value) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const getOrderId = (id = "") => `#${id.slice(-6).toUpperCase()}`;

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") params.set(key, value.trim());
    });
    return params.toString();
  }, [filters]);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await axiosInstance.get(
        `/admin/orders${queryString ? `?${queryString}` : ""}`,
      );
      setOrders(data.orders);
      setSummary(data.summary);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  const updateFilter = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => setFilters(initialFilters);

  return (
    <div>
      <div className='dashboard-wrap'>
        <Navbar showBack backPath='/admin/dashboard' backLabel='Dashboard' />

        <div
          className='dashboard-content px-3 sm:px-4 md:px-6'
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            paddingBottom: "48px",
          }}>
          <div className='mb-6 sm:mb-8' style={{ marginBottom: "32px" }}>
            <div className='dashboard-title text-2xl sm:text-3xl'>
              All Orders
            </div>
            <div className='dashboard-subtitle text-sm sm:text-base'>
              Monitor customer orders, payments, cooks, cities and delivery
              status in one place
            </div>
          </div>

          {error && (
            <div className='error-box' style={{ marginBottom: "20px" }}>
              {error}
            </div>
          )}

          <div
            className='stats-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6'
            style={{
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 190px), 1fr))",
            }}>
            {[
              ["Total Orders", summary?.total ?? 0, ""],
              ["Active Orders", summary?.active ?? 0, "amber"],
              ["Delivered", summary?.delivered ?? 0, "green"],
              ["Cancelled", summary?.cancelled ?? 0, ""],
              ["Paid Orders", summary?.paid ?? 0, "green"],
              ["Paid Revenue", `Rs.${summary?.revenue ?? 0}`, "green"],
            ].map(([label, value, tone]) => (
              <div className='stat-card' key={label}>
                <div className='stat-card-label'>{label}</div>
                <div className={`stat-card-value ${tone}`}>{value}</div>
              </div>
            ))}
          </div>

          <div className='table-card' style={{ marginBottom: "24px" }}>
            <div className='table-card-header'>
              <div
                className='table-card-title'
                style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <SlidersHorizontal size={16} /> Filters
              </div>
              <button
                className='btn-approve'
                style={{ marginLeft: 0 }}
                onClick={clearFilters}>
                Clear
              </button>
            </div>

            <div
              style={{
                padding: "20px 24px",
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
                gap: "14px",
              }}>
              <FilterInput
                icon={<Search size={15} />}
                label='Search'
                placeholder='Dish, user, payment id'
                value={filters.search}
                onChange={(value) => updateFilter("search", value)}
              />
              <FilterSelect
                label='Order Status'
                value={filters.status}
                options={statusOptions}
                onChange={(value) => updateFilter("status", value)}
              />
              <FilterSelect
                label='Payment'
                value={filters.paymentStatus}
                options={paymentOptions}
                onChange={(value) => updateFilter("paymentStatus", value)}
              />
              <FilterSelect
                label='Meal'
                value={filters.mealType}
                options={mealOptions}
                onChange={(value) => updateFilter("mealType", value)}
              />
              <FilterInput
                label='City'
                placeholder='Meerut'
                value={filters.city}
                onChange={(value) => updateFilter("city", value)}
              />
              <FilterInput
                label='From'
                type='date'
                value={filters.dateFrom}
                onChange={(value) => updateFilter("dateFrom", value)}
              />
              <FilterInput
                label='To'
                type='date'
                value={filters.dateTo}
                onChange={(value) => updateFilter("dateTo", value)}
              />
              <button
                className='auth-btn'
                onClick={fetchOrders}
                disabled={loading}
                style={{
                  marginTop: "20px",
                  padding: "10px 16px",
                  fontSize: "0.8125rem",
                  width: "100%",
                }}>
                <RefreshCw size={14} /> {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>

          <div className='table-card'>
            <div className='table-card-header'>
              <div className='table-card-title'>Order Records</div>
              <div
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--outline)",
                  fontFamily: "var(--font-body)",
                }}>
                {orders.length} result{orders.length !== 1 ? "s" : ""}
              </div>
            </div>

            {loading ? (
              <EmptyState title='Loading orders...' />
            ) : orders.length === 0 ? (
              <EmptyState title='No orders found' />
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Cook</th>
                      <th>Dish</th>
                      <th>Amount</th>
                      <th>Meal</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Placed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <div
                            style={{
                              fontWeight: 800,
                              color: "var(--on-surface)",
                              fontFamily: "var(--font-display)",
                            }}>
                            {getOrderId(order._id)}
                          </div>
                          <div
                            style={{
                              fontSize: "0.72rem",
                              color: "var(--outline)",
                              marginTop: "4px",
                            }}>
                            Qty {order.quantity}
                          </div>
                        </td>
                        <PersonCell
                          name={order.customerId?.name}
                          email={order.customerId?.email}
                          meta={order.customerId?.city}
                        />
                        <PersonCell
                          name={order.cookId?.userId?.name}
                          email={order.cookId?.userId?.email}
                          meta={order.cookId?.city}
                        />
                        <td>
                          <div style={{ fontWeight: 700 }}>
                            {order.dish?.name || "N/A"}
                          </div>
                          <div
                            style={{
                              color: "var(--outline)",
                              fontSize: "0.75rem",
                              marginTop: "4px",
                            }}>
                            Rs.{order.dish?.price ?? 0} each
                          </div>
                        </td>
                        <td
                          style={{
                            fontWeight: 900,
                            color: "var(--primary-container)",
                            fontFamily: "var(--font-display)",
                          }}>
                          Rs.{order.totalAmount}
                        </td>
                        <td>
                          <span className='badge badge-customer'>
                            {order.menuId?.mealType || "N/A"}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${badgeClass(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${badgeClass(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                          {order.paymentId && (
                            <div
                              style={{
                                color: "var(--outline)",
                                fontSize: "0.7rem",
                                marginTop: "5px",
                              }}>
                              {order.paymentId}
                            </div>
                          )}
                        </td>
                        <td
                          style={{
                            color: "var(--on-surface-variant)",
                            fontSize: "0.8125rem",
                            whiteSpace: "nowrap",
                          }}>
                          {formatDateTime(order.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

function FilterInput({ icon, label, onChange, type = "text", ...props }) {
  return (
    <label className='inp-group' style={{ marginBottom: 0 }}>
      <span className='inp-label'>{label}</span>
      <div className='inp-icon-wrap'>
        {icon && <span className='inp-icon'>{icon}</span>}
        <input
          className='inp-field'
          type={type}
          onChange={(e) => onChange(e.target.value)}
          style={{ paddingLeft: icon ? undefined : "16px" }}
          {...props}
        />
      </div>
    </label>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className='inp-group' style={{ marginBottom: 0 }}>
      <span className='inp-label'>{label}</span>
      <select
        className='inp-field'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ paddingLeft: "16px", textTransform: "capitalize" }}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function PersonCell({ name, email, meta }) {
  return (
    <td>
      <div
        style={{
          fontWeight: 700,
          color: "var(--on-surface)",
          fontFamily: "var(--font-display)",
        }}>
        {name || "N/A"}
      </div>
      <div style={{ color: "var(--outline)", fontSize: "0.75rem" }}>
        {email || "No email"}
      </div>
      {meta && (
        <div
          style={{
            color: "var(--on-surface-variant)",
            fontSize: "0.72rem",
            marginTop: "4px",
          }}>
          {meta}
        </div>
      )}
    </td>
  );
}

function EmptyState({ title }) {
  return (
    <div
      style={{
        padding: "44px 20px",
        textAlign: "center",
        color: "var(--outline)",
        fontFamily: "var(--font-body)",
        fontWeight: 600,
      }}>
      {title}
    </div>
  );
}

export default AdminOrders;
