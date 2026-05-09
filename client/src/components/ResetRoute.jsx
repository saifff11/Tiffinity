import { Navigate } from 'react-router-dom';

const ResetRoute = ({ children }) => {
  // const { resetSession } = useSelector((state) => state.auth);

  // if (!resetSession) {
  //   // If they haven't started the flow, send them to Forgot Password
  //   return <Navigate to="/forgot-password" replace />;
  // }

  return children;
};

export default ResetRoute;