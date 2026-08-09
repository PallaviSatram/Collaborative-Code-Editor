import React from "react";

const VersionCard = ({ version, onClick }) => {
  return (
    <div
      className="version-card"
      onClick={() => onClick(version.id)}
    >

      <div className="version-card-header">
        <strong>
          Version {version.id}
        </strong>
      </div>

      <p className="version-message">
        {version.message}
      </p>

      <div className="version-meta">
        <span>
          👤 {version.username}
        </span>
      </div>

      <div className="version-meta">
        <span>
          💻 {version.language}
        </span>
      </div>

      <div className="version-meta">
        <span>
          🕐{" "}
          {new Date(
            version.created_at
          ).toLocaleString()}
        </span>
      </div>

    </div>
  );
};

export default VersionCard;