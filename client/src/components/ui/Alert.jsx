import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export const Alert = ({ type = "success", message }) => {
  if (!message) return null;

  return (
    <div
      className={`bg-${type === "error" ? "red" : "green"}-50 border border-${
        type === "error" ? "red" : "green"
      }-400 text-${
        type === "error" ? "red" : "green"
      }-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-3 sm:mb-4 flex items-center text-xs sm:text-sm`}
    >
      {type === "error" ? (
        <XCircle className="mr-1 sm:mr-2 text-red-500" size={16} />
      ) : (
        <CheckCircle2 className="mr-1 sm:mr-2 text-green-500" size={16} />
      )}
      <span>{message}</span>
    </div>
  );
};