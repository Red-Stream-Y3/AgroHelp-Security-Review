import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { getUserDetails } from '../api/user';

const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [server, setServer] = useState("http://localhost:9120");

  //toast methods
  const notify = (type, message) => {
		switch (type) {
		case "success":
			toast.success(message);
			break;
		case "error":
			toast.error(message);
			break;
		case "info":
			toast.info(message);
			break;
		case "warning":
			toast.warn(message);
			break;
		default:
			toast(message);
			break;
		}
	};

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await getUserDetails();
        if (userDetails) {
          setUser(userDetails);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [user]);

  return (
    <Context.Provider value={{ user, setUser, server, setServer, notify }}>
        {children}
    </Context.Provider>
  );
};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useGlobalContext = () => useContext(Context);
