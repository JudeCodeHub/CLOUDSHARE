import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { toast } from "react-hot-toast";
import api from "../config/api";

const AppContext = createContext();

const ROOT_BREADCRUMB = [{ id: null, name: "My Drive" }];

const getErrMsg = (error, fallback) => {
  return error?.response?.data?.error || fallback || "Something went wrong";
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  //upload global state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  //drive view state
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState(ROOT_BREADCRUMB);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [isDriveLoading, setIsDriveLoading] = useState(false);

  //Filter and Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  //Refresh User profile and storage status
  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get("/api/auth/me");
      setUser(data.user);
      return data.user;
    } catch (error) {
      setUser(null);
      return null;
    }
  }, []);

  //check auth status on mount
  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  //Auth action helper function
  const authAction = async (requestFn, successMsg, errorFallback) => {
    try {
      const { data } = await requestFn();
      setUser(data.user);
      if (successMsg) toast.success(successMsg);
      return true;
    } catch (error) {
      toast.error(getErrMsg(error, errorFallback));
      return false;
    }
  };

  const login = (email, password) => {
    return authAction(
      () => api.post("/api/auth/login", { email, password }),
      "Welcome back!",
      "Failed to login",
    );
  };

  const register = (name, email, password) => {
    return authAction(
      () => api.post("/api/auth/register", { name, email, password }),
      "Account created successfully!",
      "Failed to create account",
    );
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(getErrMsg(error, "Failed to logout"));
    }
  };

  const fetchDriveContent = useCallback(
    async (
      folderId = currentFolder?.id,
      search = searchQuery,
      sort = sortBy,
    ) => {
      if (!user) return;
      setIsDriveLoading(true);
      try {
        const parentParam = folderId || "null";
        const [folderRes, fileRes, detailRes] = await Promise.all([
          api.get("/api/folders", {
            params: { parent_id: parentParam },
          }),
          api.get("/api/files", {
            params: { folder_id: parentParam, search, sort },
          }),
          folderId
            ? api.get(`/api/folders/${folderId}`)
            : Promise.resolve({
                data: { folder: null, breadcrumbs: ROOT_BREADCRUMB },
              }),
        ]);
        setFolders(folderRes.data.folders || []);
        setFiles(fileRes.data.files || []);
        setBreadcrumbs(detailRes.data.breadcrumbs || ROOT_BREADCRUMB);
        if (folderId && detailRes.data.folder) {
          setCurrentFolder(detailRes.data.folder);
        } else if (!folderId) {
          setCurrentFolder(null);
        }
      } catch (error) {
        toast.error(getErrMsg(error, "Failed to fetch drive content"));
      } finally {
        setIsDriveLoading(false);
      }
    },
    [user, currentFolder, searchQuery, sortBy],
  );

  const value = {
    user,
    setUser,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user,
    isUploading,
    setIsUploading,
    uploadProgress,
    setUploadProgress,
    refreshUser,
    currentFolder,
    setCurrentFolder,
    currentFolderId: currentFolder?.id || null,
    breadcrumbs,
    setBreadcrumbs,
    folders,
    setFolders,
    files,
    setFiles,
    isDriveLoading,
    fetchDriveContent,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
