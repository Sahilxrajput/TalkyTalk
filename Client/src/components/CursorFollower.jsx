import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";

const CursorFollower = ({ hovering }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const cursorRef = useRef(null);

  // Cursor movement listener
  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  // Animate follower position and size
 
//   useEffect(() => {
//     gsap.to(cursorRef.current, {
//       x: position.x - 20,
//       y: position.y - 20,
//       width: hovering ? 80 : 40,
//       duration: 0.2,
//       ease: "power2.out",
//     });
//   }, [position, hovering]);

useEffect(() => {
  const size = hovering ? 80 : 40;
  gsap.to(cursorRef.current, {
    x: position.x - size / 2,
    y: position.y - size / 2,
    width: size,
    height: size, // Ensure height scales too
    duration: 0.2,
    ease: "power2.out",
  });
}, [position, hovering]);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 aspect-square opacity-10 rounded-full bg-red-500 pointer-events-none z-50 mix-blend-difference"
      style={{ opacity: 0.6 }}
    ></div>
  );
};

export default CursorFollower;
