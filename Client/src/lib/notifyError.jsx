import { toast } from "react-toastify";

export default function notifyError(error) {
  const errMsg =
    error?.response?.data?.message || error?.message || "Something went wrong";
  toast.error(errMsg);
}
