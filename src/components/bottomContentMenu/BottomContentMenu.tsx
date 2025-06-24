import { useState } from "react";

interface IProps {
  isOpen: boolean;
  handleCloseMenu: () => void;
}

const BottomCommentMenu = ({ isOpen, handleCloseMenu }: IProps) => {
  const [comment, setComment] = useState("");

  return (
    <>
      {/* <button onClick={() => setOpen(true)} style={{ position: "fixed", bottom: 20, left: 20, zIndex: 1000 }}>
        Open Comment
      </button> */}

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={handleCloseMenu}
          className="fixed bottom-0 z-[1000] bg-amber-50"
          // style={{
          //   position: "fixed",
          //   top: 0,
          //   left: 0,
          //   right: 0,
          //   bottom: 0,
          //   backgroundColor: "rgba(0,0,0,0.3)",
          //   zIndex: 999,
          // }}
        />
      )}

      <div
        style={{
          position: "fixed",
          bottom: isOpen ? 0 : "-50vh",
          left: 0,
          right: 0,
          height: "50vh",
          backgroundColor: "white",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.3)",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          padding: 20,
          transition: "bottom 0.3s ease-in-out",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ marginBottom: 12, fontWeight: "bold", fontSize: 18 }}>Write a comment</div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Type your comment here..."
          style={{
            flexGrow: 1,
            resize: "none",
            padding: 10,
            fontSize: 16,
            borderRadius: 8,
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
        <button
          onClick={() => {
            setComment("");
            handleCloseMenu();
          }}
          style={{
            marginTop: 12,
            padding: "10px 20px",
            fontSize: 16,
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
          disabled={!comment.trim()}
        >
          Submit
        </button>
      </div>
    </>
  );
};

export default BottomCommentMenu;
