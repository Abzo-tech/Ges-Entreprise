import { createContext, useContext, useState, useEffect } from "react";
import api, {
  setSelectedEntreprise as setApiSelectedEntreprise,
} from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [selectedEntreprise, setSelectedEntreprise] = useState(
    localStorage.getItem("selectedEntreprise")
      ? Number(localStorage.getItem("selectedEntreprise"))
      : null
  );
  const [selectedEnterpriseData, setSelectedEnterpriseData] = useState(null);

  useEffect(() => {
    // Check if token exists and is valid
    if (token) {
      import("../utils/jwtDecodeWrapper.js").then(({ jwtDecodeWrapper }) => {
        jwtDecodeWrapper(token)
          .then((decoded) => {
            setUser({
              id: decoded.id,
              role: decoded.role,
              entreprises: decoded.entreprises || [],
            });
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            // Also set token in localStorage to persist
            localStorage.setItem("token", token);
          })
          .catch((error) => {
            console.error("Invalid token:", error);
            setUser(null);
            setToken(null);
            localStorage.removeItem("token");
          })
          .finally(() => {
            setLoading(false);
          });
      });
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  // Ensure axios always sends Authorization header if token exists
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  // Load enterprise data when selectedEntreprise is restored from localStorage
  useEffect(() => {
    if (selectedEntreprise && !selectedEnterpriseData) {
      api
        .get(`/entreprises/${selectedEntreprise}`)
        .then((response) => {
          setSelectedEnterpriseData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching enterprise data on init:", error);
          setSelectedEntreprise(null);
          localStorage.removeItem("selectedEntreprise");
        });
    }
  }, [selectedEntreprise, selectedEnterpriseData]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("selectedEntreprise");
    setToken(null);
    setUser(null);
    setSelectedEntreprise(null);
    setSelectedEnterpriseData(null);
    delete api.defaults.headers.common["Authorization"];
  };

  const selectEntreprise = async (id) => {
    setSelectedEntreprise(id);
    setApiSelectedEntreprise(id);
    if (id) {
      localStorage.setItem("selectedEntreprise", id.toString());
      try {
        const response = await api.get(`/entreprises/${id}`);
        setSelectedEnterpriseData(response.data);
      } catch (error) {
        console.error("Error fetching enterprise data:", error);
        setSelectedEnterpriseData(null);
      }
    } else {
      localStorage.removeItem("selectedEntreprise");
      setSelectedEnterpriseData(null);
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    selectedEntreprise,
    selectedEnterpriseData,
    selectEntreprise,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
