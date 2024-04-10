import { deleteUser, fetchUsers, updateUserStatus } from "../../data/api/calls";
import showToast from "../../utils/toastUtils";

const updateUserStatusApi = async (
  action,
  id,
  setShowLoaderPanelBlock,
  setShowLoaderPanelUnblock,
  refetchUsersData,
) => {
  const loaderState =
    action === "block" ? setShowLoaderPanelBlock : setShowLoaderPanelUnblock;

  loaderState(true);

  console.log("caught this id", id);
  try {
    const response = await updateUserStatus(action, id);

    if (response.success === true) {
      showToast(
        "success",
        `user ${action === "block" ? "Blocked" : "Unblocked"}`,
        2000,
      );
      // setReloadUsersData(true);
      refetchUsersData(action);
    } else {
      showToast("error", response.message || "An error occurred", 2000);
    }
  } catch (error) {
    console.error("Error updating user status:", error);
    showToast("error", "An error occurred", 2000);
  } finally {
    loaderState(false);
  }
};

const deleteUserApi = async (
  id,
  setShowLoaderPanelDelete,
  refetchUsersData,
) => {
  setShowLoaderPanelDelete(true);
  try {
    const response = await deleteUser(id);

    if (response.success === true) {
      showToast("success", `User Deleted`, 2000);
      setShowLoaderPanelDelete(false);
      refetchUsersData("delete");
    } else {
      setShowLoaderPanelDelete(false);
      showToast("error", response.message || "An error occurred", 2000);
    }
  } catch (error) {
    setShowLoaderPanelDelete(false);
    console.error("Error deleting user:", error);
    showToast("error", "An error occurred", 2000);
  }
};

export const actionTemplateFunc = (
  props,
  setShowLoaderPanelBlock,
  setShowLoaderPanelDelete,
  setShowLoaderPanelUnblock,
  refetchUsersData,
) => {
  const status = props.status || "active";
  const actionText = status === "active" ? "block" : "unblock";

  return (
    <span className="flex items-center justify-start gap-2 text-xs">
      <span
        onClick={() =>
          updateUserStatusApi(
            actionText,
            props.id,
            setShowLoaderPanelBlock,
            setShowLoaderPanelUnblock,
            refetchUsersData,
          )
        }
        style={{
          backgroundColor: "#D2E7D0",
        }}
        className="px-2 capitalize rounded-2xl text-xs py-1 KwDiffButtonSize flex items-center justify-center cursor-pointer"
      >
        {"Edit"}
      </span>
      <span>|</span>
      <span
        onClick={() =>
          updateUserStatusApi(
            actionText,
            props.id,
            setShowLoaderPanelBlock,
            setShowLoaderPanelUnblock,
            refetchUsersData,
          )
        }
        style={{
          backgroundColor:
            actionText === "block"
              ? "#FBDBC8"
              : actionText === "unblock"
              ? "#D2E7D0"
              : "transparent",
        }}
        className="px-2 capitalize rounded-2xl text-xs py-1 KwDiffButtonSize flex items-center justify-center cursor-pointer"
      >
        {actionText}
      </span>
      <span>|</span>
      <span
        onClick={() =>
          deleteUserApi(props.id, setShowLoaderPanelDelete, refetchUsersData)
        }
        className="px-2 capitalize rounded-2xl text-xs py-1 KwDiffButtonSize flex items-center justify-center cursor-pointer"
        style={{
          backgroundColor: "#FBDBC8",
        }}
      >
        delete
      </span>
    </span>
  );
};
