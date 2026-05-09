import stockPhotos from "../utils/stockPhotos";
import { X } from "lucide-react";

const DishForm = ({
  dish,
  index,
  onFieldChange,
  onRemove,
  canRemove,
  photoPicker,
  setPhotoPicker,
  onSelectPhoto,
}) => (
  <div
    style={{
      background: "var(--surface-container-lowest)",
      border: "1px solid var(--surface-container-high)",
      borderRadius: "var(--radius-lg)",
      padding: "clamp(14px, 4vw, 20px)",
      marginBottom: "clamp(10px, 2.5vw, 14px)",
      boxShadow: "0 1px 8px rgba(20,27,43,0.03)",
    }}>
    {/* Card header */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "clamp(12px, 3vw, 18px)",
        gap: "clamp(8px, 2vw, 10px)",
        flexWrap: "wrap",
      }}>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "clamp(0.8rem, 2vw, 0.875rem)",
          color: "var(--on-surface)",
          letterSpacing: "-0.01em",
        }}>
        Dish {index + 1}
      </span>
      {canRemove && (
        <button
          type='button'
          onClick={() => onRemove(index)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "clamp(5px, 1.5vw, 6px) clamp(10px, 2.5vw, 12px)",
            borderRadius: "var(--radius-lg)",
            border: "none",
            background: "#fee2e2",
            color: "#991b1b",
            fontSize: "clamp(0.68rem, 1.8vw, 0.75rem)",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            whiteSpace: "nowrap",
          }}>
          <X size={12} /> Remove
        </button>
      )}
    </div>

    {/* Photo picker */}
    <div style={{ marginBottom: "clamp(12px, 3vw, 16px)" }}>
      <label
        className='inp-label'
        style={{
          display: "block",
          marginBottom: "clamp(6px, 1.5vw, 8px)",
          fontSize: "clamp(0.72rem, 2vw, 0.8125rem)",
        }}>
        Photo
      </label>
      {dish.photo ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(10px, 2.5vw, 14px)",
            flexWrap: "wrap",
          }}>
          <img
            src={dish.photo}
            alt='dish'
            style={{
              width: "clamp(56px, 16vw, 72px)",
              height: "clamp(56px, 16vw, 72px)",
              borderRadius: "var(--radius-lg)",
              objectFit: "cover",
              border: "2px solid var(--border-light)",
              flexShrink: 0,
            }}
          />
          <button
            type='button'
            onClick={() => setPhotoPicker(photoPicker === index ? null : index)}
            style={{
              fontSize: "clamp(0.72rem, 2vw, 0.8125rem)",
              fontWeight: 700,
              color: "var(--primary)",
              background: "var(--primary-fixed)",
              border: "none",
              padding: "clamp(5px, 1.5vw, 6px) clamp(10px, 2.5vw, 14px)",
              borderRadius: "var(--radius-lg)",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}>
            Change Photo
          </button>
        </div>
      ) : (
        <button
          type='button'
          onClick={() => setPhotoPicker(photoPicker === index ? null : index)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(6px, 1.5vw, 8px)",
            padding: "clamp(8px, 2.2vw, 10px) clamp(12px, 3vw, 18px)",
            borderRadius: "var(--radius-lg)",
            border: "2px dashed var(--border-light)",
            background: "var(--surface-container-high)",
            color: "var(--on-surface-variant)",
            fontSize: "clamp(0.72rem, 2vw, 0.8125rem)",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            transition: "all 0.2s",
            width: "100%",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--primary)";
            e.currentTarget.style.color = "var(--primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-light)";
            e.currentTarget.style.color = "var(--on-surface-variant)";
          }}>
          <span
            className='material-symbols-outlined'
            style={{ fontSize: "clamp(14px, 3.5vw, 16px)" }}>
            add_a_photo
          </span>
          <span style={{ whiteSpace: "nowrap" }}>Pick a photo</span>
        </button>
      )}

      {/* Photo grid */}
      {photoPicker === index && (
        <div
          style={{
            marginTop: "clamp(10px, 2.5vw, 14px)",
            padding: "clamp(12px, 3vw, 16px)",
            background: "var(--surface-container-low)",
            borderRadius: "var(--radius-lg)",
          }}>
          <div className='photo-picker-grid'>
            {stockPhotos.map((p, pi) => (
              <div key={pi}>
                <div
                  className={`photo-picker-item ${dish.photo === p.url ? "selected" : ""}`}
                  onClick={() => onSelectPhoto(index, p.url)}>
                  <img src={p.url} alt={p.name} />
                </div>
                <div className='photo-picker-name'>{p.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Dish name */}
    <div className='inp-group'>
      <label className='inp-label'>Dish Name</label>
      <div className='inp-icon-wrap'>
        <span className='material-symbols-outlined inp-icon'>restaurant</span>
        <input
          className='inp-field'
          type='text'
          value={dish.name}
          onChange={(e) => onFieldChange(index, "name", e.target.value)}
          placeholder='e.g. Dal Tadka'
          required
        />
      </div>
    </div>

    {/* Description */}
    <div className='inp-group'>
      <label className='inp-label'>
        Description&nbsp;
        <span
          style={{
            fontWeight: 400,
            textTransform: "none",
            letterSpacing: 0,
            fontSize: "10px",
          }}>
          (optional)
        </span>
      </label>
      <div className='inp-icon-wrap'>
        <span className='material-symbols-outlined inp-icon'>notes</span>
        <input
          className='inp-field'
          type='text'
          value={dish.description}
          onChange={(e) => onFieldChange(index, "description", e.target.value)}
          placeholder='e.g. Homemade dal with tadka'
        />
      </div>
    </div>

    {/* Price + Portions */}
    <div
      className='inp-row'
      style={{
        display: "flex",
        gap: "clamp(12px, 3vw, 16px)",
        flexWrap: "wrap",
      }}>
      <div className='inp-group'>
        <label className='inp-label'>Price (₹)</label>
        <div className='inp-icon-wrap'>
          <span className='material-symbols-outlined inp-icon'>
            currency_rupee
          </span>
          <input
            className='inp-field'
            type='number'
            value={dish.price}
            onChange={(e) => onFieldChange(index, "price", e.target.value)}
            placeholder='80'
            required
            min='1'
          />
        </div>
      </div>
      <div className='inp-group'>
        <label className='inp-label'>Max Portions</label>
        <div className='inp-icon-wrap'>
          <span className='material-symbols-outlined inp-icon'>groups</span>
          <input
            className='inp-field'
            type='number'
            value={dish.maxPortions}
            onChange={(e) =>
              onFieldChange(index, "maxPortions", e.target.value)
            }
            placeholder='10'
            required
            min='1'
          />
        </div>
      </div>
    </div>
  </div>
);

export default DishForm;
