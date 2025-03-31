const NotificationItem = ({ notification, onDismiss }) => (
    <div
      className={`
        p-4 rounded-md mb-2 relative
        ${
          notification.type === "info"
            ? "bg-blue-50 border-blue-200"
            : notification.type === "event"
            ? "bg-purple-50 border-purple-200"
            : notification.type === "warning"
            ? "bg-yellow-50 border-yellow-200"
            : notification.type === "success"
            ? "bg-green-50 border-green-200" // Added success type
            : "bg-red-50 border-red-200"
        }
        border
      `}
    >
      <button
        onClick={() => onDismiss(notification.id)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        aria-label={`Dismiss ${notification.type} notification`}
      >
        ×
      </button>
      <p className="text-gray-800">{notification.message}</p>
      {notification.actionUrl && (
        <a
          href={notification.actionUrl}
          className="text-blue-600 hover:underline mt-2 inline-flex items-center text-sm"
        >
          View Details <ExternalLink size={14} className="ml-1" />
        </a>
      )}
    </div>
  );