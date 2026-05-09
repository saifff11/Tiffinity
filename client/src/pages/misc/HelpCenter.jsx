// import React, { useState } from "react";
// import Footer from "../../components/Footer";
// import MiscNavbar from "../../components/MiscNavbar";

// const HelpCenter = () => {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     subject: "Order Issue",
//     message: "",
//   });

//   const handleChange = (e) =>
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

//   const handleSubmit = (e) => {
//     e.preventDefault();
//   };

//   const categories = [
//     {
//       icon: "receipt_long",
//       iconBg: "var(--primary-fixed)",
//       iconColor: "var(--primary)",
//       title: "Orders",
//       items: [
//         "Tracking status",
//         "Cancelling a purchase",
//         "Batch shipping info",
//       ],
//     },
//     {
//       icon: "local_shipping",
//       iconBg: "var(--secondary-fixed)",
//       iconColor: "var(--secondary)",
//       title: "Delivery",
//       items: ["Eco-friendly packaging", "International rates", "Missing items"],
//     },
//     {
//       icon: "restaurant",
//       iconBg: "var(--tertiary-fixed)",
//       iconColor: "var(--tertiary)",
//       title: "Becoming a Cook",
//       items: [
//         "Creator application",
//         "Health regulations",
//         "Setting your kitchen",
//       ],
//     },
//     {
//       icon: "account_balance_wallet",
//       iconBg: "var(--primary-fixed)",
//       iconColor: "var(--primary)",
//       title: "Payments",
//       items: ["Wallet withdrawals", "Currency alchemy", "Tax documentation"],
//     },
//   ];

//   return (
//     <div className='dashboard-wrap'>
//       {/* ── Top Navigation Bar ── */}
//       <MiscNavbar />

//       {/* ── Main Content ── */}
//       <main style={{ paddingTop: "6rem", paddingBottom: "5rem" }}>
//         {/* ── Hero / Search Section ── */}
//         <section
//           style={{
//             position: "relative",
//             borderRadius: "var(--radius-lg)",
//             overflow: "hidden",
//             marginBottom: "4rem",
//             height: "400px",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             textAlign: "center",
//             padding: "0 1rem",
//             maxWidth: "1100px",
//             margin: "0 auto 4rem",
//           }}>
//           {/* Background image + overlay */}
//           <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
//             <img
//               style={{ width: "100%", height: "100%", objectFit: "cover" }}
//               src='https://lh3.googleusercontent.com/aida-public/AB6AXuCPDMyNDH3ByrQvYNFdT_dnbtDpdGED5LlMOUJN9ztrrCRShEgpscJPDepnCVLuoeH1qAPs_4yFqS38tlkpK2MsIy1jx8qZNb68lnAJR4lWiSX5LpxfdvoCZMkoSbt3cHoOQykKLiOen-GT_e4tLdPw7DvGO5VdnFYFgGxs_RI3k1GO0GL1YpZM4ODMtJxypDWFBMbK5MKPldEOt9tCb8vh0M3WJsjnJEH1oj_sd02p1BSQu_1ZLBqVbGcJUuCn0VEyOr0F6cVUgTbj'
//               alt='abstract flowing liquid gradients in shades of emerald green and soft turquoise'
//             />
//             <div
//               style={{
//                 position: "absolute",
//                 inset: 0,
//                 background: "rgba(5,150,105,0.2)",
//                 backdropFilter: "blur(2px)",
//               }}
//             />
//           </div>

//           {/* Foreground */}
//           <div
//             style={{
//               position: "relative",
//               zIndex: 1,
//               width: "100%",
//               maxWidth: "42rem",
//             }}>
//             <h1
//               className='auth-right-headline'
//               style={{ color: "#fff", marginBottom: "1.5rem" }}>
//               How can we help you today?
//             </h1>

//             <div style={{ position: "relative" }}>
//               <input
//                 style={{
//                   width: "100%",
//                   padding: "1.5rem 2rem",
//                   borderRadius: "var(--radius-lg)",
//                   background: "rgba(255,255,255,0.9)",
//                   backdropFilter: "blur(12px)",
//                   border: "none",
//                   boxShadow: "0 8px 40px rgba(20,27,43,0.18)",
//                   fontSize: "1.125rem",
//                   outline: "none",
//                   color: "var(--on-surface)",
//                   fontFamily: "var(--font-body)",
//                   transition: "background 0.2s",
//                 }}
//                 placeholder='Search for articles, orders, or guides...'
//                 type='text'
//               />
//               <button
//                 className='auth-btn'
//                 style={{
//                   position: "absolute",
//                   right: "1rem",
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   width: "auto",
//                   padding: "12px 24px",
//                   marginTop: 0,
//                 }}>
//                 Search
//               </button>
//             </div>

//             <p
//               className='auth-right-body'
//               style={{
//                 marginTop: "1.5rem",
//                 color: "rgba(255,255,255,0.75)",
//                 fontWeight: 500,
//               }}>
//               Popular: Refunding a batch, Culinary onboarding, Shipping fees
//             </p>
//           </div>
//         </section>

//         {/* ── FAQ Categories Bento Grid ── */}
//         <section className='dashboard-content' style={{ marginBottom: "6rem" }}>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "flex-end",
//               justifyContent: "space-between",
//               marginBottom: "2rem",
//             }}>
//             <div>
//               <h2 className='dashboard-title' style={{ marginBottom: "4px" }}>
//                 Browse Categories
//               </h2>
//               <p className='dashboard-subtitle' style={{ marginBottom: 0 }}>
//                 Select a topic to find detailed help articles
//               </p>
//             </div>
//           </div>

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
//               gap: "1.5rem",
//             }}>
//             {categories.map((cat) => (
//               <div
//                 key={cat.title}
//                 className='table-card'
//                 style={{
//                   padding: "2rem",
//                   cursor: "pointer",
//                   border: "1px solid var(--outline-variant)",
//                   transition: "border-color 0.2s, box-shadow 0.2s",
//                 }}>
//                 <div
//                   style={{
//                     width: "3.5rem",
//                     height: "3.5rem",
//                     background: cat.iconBg,
//                     borderRadius: "var(--radius-lg)",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     marginBottom: "1.5rem",
//                     transition: "transform 0.2s",
//                   }}>
//                   <span
//                     className='material-symbols-outlined'
//                     style={{ color: cat.iconColor, fontSize: "1.75rem" }}>
//                     {cat.icon}
//                   </span>
//                 </div>
//                 <h3
//                   className='table-card-title'
//                   style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
//                   {cat.title}
//                 </h3>
//                 <ul
//                   style={{
//                     listStyle: "none",
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: "8px",
//                   }}>
//                   {cat.items.map((item) => (
//                     <li
//                       key={item}
//                       style={{
//                         fontSize: "0.875rem",
//                         color: "var(--on-surface-variant)",
//                         cursor: "pointer",
//                         transition: "color 0.15s",
//                       }}>
//                       {item}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* ── Support Section ── */}
//         <section
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
//             gap: "3rem",
//             background: "var(--surface-container)",
//             borderRadius: "var(--radius-lg)",
//             padding: "3rem",
//             overflow: "hidden",
//             position: "relative",
//             maxWidth: "1100px",
//             margin: "0 auto",
//           }}>
//           {/* Left: contact options */}
//           <div style={{ position: "relative", zIndex: 1 }}>
//             <h2 className='dashboard-title' style={{ marginBottom: "1.5rem" }}>
//               Still need help?
//             </h2>
//             <p
//               className='auth-page-sub'
//               style={{
//                 fontSize: "1.125rem",
//                 marginBottom: "2.5rem",
//                 maxWidth: "28rem",
//               }}>
//               Our Alchemist support team is available 24/7 to assist you with
//               any questions or technical issues.
//             </p>

//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "1.5rem",
//               }}>
//               {/* Live Chat */}
//               <div
//                 className='stat-card'
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "1rem",
//                   border: "1px solid var(--outline-variant)",
//                 }}>
//                 <div
//                   style={{
//                     width: "3rem",
//                     height: "3rem",
//                     borderRadius: "50%",
//                     background: "var(--primary-fixed)",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     flexShrink: 0,
//                   }}>
//                   <span
//                     className='material-symbols-outlined'
//                     style={{ color: "var(--primary)" }}>
//                     forum
//                   </span>
//                 </div>
//                 <div>
//                   <h4 className='table-card-title'>Live Chat</h4>
//                   <p style={{ fontSize: "0.875rem", color: "var(--outline)" }}>
//                     Response time: &lt; 2 minutes
//                   </p>
//                 </div>
//                 <button
//                   className='auth-btn'
//                   style={{
//                     marginLeft: "auto",
//                     width: "auto",
//                     padding: "8px 16px",
//                     marginTop: 0,
//                     fontSize: "0.875rem",
//                   }}>
//                   Start Chat
//                 </button>
//               </div>

//               {/* Email */}
//               <div
//                 className='stat-card'
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "1rem",
//                   border: "1px solid var(--outline-variant)",
//                 }}>
//                 <div
//                   style={{
//                     width: "3rem",
//                     height: "3rem",
//                     borderRadius: "50%",
//                     background: "var(--tertiary-fixed)",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     flexShrink: 0,
//                   }}>
//                   <span
//                     className='material-symbols-outlined'
//                     style={{ color: "var(--tertiary)" }}>
//                     mail
//                   </span>
//                 </div>
//                 <div>
//                   <h4 className='table-card-title'>Email Support</h4>
//                   <p style={{ fontSize: "0.875rem", color: "var(--outline)" }}>
//                     Response time: ~4 hours
//                   </p>
//                 </div>
//                 <button
//                   className='role-toggle-btn'
//                   style={{
//                     marginLeft: "auto",
//                     width: "auto",
//                     padding: "8px 16px",
//                     border: "2px solid var(--primary)",
//                     color: "var(--primary)",
//                   }}>
//                   Send Email
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Right: contact form */}
//           <div
//             className='stat-card'
//             style={{
//               position: "relative",
//               zIndex: 1,
//               background: "var(--surface-container-lowest)",
//               padding: "2rem",
//               boxShadow: "0 8px 40px rgba(20,27,43,0.10)",
//             }}>
//             <h3 className='auth-page-title' style={{ marginBottom: "1.5rem" }}>
//               Contact Support
//             </h3>

//             <div
//               style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr",
//                   gap: "1rem",
//                 }}>
//                 <div className='inp-group'>
//                   <label className='inp-label'>Full Name</label>
//                   <input
//                     name='name'
//                     value={form.name}
//                     onChange={handleChange}
//                     className='inp-field no-icon'
//                     type='text'
//                   />
//                 </div>
//                 <div className='inp-group'>
//                   <label className='inp-label'>Email Address</label>
//                   <input
//                     name='email'
//                     value={form.email}
//                     onChange={handleChange}
//                     className='inp-field no-icon'
//                     type='email'
//                   />
//                 </div>
//               </div>

//               <div className='inp-group'>
//                 <label className='inp-label'>Subject</label>
//                 <select
//                   name='subject'
//                   value={form.subject}
//                   onChange={handleChange}
//                   className='inp-field no-icon'>
//                   <option>Order Issue</option>
//                   <option>Payment Query</option>
//                   <option>Creator Portal Help</option>
//                   <option>Technical Bug</option>
//                 </select>
//               </div>

//               <div className='inp-group'>
//                 <label className='inp-label'>Message</label>
//                 <textarea
//                   name='message'
//                   value={form.message}
//                   onChange={handleChange}
//                   className='inp-field no-icon'
//                   placeholder='Describe your issue in detail...'
//                   rows={4}
//                   style={{ resize: "vertical", height: "auto" }}
//                 />
//               </div>

//               <button
//                 onClick={handleSubmit}
//                 className='auth-btn'
//                 style={{ marginTop: "4px" }}>
//                 Send Message
//               </button>
//             </div>
//           </div>

//           {/* Decorative blob */}
//           <div
//             style={{
//               position: "absolute",
//               right: "-5rem",
//               bottom: "-5rem",
//               width: "20rem",
//               height: "20rem",
//               background: "rgba(6,78,59,0.15)",
//               borderRadius: "50%",
//               filter: "blur(48px)",
//               pointerEvents: "none",
//             }}
//           />
//         </section>

//         {/* ── Featured Articles ── */}
//         <section className='dashboard-content' style={{ marginTop: "6rem" }}>
//           <h2 className='dashboard-title' style={{ marginBottom: "3rem" }}>
//             Newest Resources
//           </h2>

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(12, 1fr)",
//               gap: "1.5rem",
//               height: "500px",
//             }}>
//             {/* Large feature card */}
//             <div
//               style={{
//                 gridColumn: "span 8",
//                 position: "relative",
//                 borderRadius: "var(--radius-lg)",
//                 overflow: "hidden",
//                 cursor: "pointer",
//                 boxShadow: "0 4px 32px rgba(20,27,43,0.12)",
//               }}>
//               <img
//                 style={{
//                   position: "absolute",
//                   inset: 0,
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "cover",
//                   transition: "transform 0.5s",
//                 }}
//                 src='https://lh3.googleusercontent.com/aida-public/AB6AXuACkJ3N0rUVUkmRDFhe7fz5t9yMo9LKrlmVTLSy3v8G5GbYtKfQiE9w_jmDyxKYbnde35b7C3Gd5L9o3HPsoLTQpjUiRfIaaWjCdxmaH0XVclwlf69lVbd9gWJwRt8mqFrtHipBSrCnJ814iteC_YrWTecyVqUFEYA7VjIYb_XgzhE5j7PmzwFpkuyzpffgkAo5KzKrjCxY-qmhuwg6T6p_Ojo4NAN7k-4QUER2WZs_ui6ftLIS7iQmVZfRKPOyvC8l0_jdFxoYlAQg'
//                 alt='commercial kitchen interior with professional chef plating a vibrant healthy meal'
//               />
//               <div
//                 style={{
//                   position: "absolute",
//                   inset: 0,
//                   background:
//                     "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
//                 }}
//               />
//               <div
//                 style={{ position: "absolute", bottom: 0, padding: "2.5rem" }}>
//                 <span
//                   className='badge badge-verified'
//                   style={{ marginBottom: "1rem", display: "inline-block" }}>
//                   GUIDE
//                 </span>
//                 <h3
//                   className='auth-right-headline'
//                   style={{ fontSize: "1.75rem", marginBottom: "1rem" }}>
//                   Mastering the TiffinBox Kitchen
//                 </h3>
//                 <p
//                   style={{
//                     color: "rgba(255,255,255,0.85)",
//                     maxWidth: "36rem",
//                     fontSize: "0.9375rem",
//                   }}>
//                   Everything you need to know about setting up your workspace
//                   and meeting global hygiene standards for creators.
//                 </p>
//               </div>
//             </div>

//             {/* Two smaller cards */}
//             <div
//               style={{
//                 gridColumn: "span 4",
//                 display: "grid",
//                 gridTemplateRows: "1fr 1fr",
//                 gap: "1.5rem",
//               }}>
//               <div
//                 className='stat-card'
//                 style={{
//                   background: "var(--surface-container-high)",
//                   padding: "2rem",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "space-between",
//                   cursor: "pointer",
//                   border: "1px solid var(--outline-variant)",
//                   transition: "transform 0.2s",
//                 }}>
//                 <div>
//                   <h4
//                     className='table-card-title'
//                     style={{ fontSize: "1.25rem", marginBottom: "8px" }}>
//                     Wallet Transition 2.0
//                   </h4>
//                   <p
//                     className='auth-right-body'
//                     style={{
//                       color: "var(--on-surface-variant)",
//                       fontSize: "0.875rem",
//                     }}>
//                     Learn about the new instantaneous withdrawal features.
//                   </p>
//                 </div>
//                 <span
//                   style={{
//                     color: "var(--primary)",
//                     fontWeight: 700,
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "8px",
//                     fontFamily: "var(--font-display)",
//                   }}>
//                   Read more{" "}
//                   <span
//                     className='material-symbols-outlined'
//                     style={{ fontSize: "1rem" }}>
//                     arrow_forward
//                   </span>
//                 </span>
//               </div>

//               <div
//                 className='stat-card'
//                 style={{
//                   background: "var(--primary-container)",
//                   padding: "2rem",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "space-between",
//                   cursor: "pointer",
//                   transition: "transform 0.2s",
//                 }}>
//                 <div>
//                   <h4
//                     className='table-card-title'
//                     style={{
//                       fontSize: "1.25rem",
//                       marginBottom: "8px",
//                       color: "#fff",
//                     }}>
//                     Referral Rewards
//                   </h4>
//                   <p
//                     style={{
//                       fontSize: "0.875rem",
//                       color: "rgba(255,255,255,0.75)",
//                     }}>
//                     How to earn extra alchemy points by inviting other creators.
//                   </p>
//                 </div>
//                 <span
//                   style={{
//                     color: "#fff",
//                     fontWeight: 700,
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "8px",
//                     fontFamily: "var(--font-display)",
//                   }}>
//                   Read more{" "}
//                   <span
//                     className='material-symbols-outlined'
//                     style={{ fontSize: "1rem" }}>
//                     arrow_forward
//                   </span>
//                 </span>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default HelpCenter;
